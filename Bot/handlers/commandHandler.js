const { MessageMedia } = require("whatsapp-web.js");
const userStore = require("../store/userStore");
const messagingUtils = require("../utils/messagingUtils");
const museumService = require("../services/museumService");

class CommandHandler {
  async handleCommand(message, command) {
    const userId = message.from;

    switch (command) {
      case "!help":
        return this.showHelp(message);
      case "!register":
        return this.startRegistration(message, userId);
      case "!login":
        return this.startLogin(message, userId);
      case "!search":
        return this.startSearch(message, userId);
      case "!book":
        return this.handleBooking(message, userId);
      case "!logout":
        return this.handleLogout(message, userId);
      case "hi":
      case "hello":
        return this.showWelcomeMessage(message);
      default:
        return false; 
    }
  }

  async showHelp(message) {
    await message.reply(
      `*Museum Ticket Booking Bot*\n\n` +
        `Available commands:\n` +
        `!register - Create a new account\n` +
        `!login - Log in to your account\n` +
        `!search - Search for museums near a pincode\n` +
        `!book - Book a museum ticket (requires login)\n` +
        `!logout - Log out from your account\n` +
        `!help - Show this help message`
    );
    return true;
  }

  async startRegistration(message, userId) {
    userStore.setUserState(userId, "register_name", {});
    await message.reply(
      `*Registration Process*\n\n` + `Please enter your full name:`
    );
    return true;
  }

  async startLogin(message, userId) {
    userStore.setUserState(userId, "login_email", {});
    await message.reply(
      `*Login Process*\n\n` + `Please enter your email address:`
    );
    return true;
  }

  async startSearch(message, userId) {
    userStore.setUserState(userId, "search_pincode", {});
    await message.reply(
      `*Museum Search*\n\n` + `Please enter a pincode to find museums nearby:`
    );
    return true;
  }

  async handleBooking(message, userId) {
    if (!userStore.getUserToken(userId)) {
      await message.reply(
        "You need to login first. Use *!login* to authenticate."
      );
      return true;
    }

    const userData = userStore.getUserData(userId);
    if (!userData.selectedMuseum) {
      await message.reply(
        "Please search for museums first with *!search* and select one before booking."
      );
      return true;
    }

    // Start the booking process by asking for the visit date
    userStore.setUserState(userId, "booking_date");
    await message.reply(
      `*Booking Process for ${userData.selectedMuseum.Museum_Name}*\n\n` +
        `Please enter your visit date in DD/MM/YYYY format:`
    );
    return true;
  }

  async handleLogout(message, userId) {
    if (userStore.getUserToken(userId)) {
      userStore.removeUserToken(userId);
      await message.reply("You have been successfully logged out.");
    } else {
      await message.reply("You are not currently logged in.");
    }
    return true;
  }

  async showWelcomeMessage(message) {
    await message.reply(
      `👋 Welcome to the Museum Ticket Booking Bot!\n\n` +
        `I can help you book tickets to museums near you.\n` +
        `Please use *!register* to create an account or *!login* if you already have one.\n` +
        `Then use *!search* to find museums by pincode.\n` +
        `Type *!help* for more information.`
    );
    return true;
  }

  async sendBookingConfirmation(message, bookingData) {
    try {
      const confirmationMessage =
        `*Booking Confirmed!* ✅\n\n` +
        `Your booking reference: *${
          bookingData.bookingId || bookingData._id || "N/A"
        }*\n` +
        `Museum: ${bookingData.museumName}\n` +
        `Date: ${bookingData.visitDate}\n` +
        `Time: ${bookingData.visitTime}\n` +
        `Visitors: ${bookingData.numberOfVisitors}\n\n` +
        `Please arrive 15 minutes before your visit time. Enjoy your visit!`;

      await message.reply(confirmationMessage);

    
      if (bookingData.qrCode || bookingData.qrCodeRaw) {
        try {
     
          let qrData = null;
          if (bookingData.qrCode) {
            if (
              typeof bookingData.qrCode === "string" &&
              bookingData.qrCode.startsWith("data:image/png;base64,")
            ) {
              qrData = bookingData.qrCode.split(",")[1];
            } else {
              qrData = bookingData.qrCode;
            }
          } else if (bookingData.qrCodeRaw) {
            qrData = bookingData.qrCodeRaw;
          }

          if (qrData) {
           
            const chat = await message.getChat();
            const media = new MessageMedia(
              "image/png",
              qrData,
              "booking-qr.png"
            );

            await chat.sendMessage(media, { caption: "Your booking QR code" });
          }
        } catch (qrError) {
          console.error("QR code sending error:", qrError);
          await message.reply(
            "Your booking was successful, but there was an error generating the QR code. You can view it on our website."
          );
        }
      } else {
        console.log("No QR code data available in the booking");
      }
    } catch (error) {
      console.error("Error sending booking confirmation:", error);
      await message.reply(
        "Booking was successful, but there was an error sending the confirmation details."
      );
    }
  }

  async handleBookingError(message, error) {
    console.error("Booking error:", error);
    let errorMessage = "Sorry, there was an error processing your booking.";

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = `Booking failed: ${error.response.data.message}`;
    } else if (error.message) {
      errorMessage = `Booking failed: ${error.message}`;
    }

    await message.reply(errorMessage);
  }
}

module.exports = new CommandHandler();
