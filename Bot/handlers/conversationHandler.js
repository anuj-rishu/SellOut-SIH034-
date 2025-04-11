const userStore = require("../store/userStore");
const authService = require("../services/authService");
const museumService = require("../services/museumService");
const commandHandler = require("./commandHandler");

class ConversationHandler {
  async handleConversation(message, userId) {
    const content = message.body;
    const state = userStore.getUserState(userId);
    
    if (!state || state.step === "none") {
      return false;
    }

    if (state.step.startsWith("register_")) {
      await this.handleRegistration(message, userId, content, state);
    } else if (state.step.startsWith("login_")) {
      await this.handleLogin(message, userId, content, state);
    } else if (state.step.startsWith("search_")) {
      await this.handleSearch(message, userId, content, state);
    } else if (state.step.startsWith("booking_")) {
      await this.handleBookingProcess(message, userId, content, state);
    }

    return true;
  }

  async handleRegistration(message, userId, content, state) {
    switch (state.step) {
      case "register_name":
        userStore.updateUserData(userId, { name: content });
        userStore.setUserState(userId, "register_email");
        await message.reply("Please enter your email address:");
        break;

      case "register_email":
        userStore.updateUserData(userId, { email: content });
        userStore.setUserState(userId, "register_password");
        await message.reply("Please create a password (minimum 8 characters):");
        break;

      case "register_password":
        userStore.updateUserData(userId, { password: content });
        userStore.setUserState(userId, "register_mobile");
        await message.reply("Please enter your mobile number:");
        break;

      case "register_mobile":
        userStore.updateUserData(userId, { mobile: content });
        userStore.setUserState(userId, "none");
        
        const userData = userStore.getUserData(userId);
        const response = await authService.register({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          mobile: userData.mobile
        });

        if (response.token) {
          userStore.setUserToken(userId, response.token);
          await message.reply(
            `*Registration Successful!* ✅\n\n` +
            `You are now registered and logged in.\n` +
            `You can use *!search* to find museums and book tickets.`
          );
        } else if (response.success) {
          await message.reply(
            `*Registration Successful!* ✅\n\n` +
            `Please use *!login* to access your account.`
          );
        } else {
          await message.reply(
            `Registration failed: ${response.message || "Please try logging in with your credentials."}`
          );
        }
        break;
    }
  }

  async handleLogin(message, userId, content, state) {
    switch (state.step) {
      case "login_email":
        userStore.updateUserData(userId, { email: content });
        userStore.setUserState(userId, "login_password");
        await message.reply("Please enter your password:");
        break;

      case "login_password":
        userStore.updateUserData(userId, { password: content });
        userStore.setUserState(userId, "none");
        
        const userData = userStore.getUserData(userId);
        const response = await authService.login({
          email: userData.email,
          password: userData.password
        });

        if (response.token) {
          userStore.setUserToken(userId, response.token);
          await message.reply(
            `*Login Successful!* ✅\n\n` +
            `You are now logged in.\n` +
            `You can use *!search* to find museums and book tickets.`
          );
        } else {
          await message.reply(
            `Login failed: ${response.message || "Invalid credentials or server error."}`
          );
        }
        break;
    }
  }

  async handleSearch(message, userId, content, state) {
    switch (state.step) {
      case "search_pincode":
        const pincode = content.trim();
        if (!/^\d{6}$/.test(pincode)) {
          await message.reply("Please enter a valid 6-digit pincode.");
          return;
        }

        userStore.setUserState(userId, "search_select_museum");
        await message.reply(`🔍 Searching for museums near pincode ${pincode}...`);
        
        const data = await museumService.searchByPincode(pincode);

        if (data.totalCount > 0) {
          userStore.updateUserData(userId, { museums: data.museums });
          
          let museumList = `*Museums near ${pincode}*\n\n`;
          museumList += `Found ${data.totalCount} museums within ${data.radius}:\n\n`;

          data.museums.forEach((museum, index) => {
            museumList += `*${index + 1}.* ${museum.Museum_Name}\n`;
            museumList += `   📍 ${museum.Full_Address}\n`;
            museumList += `   ⏰ ${museum.Opening_Hours} - ${museum.Closing_Hours}\n`;
            museumList += `   📞 ${museum.Phone_Number}\n\n`;
          });

          museumList += `Reply with the number of the museum you want to book.`;

          await message.reply(museumList);
        } else {
          userStore.setUserState(userId, "none");
          await message.reply(
            `No museums found near pincode ${pincode}. Please try a different pincode with *!search*.`
          );
        }
        break;

      case "search_select_museum":
        const selection = parseInt(content.trim());
        const museums = userStore.getUserData(userId).museums || [];

        if (isNaN(selection) || selection < 1 || selection > museums.length) {
          await message.reply(`Please enter a valid number between 1 and ${museums.length}.`);
          return;
        }

        const selectedMuseum = museums[selection - 1];
        userStore.updateUserData(userId, { selectedMuseum: selectedMuseum });
        userStore.setUserState(userId, "none");

        let confirmMessage = `*Museum Selected* ✅\n\n`;
        confirmMessage += `*${selectedMuseum.Museum_Name}*\n`;
        confirmMessage += `📍 ${selectedMuseum.Full_Address}\n`;
        confirmMessage += `⏰ ${selectedMuseum.Opening_Hours} - ${selectedMuseum.Closing_Hours}\n`;
        confirmMessage += `📧 ${selectedMuseum.Contact_Email}\n`;
        confirmMessage += `📞 ${selectedMuseum.Phone_Number}\n\n`;

        if (userStore.getUserToken(userId)) {
          confirmMessage += `You can now use *!book* to book tickets for this museum.`;
        } else {
          confirmMessage += `Please *!login* or *!register* before booking tickets.`;
        }

        await message.reply(confirmMessage);
        break;
    }
  }

  async handleBookingProcess(message, userId, content, state) {
    switch (state.step) {
      case "booking_date":
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!datePattern.test(content)) {
          await message.reply("Please enter a valid date in DD/MM/YYYY format.");
          return;
        }
        
       
        const [day, month, year] = content.split('/').map(num => parseInt(num, 10));
        const selectedDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          await message.reply("Please select a future date for your visit.");
          return;
        }
        
        userStore.updateUserData(userId, { visitDate: content });
        userStore.setUserState(userId, "booking_time");
        await message.reply("Please enter your preferred visit time (e.g., 10:30 AM):");
        break;
        
      case "booking_time":
        const timePattern = /^([1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        if (!timePattern.test(content)) {
          await message.reply("Please enter a valid time in format like '10:30 AM' or '2:00 PM'.");
          return;
        }
        
        userStore.updateUserData(userId, { visitTime: content });
        userStore.setUserState(userId, "booking_visitors");
        await message.reply("Please enter the number of visitors (maximum 10):");
        break;
        
      case "booking_visitors":
        const visitors = parseInt(content.trim());
        if (isNaN(visitors) || visitors < 1 || visitors > 10) {
          await message.reply("Please enter a valid number of visitors between 1 and 10.");
          return;
        }
        
        userStore.updateUserData(userId, { numberOfVisitors: visitors });
        userStore.setUserState(userId, "booking_confirm");
        
        const userData = userStore.getUserData(userId);
        const museum = userData.selectedMuseum;
        
        let summaryMessage = `*Booking Summary*\n\n`;
        summaryMessage += `*Museum:* ${museum.Museum_Name}\n`;
        summaryMessage += `*Date:* ${userData.visitDate}\n`;
        summaryMessage += `*Time:* ${userData.visitTime}\n`;
        summaryMessage += `*Visitors:* ${userData.numberOfVisitors}\n\n`;
        summaryMessage += `Reply with 'confirm' to proceed with booking or 'cancel' to abort.`;
        
        await message.reply(summaryMessage);
        break;
        
      case "booking_confirm":
        if (content.trim().toLowerCase() === 'confirm') {
          const userData = userStore.getUserData(userId);
          const museum = userData.selectedMuseum;
          
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
              visitDate: userData.visitDate,
              visitTime: userData.visitTime,
              numberOfVisitors: userData.numberOfVisitors
            };
            
            const token = userStore.getUserToken(userId);
            await message.reply("Processing your booking request...");
            
            const result = await museumService.bookTicket(bookingData, token);
            
            if (result.success) {
             
              await commandHandler.sendBookingConfirmation(message, {
                ...result.booking,
                museumName: museum.Museum_Name,
                visitDate: userData.visitDate,
                visitTime: userData.visitTime,
                numberOfVisitors: userData.numberOfVisitors
              });
              
              userStore.clearSelectedMuseum(userId);
            } else {
              await message.reply(`Booking failed: ${result.message || "Please try again later."}`);
            }
          } catch (error) {
            console.error("Booking error:", error);
            await commandHandler.handleBookingError(message, error);
          }
        } else if (content.trim().toLowerCase() === 'cancel') {
          await message.reply("Booking has been cancelled. You can start a new booking with *!book* anytime.");
        } else {
          await message.reply("Please reply with 'confirm' to proceed with booking or 'cancel' to abort.");
          return;
        }
        
        userStore.setUserState(userId, "none");
        break;
    }
  }
}

module.exports = new ConversationHandler();