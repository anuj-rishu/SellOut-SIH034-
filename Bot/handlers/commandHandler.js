const museumService = require("../services/museumService");
const messageHelper = require("../helpers/messageHelper");

async function handleCommand(message, userId, userStates, userTokens, client) {
    const content = message.body.toLowerCase();

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
                const bookingResult = await museumService.bookMuseum(museum, userTokens[userId]);

                if (bookingResult.success) {
                    const booking = bookingResult.booking;

                    let responseMessage = messageHelper.formatBookingConfirmation(booking, bookingResult.username);

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
}

module.exports = {
    handleCommand,
};