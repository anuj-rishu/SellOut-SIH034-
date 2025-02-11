const userTemplates = {
    //user
    contactConfirmation: (name) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #4f46e5; margin: 0;">E-Cell Console</h1>
                  <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
              </div>
              
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <h2 style="color: #1f2937; margin-top: 0;">Hello ${name}!</h2>
                  
                  <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                      We have received your message and will get back to you soon. Thank you for contacting us.
                  </p>
              </div>
  
              <div style="text-align: center; margin-top: 20px;">
                  <p style="color: #6b7280; font-size: 12px;">
                      © ${new Date().getFullYear()} E-Cell-SRMIST. All rights reserved.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `,
  
    //user
    taskAssignment: (name, taskDetails) => `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { margin: 0; padding: 0; position: relative; }
              .container { position: absolute; top: 0; left: 50%; transform: translateX(-50%); }
          </style>
      </head>
      <body>
          <div class="container" style="width: 100%; max-width: 600px;">
              <!-- Header -->
              <div style="background-color: #1a237e; padding: 8px; text-align: center;">
                  <h2 style="color: white; margin: 0; padding: 0; font-size: 18px;">E-CELL SRMIST</h2>
              </div>
              
              <!-- Content -->
              <div style="padding: 15px; background-color: #ffffff;">
                  <p style="margin: 0 0 10px;">Dear ${name},</p>
                  <p style="margin: 5px 0;">A new task has been assigned to you:</p>
                  <div style="background-color: #f5f5f5; padding: 10px; margin: 10px 0; border-left: 4px solid #1a237e;">
                      ${taskDetails}
                  </div>
                  <p style="margin: 5px 0;">Please: review details, note deadlines, reach out if needed.</p>
                  <p style="margin: 10px 0 5px;">Best regards,<br>E-CELL Team, SRMIST</p>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; padding: 8px; background-color: #f5f5f5; font-size: 11px; color: #666666;">
                  <p style="margin: 0;">Automated email - Do not reply | © ${new Date().getFullYear()} E-CELL SRMIST</p>
              </div>
          </div>
      </body>
      </html>
  `,
  registrationConfirmation: (name) => `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4f46e5; margin: 0;">E-Cell Console</h1>
              <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${name}!</h2>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                  Thank you for registering. Please find your details and QR code attached in the PDF document.
              </p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
              <p style="color: #6b7280; font-size: 12px;">
                  © ${new Date().getFullYear()} E-Cell-SRMIST. All rights reserved.
              </p>
          </div>
      </div>
  </body>
  </html>
`,

  };
  
  module.exports = userTemplates;
  