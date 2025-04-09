const axios = require("axios");
const validation = require("../utils/validation");
const museumService = require("../services/museumService");

async function handleConversationFlow(message, userId, userStates, userTokens, client) {
    const content = message.body;
    const state = userStates[userId];

    if (state.step.startsWith("register_")) {
        await handleRegistrationFlow(message, userId, userStates, userTokens);
    } else if (state.step.startsWith("login_")) {
        await handleLoginFlow(message, userId, userStates, userTokens);
    } else if (state.step.startsWith("search_")) {
        await handleSearchFlow(message, userId, userStates, userTokens, client); // Pass userTokens here
    }
}

async function handleRegistrationFlow(message, userId, userStates, userTokens) {
    const content = message.body;
    const state = userStates[userId];

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
                        `Registration failed: ${response.data.message || "Please try logging in with your credentials."
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
                        `Registration failed: ${error.response?.data?.message || "Server error. Please try again later."
                        }`
                    );
                }
            }
            break;
    }
}

async function handleLoginFlow(message, userId, userStates, userTokens) {
    const content = message.body;
    const state = userStates[userId];

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
                    `Login failed: ${error.response?.data?.message || "Invalid credentials or server error."
                    }`
                );
            }
            break;
    }
}

async function handleSearchFlow(message, userId, userStates, client) {
    const content = message.body;
    const state = userStates[userId];

    switch (state.step) {
        case "search_pincode":
            const pincode = content.trim();
            if (!validation.isValidPincode(pincode)) {
                await message.reply("Please enter a valid 6-digit pincode.");
                return;
            }

            state.step = "search_select_museum";

            try {
                await message.reply(
                    `🔍 Searching for museums near pincode ${pincode}...`
                );

                const searchResult = await museumService.searchMuseumsByPincode(pincode);

                if (searchResult.totalCount > 0) {
                    state.data.museums = searchResult.museums;

                    let museumList = `*Museums near ${pincode}*\n\n`;
                    museumList += `Found ${searchResult.totalCount} museums within ${searchResult.radius}:\n\n`;

                    searchResult.museums.forEach((museum, index) => {
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

module.exports = {
    handleConversationFlow,
};