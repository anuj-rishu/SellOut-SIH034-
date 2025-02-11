require("dotenv").config();
const PDFDocument = require("pdfkit");
const qr = require("qrcode");
const path = require("path");
const fs = require("fs");
const Scan = require("../models/Scan");
const s3 = require("../config/aws");

class CertificateController {
  /**
   * Cleanup temporary files
   * @param {string[]} files - Array of file paths to delete
   */
  static async cleanupFiles(files) {
    for (const file of files) {
      try {
        if (fs.existsSync(file)) {
          await fs.promises.unlink(file);
        }
      } catch (err) {
        console.error(`Cleanup error for ${file}:`, err);
      }
    }
  }

  /**
   * Get certificate by email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getCertificate(req, res) {
    const { email } = req.query;

    try {
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const scan = await Scan.findOne({ email });
      if (!scan) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!scan.certificateUrl) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      return res.json({ downloadUrl: scan.certificateUrl });
    } catch (error) {
      console.error("Get certificate error:", error);
      return res.status(500).json({
        error: "Failed to get certificate",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Generate new certificate
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async generateCertificate(req, res) {
    const { email } = req.body;
    const tempFiles = [];

    try {
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const scan = await Scan.findOne({ email });
      if (!scan) {
        return res.status(404).json({ error: "User not found" });
      }

      if (scan.certificateUrl) {
        return res.json({ downloadUrl: scan.certificateUrl });
      }

      const timestamp = Date.now();
      const tempPdfPath = path.join(
        process.env.TEMP_DIR,
        `certificate_${timestamp}.pdf`
      );
      const qrPath = path.join(process.env.TEMP_DIR, `qr_${timestamp}.png`);
      tempFiles.push(tempPdfPath, qrPath);

      // Generate QR code
      await qr.toFile(qrPath, `${process.env.VERIFICATION_URL}/${scan.scanId}`);

      // Create PDF
      const doc = new PDFDocument({
        size: [842, 595], // A4 Landscape
        margin: 0,
      });

      doc.pipe(fs.createWriteStream(tempPdfPath));

      // Add background pattern
      for (let i = 0; i < doc.page.width; i += 20) {
        for (let j = 0; j < doc.page.height; j += 20) {
          doc.circle(i, j, 0.5).fill("#e3e3e3");
        }
      }

      // Add main background
      doc
        .rect(0, 0, doc.page.width, doc.page.height)
        .fill("rgba(245, 245, 245, 0.95)");

      // Add gradient border
      const gradient = doc.linearGradient(0, 0, doc.page.width, 0);
      gradient.stop(0, "#1a237e").stop(0.5, "#303f9f").stop(1, "#1a237e");

      doc
        .rect(15, 15, doc.page.width - 30, doc.page.height - 30)
        .lineWidth(3)
        .stroke(gradient);

      // Add corner decorations with gradient
      const cornerSize = 50;
      [
        [20, 20],
        [doc.page.width - 70, 20],
        [20, doc.page.height - 70],
        [doc.page.width - 70, doc.page.height - 70],
      ].forEach(([x, y]) => {
        doc
          .polygon([x, y], [x + cornerSize, y], [x, y + cornerSize])
          .fill(gradient);
      });

      // Add logo
      if (fs.existsSync(path.join(__dirname, "../assets/logo.png"))) {
        doc.image(
          path.join(__dirname, "../assets/logo.png"),
          doc.page.width / 2 - 50,
          40,
          { width: 100 }
        );
      }

      // Add certificate content
      doc
        .font("Helvetica-Bold")
        .fontSize(42)
        .fillColor("#1a237e")
        .text("Certificate of Completion", 0, 140, { align: "center" });

      doc
        .font("Helvetica")
        .fontSize(18)
        .fillColor("#424242")
        .text("This is to certify that", 0, 210, { align: "center" });

      doc
        .font("Helvetica-Bold")
        .fontSize(32)
        .fillColor("#303f9f")
        .text(scan.name, 0, 250, { align: "center" });

      doc
        .font("Helvetica")
        .fontSize(18)
        .fillColor("#424242")
        .text(
          "has successfully completed the program with distinction",
          0,
          310,
          { align: "center" }
        );

      // Add QR code with border
      doc
        .rect(doc.page.width - 160, doc.page.height - 160, 120, 120)
        .lineWidth(1)
        .stroke("#303f9f");

      doc.image(qrPath, doc.page.width - 150, doc.page.height - 150, {
        width: 100,
      });

      // Add verification text
      doc
        .fontSize(10)
        .fillColor("#666")
        .text(
          `Certificate ID: ${scan.scanId}`,
          doc.page.width - 200,
          doc.page.height - 30
        );

      doc.text(
        `Issued on: ${new Date().toLocaleDateString()}`,
        50,
        doc.page.height - 30
      );

      // Add signature lines
      [
        [100, "Authorized Signature"],
        [300, "Program Director"],
      ].forEach(([x, title]) => {
        doc
          .moveTo(x, doc.page.height - 80)
          .lineTo(x + 180, doc.page.height - 80)
          .stroke("#424242");

        doc.fontSize(12).text(title, x, doc.page.height - 70);
      });

      doc.end();

      // Wait for PDF to be written
      await new Promise((resolve) => {
        doc.on("end", resolve);
      });

      // Upload to S3
      const pdfBytes = await fs.promises.readFile(tempPdfPath);

      const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `certificates/${scan.scanId}_${timestamp}.pdf`,
        Body: pdfBytes,
        ContentType: "application/pdf",
        CacheControl: "public, max-age=31536000",
      };

      const s3Response = await s3.upload(s3Params).promise();

      scan.certificateUrl = s3Response.Location;
      scan.certificateGeneratedAt = new Date();
      await scan.save();

      await CertificateController.cleanupFiles(tempFiles);
      return res.json({ downloadUrl: s3Response.Location });
    } catch (error) {
      console.error("Certificate generation error:", error);
      await CertificateController.cleanupFiles(tempFiles);
      return res.status(500).json({
        error: "Failed to generate certificate",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Health check endpoint
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async healthCheck(req, res) {
    return res.status(200).json({
      status: "healthy",
      message: "Certificate service is running",
    });
  }

  /**
   * Download certificate
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async downloadCertificate(req, res) {
    const { certificateUrl } = req.query;

    try {
      if (!certificateUrl) {
        return res.status(400).json({ error: "Certificate URL is required" });
      }

      // Parse the S3 key from the URL
      const urlParts = new URL(certificateUrl);
      const key = urlParts.pathname.substring(1); // Remove leading slash

      const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      };

      // Get file from S3
      const file = await s3.getObject(s3Params).promise();

      // Set headers for file download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=certificate.pdf"
      );
      res.setHeader("Content-Length", file.ContentLength);

      // Send file to client
      return res.send(file.Body);
    } catch (error) {
      console.error("Certificate download error:", error);
      return res.status(500).json({
        error: "Failed to download certificate",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  //verify certificate
  static async verifyCertificate(req, res) {
    try {
      console.log("Received request for scanId:", req.params.scanId);
      const scan = await Scan.findOne({ scanId: req.params.scanId });
      if (!scan) {
        console.log("Certificate not found for scanId:", req.params.scanId);
        return res.status(404).send("Certificate not found");
      }
      res.json(scan);
    } catch (error) {
      console.error("Error fetching certificate:", error);
      res.status(500).send("Server error");
    }
  }
}

module.exports = CertificateController;
