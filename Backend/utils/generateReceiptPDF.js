const PDFDocument = require('pdfkit');
const axios = require('axios');

const generateReceiptPDF = async (user, paymentDetails = {}) => {
  if (!user) throw new Error('User information is required');

  const {
    transactionId = 'N/A',
    amount = '0', 
    method = 'N/A'
  } = paymentDetails;

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  const buffers = [];

  return new Promise(async (resolve, reject) => {
    try {
      // Get logo
      const logoResponse = await axios.get('https://res.cloudinary.com/dsxpqhyrv/image/upload/v1737992785/ecell_logo_treaas.png', {
        responseType: 'arraybuffer'
      });
      const logoBuffer = Buffer.from(logoResponse.data);

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header
      doc.image(logoBuffer, 50, 45, {width: 50})
         .fillColor('#444444')
         .fontSize(20)
         .text('E-CELL SRMIST', 110, 57)
         .fontSize(10)
         .text('SRM Institute of Science and Technology', 110, 80)
         .text('Kattankulathur, Chennai - 603203', 110, 95)
         .moveDown();

      // Receipt title
      doc.fontSize(20)
         .text('PAYMENT RECEIPT', 50, 160, {align: 'center'})
         .moveDown();

      // Receipt details
      doc.fontSize(12)
         .fillColor('#444444');

      // Receipt info table
      const tableTop = 220;
      const leftCol = 70;
      const rightCol = 200;

      doc.font('Helvetica-Bold')
         .text('RECEIPT DETAILS', leftCol, tableTop)
         .moveDown();

      // Draw lines
      doc.strokeColor('#aaaaaa')
         .lineWidth(1)
         .moveTo(leftCol, tableTop + 30)
         .lineTo(500, tableTop + 30)
         .stroke();

      // Receipt details
      const detailsStart = tableTop + 45;
      doc.font('Helvetica')
         .text('Receipt No:', leftCol, detailsStart)
         .text(transactionId, rightCol, detailsStart)
         .text('Date:', leftCol, detailsStart + 25)
         .text(new Date().toLocaleDateString(), rightCol, detailsStart + 25)
         .text('Name:', leftCol, detailsStart + 50)
         .text(user.name, rightCol, detailsStart + 50)
         .text('Email:', leftCol, detailsStart + 75)
         .text(user.email, rightCol, detailsStart + 75)
         .text('Amount Paid:', leftCol, detailsStart + 100)
         .text(`₹${amount}`, rightCol, detailsStart + 100)
         .text('Payment Method:', leftCol, detailsStart + 125)
         .text(method, rightCol, detailsStart + 125)
         .text('Status:', leftCol, detailsStart + 150)
         .text('Paid', rightCol, detailsStart + 150);

      // Bottom line
      doc.strokeColor('#aaaaaa')
         .lineWidth(1)
         .moveTo(leftCol, detailsStart + 190)
         .lineTo(500, detailsStart + 190)
         .stroke();

      // Footer
      doc.fontSize(10)
         .text('This is a computer generated receipt and does not require physical signature.', 50, 700, {align: 'center'})
         .text('For any queries, contact: support@ecellsrmist.org', 50, 720, {align: 'center'});

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateReceiptPDF;