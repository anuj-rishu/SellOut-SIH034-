require("dotenv").config();
const adminTemplates = require("./templates/admin");
const userTemplates = require("./templates/user");
const { generateTicketPDF } = require("../utils/ticketpdf");
const transporter = require("../config/mail");
const generateUserPDF = require("../utils/generateUserPDF");
const generateReceiptPDF = require("../utils/generateReceiptPDF");


const mailer = {
  sendPasswordChangeOTP: async (email, otp) => {
    return transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Change OTP",
      text: adminTemplates.passwordChangeOTP(otp),
    });
  },



  invaildCredentialsMail: async (email, ipAddress, deviceInfo) => {
    if (!email) {
      throw new Error("Email is required");
    }

    try {
      const mailOptions = {
        from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
        to: email,
        subject: "Failed Login Attempt",
        html: adminTemplates.wrongCredentialsAlert(ipAddress, deviceInfo),
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("Mail sending failed:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  },

  sendPasswordResetOTP: async (email, otp) => {
    return transporter.sendMail({
      from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
      to: email,
      subject: "Password Reset OTP",
      html: adminTemplates.passwordResetOTP(otp),
    });
  },

  sendEmailChangeOTP: async (email, otp) => {
    return transporter.sendMail({
      from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
      to: email,
      subject: "Email Change OTP",
      html: adminTemplates.emailChangeOTP(otp),
    });
  },

  loginSuccessMail: async (email, ipAddress, deviceInfo) => {
    if (!email) throw new Error("Email is required");

    try {
      await transporter.sendMail({
        from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
        to: email,
        subject: "Successful Login to E-Cell Console",
        html: adminTemplates.loginSuccessAlert(ipAddress, deviceInfo),
      });
      console.log(`Login success notification sent to ${email}`);
    } catch (error) {
      console.error("Failed to send login notification:", error);
      throw error;
    }
  },

  sendContactConfirmation: async (name, email) => {
    return transporter.sendMail({
      from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
      to: email,
      subject: "We received your message!",
      html: userTemplates.contactConfirmation(name),
    });
  },

  sendContactReply: async (name, email, replyMessage) => {
    return transporter.sendMail({
      from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
      to: email,
      subject: "Reply to your message",
      html: adminTemplates.contactReply(name, replyMessage),
    });
  },

  sendBulkEmails: async (users, subject, text) => {
    const emailPromises = users.map((user) => {
      return transporter.sendMail({
        from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
        to: user.email,
        subject: subject || `You are selected for ${user.domain}`,
        html: adminTemplates.bulkEmail(user, text),
      });
    });
    return Promise.all(emailPromises);
  },

  sendTaskEmail: async (email, name, taskDetails) => {
    return transporter.sendMail({
      from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
      to: email,
      subject: `Task Assigned: ${taskDetails}`,
      html: adminTemplates.taskAssignment(name, taskDetails),
    });
  },

  // Member management emails
  sendNewMemberWelcome: async (name, email, domain, role, tempPassword) => {
    return transporter.sendMail({
      from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
      to: email,
      subject: "Welcome to the Team!",
      html: adminTemplates.newMemberWelcome(
        name,
        email,
        domain,
        role,
        tempPassword
      ),
    });
  },

  //send ticket to user
  sendTicketEmail: async (name, email, qrCode, eventName) => {
    try {
      const pdfBuffer = await generateTicketPDF(name, eventName, qrCode);

      const result = await transporter.sendMail({
        from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
        to: email,
        subject: "Your Event Ticket",
        html: adminTemplates.ticketEmail(name),
        attachments: [
          {
            filename: "event-ticket.pdf",
            content: pdfBuffer,
          },
        ],
      });

      return result;
    } catch (error) {
      console.error("Error sending ticket:", error);
      throw error;
    }
  },

    sendRegistrationConfirmation: async (user, qrCode, barcode, paymentDetails) => {
      try {
        const registrationPdfBuffer = await generateUserPDF(user, qrCode, barcode);
        const receiptPdfBuffer = await generateReceiptPDF(user, paymentDetails);
  
        const mailOptions = {
          from: '"E-CELL SRMIST" <' + process.env.EMAIL + ">",
          to: user.email,
          subject: "Registration Successful",
          html: userTemplates.registrationConfirmation(user.name),
          attachments: [
            {
              filename: `${user.uniqueId}_registration.pdf`,
              content: registrationPdfBuffer,
            },
            {
              filename: `${user.uniqueId}_receipt.pdf`,
              content: receiptPdfBuffer,
            },
          ],
        };
  
        const info = await transporter.sendMail(mailOptions);
        console.log("Registration and receipt email sent:", info.messageId);
        return info;
      } catch (error) {
        console.error("Error sending registration emails:", error);
        throw error;
      }
    },
};

module.exports = mailer;
