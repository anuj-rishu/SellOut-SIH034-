const userStore = require("../store/userStore");
const authService = require("../services/authService");
const museumService = require("../services/museumService");

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
}

module.exports = new ConversationHandler();