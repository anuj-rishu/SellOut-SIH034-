const PDFDocument = require('pdfkit');
const axios = require('axios');

const generateUserPDF = async (userData, qrCode, barcode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const logoResponse = await axios.get('https://res.cloudinary.com/dsxpqhyrv/image/upload/v1737992785/ecell_logo_treaas.png', {
        responseType: 'arraybuffer'
      });
      const logoBuffer = Buffer.from(logoResponse.data);

      // Initialize PDF with autoFirstPage false
      const doc = new PDFDocument({
        size: 'A4',
        margin: 0,
        autoFirstPage: false
      });

      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add a single page
      doc.addPage({
        size: 'A4',
        margin: 0
      });

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const footerHeight = 40;
      const contentHeight = pageHeight - footerHeight;

      // Background with gradient effect
      doc.rect(0, 0, pageWidth, contentHeight).fill('black');
      
      // Top banner with gradient
      doc.rect(0, 0, pageWidth, 80).fill('#16a34a');
      
      // Logo with better positioning
      doc.image(logoBuffer, 20, 20, { 
        width: 60, 
        height: 40,
        align: 'left'
      });

      // Event title
      doc.font('Helvetica-Bold')
         .fontSize(32)
         .fillColor('white')
         .text('E-SUMMIT 25', pageWidth - 250, 25, { align: 'right' });

      // Decorative line
      doc.moveTo(20, 90)
         .lineTo(pageWidth - 20, 90)
         .strokeColor('#16a34a')
         .lineWidth(2)
         .stroke();

      // Event details section
      doc.roundedRect(20, 100, pageWidth - 40, 80, 8)
         .fill('#1a1a1a');

      doc.font('Helvetica-Bold')
         .fontSize(18)
         .fillColor('#16a34a')
         .text('Event Details', 40, 115);

      doc.fontSize(14)
         .fillColor('white')
         .text('Venue:', 40, 140)
         .font('Helvetica')
         .fillColor('#c8c8c8')
         .text('TP GYAN MANCH', 100, 140)
         .font('Helvetica-Bold')
         .fillColor('white')
         .text('Date & Time:', pageWidth/2, 140)
         .font('Helvetica')
         .fillColor('#c8c8c8')
         .text('28 JAN 2025, 4:45 PM', pageWidth/2 + 80, 140);

      // Attendee information
      doc.roundedRect(20, 190, pageWidth - 40, 180, 8)
         .fill('#1a1a1a');

      doc.font('Helvetica-Bold')
         .fontSize(18)
         .fillColor('#16a34a')
         .text('Attendee Information', 40, 205);

      const infoStartY = 235;
      const labelColor = '#ffffff';
      const valueColor = '#c8c8c8';

      // Left column information
      const leftLabels = ['Name:', 'Email:', 'Contact:', 'FA Name:', 'FA Contact:'];
      const leftValues = [userData.name, userData.email, userData.contact, userData.FaName, userData.FaContact];

      leftLabels.forEach((label, i) => {
        doc.font('Helvetica-Bold')
           .fontSize(12)
           .fillColor(labelColor)
           .text(label, 40, infoStartY + (i * 25))
           .font('Helvetica')
           .fillColor(valueColor)
           .text(leftValues[i], 120, infoStartY + (i * 25));
      });

      // Right column information
      const rightStart = pageWidth/2 + 20;
      doc.font('Helvetica-Bold')
         .fillColor(labelColor)
         .text('Department:', rightStart, infoStartY)
         .font('Helvetica')
         .fillColor(valueColor)
         .text(userData.department, rightStart + 80, infoStartY);

      doc.font('Helvetica-Bold')
         .fillColor(labelColor)
         .text('Section:', rightStart, infoStartY + 25)
         .font('Helvetica')
         .fillColor(valueColor)
         .text(userData.section, rightStart + 80, infoStartY + 25);

      // Question section
      doc.roundedRect(20, 380, pageWidth - 40, 100, 8)
         .fill('#1a1a1a');

      doc.font('Helvetica-Bold')
         .fontSize(14)
         .fillColor('#16a34a')
         .text('Question to Speaker:', 40, 395);

      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#c8c8c8')
         .text(userData.QuestionToSpeaker, 40, 415, {
           width: pageWidth - 80,
           align: 'left'
         });

      // QR and Barcode section
      doc.roundedRect(20, 490, pageWidth - 40, 120, 8)
         .fill('#1a1a1a');

      doc.font('Helvetica-Bold')
         .fillColor('#16a34a')
         .fontSize(14)
         .text('Entry Passes', 40, 505);

      // QR Code
      doc.roundedRect(40, 530, 70, 70, 4)
         .fill('white');
      doc.image(qrCode, 45, 535, { width: 60, height: 60 });

      // Barcode
      doc.roundedRect(130, 545, pageWidth - 190, 40, 4)
         .fill('white');
      doc.image(barcode, 135, 550, { width: pageWidth - 200, height: 30 });

      // Footer
      doc.rect(0, contentHeight, pageWidth, footerHeight)
         .fill('#16a34a');

      doc.fontSize(10)
         .fillColor('white')
         .text('This ticket is electronically generated and valid for single entry only.', 0, contentHeight + 10, { align: 'center' })
         .text('For support: support@ecellsrmist.org', 0, contentHeight + 20, { align: 'center' })
         .text(`Generated on: ${new Date().toLocaleString()}`, 0, contentHeight + 30, { align: 'center' });

      doc.end();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      reject(error);
    }
  });
};

module.exports = generateUserPDF;