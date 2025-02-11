const express = require("express");
const certificaterouter = express.Router();
const CertificateController = require("../controllers/certificateController");
const setupSecurity = require("../middleware/security");
const setupLogger = require("../middleware/logger");
const setupTempDir = require("../utils/tempDir");

// Setup middleware
setupSecurity(certificaterouter)
setupLogger(certificaterouter);

// Setup temp directory
const tempDir = setupTempDir();
process.env.TEMP_DIR = tempDir;

// Routes
certificaterouter.get("/health", CertificateController.healthCheck);
certificaterouter.post(
  "/generate-certificate",
  CertificateController.generateCertificate
);

certificaterouter.get(
  "/download",
  CertificateController.downloadCertificate
);

certificaterouter.get(
  "/verify/:scanId",
  CertificateController.verifyCertificate
);

module.exports = certificaterouter;
