const adminTemplates = {
  passwordChangeOTP: (otp) => `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4f46e5; margin: 0;">E-Cell Console</h1>
                <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-top: 0;">Password Change Request</h2>
                
                <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                    Use the following OTP to change your password:
                </p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                    <p style="color: #4f46e5; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0;">
                        ${otp}
                    </p>
                </div>
                
                <p style="color: #374151; font-size: 14px; margin-bottom: 0;">
                    • This OTP will expire in 5 minutes<br>
                    • For security, please don't share this OTP with anyone
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

  contactReply: (name, replyMessage) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0;">E-CELL-SRMIST</h1>
            <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Response to Your Inquiry</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                Dear ${name},
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                    ${replyMessage}
                </p>
            </div>
            
            <p style="color: #374151; font-size: 14px; margin-bottom: 0;">
                If you have any further questions, please don't hesitate to reach out to us.
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

  passwordChangeOTP: (otp) => `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4f46e5; margin: 0;">E-Cell Console</h1>
              <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Password Change Request</h2>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                  Use the following OTP to change your password:
              </p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                  <p style="color: #4f46e5; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0;">
                      ${otp}
                  </p>
              </div>
              
              <p style="color: #374151; font-size: 14px; margin-bottom: 0;">
                  • This OTP will expire in 5 minutes<br>
                  • For security, please don't share this OTP with anyone
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

  wrongCredentialsAlert: (ipAddress = "Unknown", deviceInfo = "Unknown") => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0;">E-Cell Console</h1>
            <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Security Alert</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                We detected a failed login attempt on your account. If this wasn't you, please take immediate action.
            </p>
            
            <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                <p style="color: #dc2626; font-size: 16px; font-weight: bold; margin: 0;">
                    Invalid credentials were used to access your account
                </p>
            </div>
            
            <div style="color: #374151; font-size: 14px; margin-bottom: 20px;">
                <p style="margin: 5px 0;">Details:</p>
                <ul style="list-style: none; padding-left: 0;">
                    <li>📅 Time: ${new Date().toLocaleString("en-US", {
                      timeZone: "Asia/Kolkata",
                    })}</li>
                    <li>🌐 IP Address: ${ipAddress}</li>
                    <li>💻 Device: ${deviceInfo}</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>

            <p style="color: #374151; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                If you need assistance, please contact our support team at support@ecellsrmist.org
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 12px;">
                © ${new Date().getFullYear()} E-Cell-SRMIST. All rights reserved.<br>
                <a href="#" style="color: #4f46e5; text-decoration: none;">Unsubscribe from security alerts</a>
            </p>
        </div>
    </div>
</body>
</html>
`,

  loginSuccessAlert: (ipAddress = "Unknown", deviceInfo = "Unknown") => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0;">E-Cell Console</h1>
            <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Successful Login</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                Your account was successfully accessed from a new device.
            </p>
            
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                <p style="color: #059669; font-size: 16px; font-weight: bold; margin: 0;">
                    Login successful
                </p>
            </div>
            
            <div style="color: #374151; font-size: 14px; margin-bottom: 20px;">
                <p style="margin: 5px 0;">Login Details:</p>
                <ul style="list-style: none; padding-left: 0;">
                    <li>📅 Time: ${new Date().toLocaleString("en-US", {
                      timeZone: "Asia/Kolkata",
                    })}</li>
                    <li>🌐 IP Address: ${ipAddress}</li>
                    <li>💻 Device: ${deviceInfo}</li>
                </ul>
            </div>

            <p style="color: #374151; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                If this wasn't you, please contact our support team immediately at support@ecellsrmist.org
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 12px;">
                © ${new Date().getFullYear()} E-Cell-SRMIST. All rights reserved.<br>
                <a href="#" style="color: #4f46e5; text-decoration: none;">Manage email preferences</a>
            </p>
        </div>
    </div>
</body>
</html>
`,

  emailChangeOTP: (otp) => `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4f46e5; margin: 0;">E-Cell Console</h1>
              <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Email Change Request</h2>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                  Use the following OTP to verify your new email address:
              </p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                  <p style="color: #4f46e5; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0;">
                      ${otp}
                  </p>
              </div>
              
              <p style="color: #374151; font-size: 14px; margin-bottom: 0;">
                  • This OTP will expire in 5 minutes<br>
                  • For security, please don't share this OTP with anyone
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

  passwordResetOTP: (otp) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0;">E-Cell Console</h1>
            <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                We received a request to reset your password. Use the OTP below to complete the process:
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                <p style="color: #4f46e5; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0;">
                    ${otp}
                </p>
            </div>
            
            <p style="color: #374151; font-size: 14px; margin-bottom: 0;">
                • This OTP will expire in 10 minutes<br>
                • If you didn't request this password reset, please ignore this email<br>
                • For security, please don't share this OTP with anyone
            </p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
        <p style="color: #6b7280; font-size: 12px;">
            © ${new Date().getFullYear()} E-Cell Console. All rights reserved.<br>
            Made with ❤️ by Team Web Dev
        </p>
    </div>
</div>
</body>
</html>
`,

  newMemberWelcome: (name, email, domain, role, tempPassword) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin: 0;">E-Cell Console</h1>
            <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Welcome ${name}!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                Your account has been created successfully. Here are your account details:
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="color: #374151; margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                <p style="color: #374151; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="color: #374151; margin: 5px 0;"><strong>Domain:</strong> ${domain}</p>
                <p style="color: #374151; margin: 5px 0;"><strong>Role:</strong> ${role}</p>
                <p style="color: #374151; margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
            </div>
            
            <p style="color: #dc2626; font-size: 14px; margin-bottom: 0;">
    Please <a href="https://console.ecellsrmist.org" style="color: #dc2626;">login</a> and change your password immediately for security purposes.
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

  ticketEmail: (name) => `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4f46e5; margin: 0;">E-Cell Console</h1>
                <div style="width: 50px; height: 3px; background: linear-gradient(to right, #4f46e5, #7c3aed); margin: 10px auto;"></div>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-top: 0;">Your Event Ticket</h2>
                
                <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                    Dear ${name},<br><br>
                    Thank you for registering! Your event ticket QR code is attached to this email.
                </p>
                
                <p style="color: #374151; font-size: 14px; margin-top: 20px;">
                    Please show this QR code at the event entrance for verification.
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

module.exports = adminTemplates;
