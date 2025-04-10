const client = require("./client");
const commandHandler = require("./handlers/commandHandler");
const conversationHandler = require("./handlers/conversationHandler");
const userStore = require("./store/userStore");
require('dotenv').config();

client.on("message", async (message) => {
  const userId = message.from;
  const content = message.body.toLowerCase();

  // Initialize user state if not exists
  userStore.initializeUser(userId);

  // Handle ongoing conversations
  const isConversationHandled = await conversationHandler.handleConversation(message, userId);
  if (isConversationHandled) return;

  // Handle commands
  await commandHandler.handleCommand(message, content);
});

// Initialize the client
client.initialize();

console.log("Museum Ticket Booking WhatsApp bot is starting...");