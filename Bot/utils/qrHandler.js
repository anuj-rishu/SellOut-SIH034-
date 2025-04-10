const fs = require('fs');
const qrcode = require('qrcode-terminal');
const http = require('http');

class QrHandler {
  constructor() {
    this.currentQR = null;
    this.server = null;
  }

  startServer() {
    if (this.server) return;
    
    this.server = http.createServer((req, res) => {
      if (req.url === '/qr') {
        if (this.currentQR) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <head><title>WhatsApp QR Code</title></head>
              <body>
                <h1>WhatsApp QR Code</h1>
                <p>Scan this QR code with WhatsApp to log in:</p>
                <img src="data:image/png;base64,${this.currentQR}" />
              </body>
            </html>
          `);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<html><body><h1>No QR code available yet or already authenticated</h1></body></html>');
        }
      } else {
        res.writeHead(404);
        res.end();
      }
    }).listen(8080, () => {
      console.log('QR code server running at http://localhost:8080/qr');
      console.log('On EC2, access via http://[your-ec2-public-ip]:8080/qr');
    });
  }

  handleQr(qr) {
    console.log('WhatsApp QR code received');
    
    // Generate and display QR in terminal
    qrcode.generate(qr, { small: true });
    
    // Save QR code to file
    const qrImageLib = require('qrcode');
    qrImageLib.toDataURL(qr, (err, url) => {
      if (err) {
        console.error('Error generating QR image:', err);
        return;
      }
      
      // Extract base64 data and save
      this.currentQR = url.split(',')[1];
      
      // Start web server if not already running
      this.startServer();
      
      console.log('QR code is now available at http://localhost:8080/qr');
    });
  }

  clearQr() {
    this.currentQR = null;
    console.log('WhatsApp authentication complete. QR code cleared.');
  }
}

module.exports = new QrHandler();