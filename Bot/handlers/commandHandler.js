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
        return false; // Command not handled
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
      `*Registration Process*\n\n` + 
      `Please enter your full name:`
    );
    return true;
  }

  async startLogin(message, userId) {
    userStore.setUserState(userId, "login_email", {});
    await message.reply(
      `*Login Process*\n\n` + 
      `Please enter your email address:`
    );
    return true;
  }

  async startSearch(message, userId) {
    userStore.setUserState(userId, "search_pincode", {});
    await message.reply(
      `*Museum Search*\n\n` + 
      `Please enter a pincode to find museums nearby:`
    );
    return true;
  }

  async handleBooking(message, userId) {
    if (!userStore.getUserToken(userId)) {
      await message.reply("You need to login first. Use *!login* to authenticate.");
      return true;
    }

    const userData = userStore.getUserData(userId);
    if (!userData.selectedMuseum) {
      await message.reply("Please search for museums first with *!search* and select one before booking.");
      return true;
    }

    const museum = userData.selectedMuseum;
    await message.reply(`Processing your booking request for ${museum.Museum_Name}...`);

    try {
      const bookingData = {
        museumName: museum.Museum_Name,
        museumPincode: museum.PIN_Code,
        museumAddress: museum.Address,
        city: museum.City,
        state: museum.State,
        openingHours: museum.Opening_Hours,
        closingHours: museum.Closing_Hours,
        contactEmail: museum.Contact_Email,
        phoneNumber: museum.Phone_Number,
        fullAddress: museum.Full_Address,
      };

      const token = userStore.getUserToken(userId);
      const result = await museumService.bookTicket(bookingData, token);

      if (result.success) {
        const booking = result.booking;
        await messagingUtils.sendBookingConfirmation(message, booking);
        userStore.clearSelectedMuseum(userId);
      } else {
        await message.reply("Sorry, there was an error with your booking. Please try again later.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      await message.reply(`Sorry, booking failed: ${error.message}. Please try again later.`);
    }
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
}

module.exports = new CommandHandler();