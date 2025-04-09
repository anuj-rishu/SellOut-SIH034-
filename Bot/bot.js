const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

const userStates = {};
const userTokens = {};

client.on("qr", (qr) => {
  console.log("QR RECEIVED. Scan this QR code with your WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

client.on("message", async (message) => {
  const content = message.body.toLowerCase();
  const userId = message.from;

  if (!userStates[userId]) {
    userStates[userId] = {
      step: "none",
      data: {},
    };
  }

  if (userStates[userId].step !== "none") {
    await handleConversationFlow(message, userId);
    return;
  }

  // Help command
  if (content === "!help") {
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
  } else if (content === "!register") {
    userStates[userId] = {
      step: "register_name",
      data: {},
    };
    await message.reply(
      `*Registration Process*\n\n` + `Please enter your full name:`
    );
  } else if (content === "!login") {
    userStates[userId] = {
      step: "login_email",
      data: {},
    };
    await message.reply(
      `*Login Process*\n\n` + `Please enter your email address:`
    );
  } else if (content === "!search") {
    userStates[userId] = {
      step: "search_pincode",
      data: {},
    };
    await message.reply(
      `*Museum Search*\n\n` + `Please enter a pincode to find museums nearby:`
    );
  } else if (content === "!book") {
    if (!userTokens[userId]) {
      await message.reply(
        "You need to login first. Use *!login* to authenticate."
      );
      return;
    }

    if (userStates[userId].data.selectedMuseum) {
      const museum = userStates[userId].data.selectedMuseum;

      await message.reply(
        `Processing your booking request for ${museum.Museum_Name}...`
      );

      try {
        const response = await axios.post(
          "http://localhost:9000/api/booking/book",
          {
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
          },
          {
            headers: {
              Authorization: `Bearer ${userTokens[userId]}`,
            },
          }
        );

        const data = response.data;

        if (data.success) {
          const booking = data.booking;

          let responseMessage =
            `*Booking Confirmed!* ✅\n\n` +
            `*Museum:* ${booking.museumName}\n` +
            `*Address:* ${booking.museumAddress || booking.fullAddress}\n` +
            `*City:* ${booking.city}, ${booking.state}\n` +
            `*Pincode:* ${booking.museumPincode}\n` +
            `*Hours:* ${booking.openingHours} - ${booking.closingHours}\n` +
            `*Contact:* ${booking.phoneNumber}\n` +
            `*Booking ID:* ${booking._id}\n` +
            `*Booked by:* ${data.username}\n` +
            `*Date:* ${new Date(booking.createdAt).toLocaleString()}\n\n` +
            `Please show the QR code below at the museum entrance:`;

          await message.reply(responseMessage);

          if (booking.qrCode) {
            const media = new MessageMedia(
              "image/png",
              booking.qrCode.split(",")[1],
              "museum_ticket_qr.png"
            );

            await client.sendMessage(message.from, media, {
              caption: "Your ticket QR code",
            });
          }

          delete userStates[userId].data.selectedMuseum;
          delete userStates[userId].data.museums;
        } else {
          await message.reply(
            "Sorry, there was an error with your booking. Please try again later."
          );
        }
      } catch (error) {
        console.error("Booking error:", error.response?.data || error.message);
        const errorMessage =
          error.response?.data?.message || "Unknown server error";
        await message.reply(
          `Sorry, booking failed: ${errorMessage}. Please try again later.`
        );
      }
    } else {
      await message.reply(
        "Please search for museums first with *!search* and select one before booking."
      );
    }
  } else if (content === "!logout") {
    if (userTokens[userId]) {
      delete userTokens[userId];
      await message.reply("You have been successfully logged out.");
    } else {
      await message.reply("You are not currently logged in.");
    }
  } else if (content === "hi" || content === "hello") {
    await message.reply(
      `👋 Welcome to the Museum Ticket Booking Bot!\n\n` +
        `I can help you book tickets to museums near you.\n` +
        `Please use *!register* to create an account or *!login* if you already have one.\n` +
        `Then use *!search* to find museums by pincode.\n` +
        `Type *!help* for more information.`
    );
  }
});

async function handleConversationFlow(message, userId) {
  const content = message.body;
  const state = userStates[userId];

  if (state.step.startsWith("register_")) {
    switch (state.step) {
      case "register_name":
        state.data.name = content;
        state.step = "register_email";
        await message.reply("Please enter your email address:");
        break;

      case "register_email":
        state.data.email = content;
        state.step = "register_password";
        await message.reply("Please create a password (minimum 8 characters):");
        break;

      case "register_password":
        state.data.password = content;
        state.step = "register_mobile";
        await message.reply("Please enter your mobile number:");
        break;

      case "register_mobile":
        state.data.mobile = content;
        state.step = "none";

        try {
          const response = await axios.post(
            "http://localhost:9000/api/auth/register",
            {
              name: state.data.name,
              email: state.data.email,
              password: state.data.password,
              mobile: state.data.mobile,
            }
          );

          console.log("Registration response:", response.data);

          if (response.data.token) {
            userTokens[userId] = response.data.token;
            await message.reply(
              `*Registration Successful!* ✅\n\n` +
                `You are now registered and logged in.\n` +
                `You can use *!search* to find museums and book tickets.`
            );
          } else if (response.data.success) {
            await message.reply(
              `*Registration Successful!* ✅\n\n` +
                `Please use *!login* to access your account.`
            );
          } else {
            await message.reply(
              `Registration failed: ${
                response.data.message ||
                "Please try logging in with your credentials."
              }`
            );
          }
        } catch (error) {
          console.error(
            "Registration error:",
            error.response?.data || error.message
          );

          if (error.response?.data?.token) {
            userTokens[userId] = error.response.data.token;
            await message.reply(
              `*Registration Completed!* ✅\n\n` +
                `You are now registered and logged in.\n` +
                `You can use *!search* to find museums and book tickets.`
            );
          } else {
            await message.reply(
              `Registration failed: ${
                error.response?.data?.message ||
                "Server error. Please try again later."
              }`
            );
          }
        }
        break;
    }
  } else if (state.step.startsWith("login_")) {
    switch (state.step) {
      case "login_email":
        state.data.email = content;
        state.step = "login_password";
        await message.reply("Please enter your password:");
        break;

      case "login_password":
        state.data.password = content;
        state.step = "none";

        try {
          const response = await axios.post(
            "http://localhost:9000/api/auth/login",
            {
              email: state.data.email,
              password: state.data.password,
            }
          );

          console.log("Login response:", response.data);

          if (response.data.token) {
            userTokens[userId] = response.data.token;
            await message.reply(
              `*Login Successful!* ✅\n\n` +
                `You are now logged in.\n` +
                `You can use *!search* to find museums and book tickets.`
            );
          } else {
            await message.reply(
              "Login failed: No authentication token received."
            );
          }
        } catch (error) {
          console.error("Login error:", error.response?.data || error.message);
          await message.reply(
            `Login failed: ${
              error.response?.data?.message ||
              "Invalid credentials or server error."
            }`
          );
        }
        break;
    }
  } else if (state.step.startsWith("search_")) {
    switch (state.step) {
      case "search_pincode":
        const pincode = content.trim();
        if (!/^\d{6}$/.test(pincode)) {
          await message.reply("Please enter a valid 6-digit pincode.");
          return;
        }

        state.step = "search_select_museum";

        try {
          await message.reply(
            `🔍 Searching for museums near pincode ${pincode}...`
          );

          const response = await axios.get(
            `https://museum-api-indian.vercel.app/api/museums/nearby/pincode/${pincode}`
          );

          const data = response.data;

          if (data.totalCount > 0) {
            state.data.museums = data.museums;

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
            state.step = "none";
            await message.reply(
              `No museums found near pincode ${pincode}. Please try a different pincode with *!search*.`
            );
          }
        } catch (error) {
          console.error("Museum search error:", error);
          state.step = "none";
          await message.reply(
            "Sorry, there was an error searching for museums. Please try again later."
          );
        }
        break;

      case "search_select_museum":
        const selection = parseInt(content.trim());

        if (
          isNaN(selection) ||
          selection < 1 ||
          selection > state.data.museums.length
        ) {
          await message.reply(
            `Please enter a valid number between 1 and ${state.data.museums.length}.`
          );
          return;
        }

        const selectedMuseum = state.data.museums[selection - 1];
        state.data.selectedMuseum = selectedMuseum;
        state.step = "none";

        let confirmMessage = `*Museum Selected* ✅\n\n`;
        confirmMessage += `*${selectedMuseum.Museum_Name}*\n`;
        confirmMessage += `📍 ${selectedMuseum.Full_Address}\n`;
        confirmMessage += `⏰ ${selectedMuseum.Opening_Hours} - ${selectedMuseum.Closing_Hours}\n`;
        confirmMessage += `📧 ${selectedMuseum.Contact_Email}\n`;
        confirmMessage += `📞 ${selectedMuseum.Phone_Number}\n\n`;

        if (userTokens[userId]) {
          confirmMessage += `You can now use *!book* to book tickets for this museum.`;
        } else {
          confirmMessage += `Please *!login* or *!register* before booking tickets.`;
        }

        await message.reply(confirmMessage);
        break;
    }
  }
}

client.initialize();

console.log("Museum Ticket Booking WhatsApp bot is starting...");
