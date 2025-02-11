const PDFDocument = require('pdfkit');

const generateTicketPDF = async (name, eventName, qrCode, ticketId) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40
    });

    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Add background pattern
    doc.rect(0, 0, doc.page.width, doc.page.height)
       .fill('#f6f6f6');

    // Add border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .stroke('#333333');

    // Header section
    doc.fontSize(30)
       .font('Helvetica-Bold')
       .fillColor('#333333')
       .text('EVENT TICKET', 50, 60, { align: 'center' });

    doc.moveDown()
       .fontSize(12)
       .font('Helvetica')
       .fillColor('#666666')
       .text(`Ticket #${ticketId || Date.now()}`, { align: 'center' });

    // Event details section
    doc.roundedRect(50, 150, doc.page.width - 100, 150, 10)
       .fillAndStroke('#ffffff', '#cccccc');

    doc.fillColor('#333333')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text(eventName || 'Event Name', 70, 170);

    doc.fontSize(12)
       .font('Helvetica')
       .text(`Date: ${new Date().toLocaleDateString()}`, 70, 200)
       .text(`Time: 7:00 PM`, 70, 220)
       .text(`Venue: Event Center`, 70, 240)
       .text(`Attendee: ${name}`, 70, 260);

    // QR Code section
    doc.roundedRect(50, 320, doc.page.width - 100, 250, 10)
       .fillAndStroke('#ffffff', '#cccccc');

    doc.image(Buffer.from(qrCode.split(',')[1], 'base64'), {
      x: (doc.page.width - 180) / 2,
      y: 340,
      fit: [180, 180],
      align: 'center'
    });

    // Footer sections
    doc.fontSize(10)
       .fillColor('#666666')
       .text('Please present this ticket at the event entrance', 50, 600, { 
         align: 'center' 
       })
       .moveDown(0.5)
       .text('This ticket is valid for one-time entry only', { 
         align: 'center',
         fontSize: 8
       });

    doc.fontSize(8)
       .fillColor('#999999')
       .text('Powered by ECELL-SRMIST', 50, doc.page.height - 50, {
         align: 'center'
       });

    doc.end();
  });
};

module.exports = { generateTicketPDF };