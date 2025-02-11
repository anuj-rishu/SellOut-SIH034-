const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    console.log('Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});


const userSessions = {};


client.on('message', async (message) => {
    const chatId = message.from;

    if (!userSessions[chatId]) {
        userSessions[chatId] = {};
    }

    const userStep = userSessions[chatId].step || 0;

    switch (userStep) {
        case 0:
            message.reply('Welcome! Please provide your full name.');
            userSessions[chatId].step = 1;
            break;

        case 1:
            userSessions[chatId].name = message.body;
            message.reply('Great! Now, enter your email address.');
            userSessions[chatId].step = 2;
            break;

        case 2:
            userSessions[chatId].email = message.body;
            message.reply('Enter your contact number.');
            userSessions[chatId].step = 3;
            break;

        case 3:
            userSessions[chatId].contact = message.body;
            message.reply('Enter your department name.');
            userSessions[chatId].step = 4;
            break;

        case 4:
            userSessions[chatId].department = message.body;
            message.reply('Enter your section.');
            userSessions[chatId].step = 5;
            break;

        case 5:
            userSessions[chatId].section = message.body;
            message.reply("Enter your Faculty Advisor's name.");
            userSessions[chatId].step = 6;
            break;

        case 6:
            userSessions[chatId].FaName = message.body;
            message.reply("Enter your Faculty Advisor's contact number.");
            userSessions[chatId].step = 7;
            break;

        case 7:
            userSessions[chatId].FaContact = message.body;
            message.reply('What question would you like to ask the speaker?');
            userSessions[chatId].step = 8;
            break;

        case 8:
            userSessions[chatId].QuestionToSpeaker = message.body;

           
            const userData = {
                name: userSessions[chatId].name,
                email: userSessions[chatId].email,
                contact: userSessions[chatId].contact,
                department: userSessions[chatId].department,
                section: userSessions[chatId].section,
                FaName: userSessions[chatId].FaName,
                FaContact: userSessions[chatId].FaContact,
                QuestionToSpeaker: userSessions[chatId].QuestionToSpeaker,
            };

            try {
                const response = await axios.post('http://localhost:9000/api/users/register', userData);

                if (response.data.success) {
                    // Send QR Code Image
                    const qrCodeData = response.data.qrCode.split(',')[1]; /
                    const qrCodeMedia = new MessageMedia('image/png', qrCodeData, 'qrcode.png');
                    await client.sendMessage(chatId, qrCodeMedia, { caption: 'Here is your QR Code.' });

                    // Send Barcode Image
                    const barcodeData = response.data.barcode.split(',')[1]; 
                    const barcodeMedia = new MessageMedia('image/png', barcodeData, 'barcode.png');
                    await client.sendMessage(chatId, barcodeMedia, { caption: 'Here is your Barcode.' });

                    message.reply('✅ Registration successful! Your QR Code and Barcode have been sent.');
                } else {
                    message.reply('❌ Registration failed. Try again.');
                }
            } catch (error) {
                console.error('API Error:', error);
                message.reply('❌ Error while registering. Please try again later.');
            }

            // Clear session
            delete userSessions[chatId];
            break;
    }
});

client.initialize();
