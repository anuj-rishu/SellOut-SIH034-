# Museum Ticket Booking WhatsApp Bot

## Problem Statement (SIH034)
**Online Museum Chatbot-based Ticketing System for SIH (Smart India Hackathon)**

## Overview
This WhatsApp bot offers a seamless, chat-based interface for discovering museums and booking tickets. Designed to simplify museum visits, it leverages a familiar messaging platform—WhatsApp—for easy access and streamlined interaction.

---

## Features

### 1. User Authentication
- **Registration**: Create an account using name, email, password, and mobile number.
- **Login**: Authenticate existing users to enable ticket booking.
- **Logout**: Securely log out of your session.

### 2. Museum Discovery
- **Location-Based Search**: Find museums near a specific pincode.
- **Rich Information Display**:
  - Museum Name
  - Full Address
  - Opening & Closing Hours
  - Contact Info (Phone & Email)

### 3. Ticket Booking
- **Seamless Booking Process**: Book tickets directly via chat.
- **Authentication Required**: Only registered users can book.
- **Booking Confirmation**: Get details like:
  - Museum Information
  - Booking ID
  - Date & Time
  - QR Code Ticket for Entry

### 4. Interactive Conversations
- **Guided Flows**: Step-by-step guides for registration, login, and booking.
- **Contextual Responses**: Bot remembers the current step in a conversation.
- **Clear Instructions**: Prompts to guide users effectively.

---

## Commands

| Command      | Description                          |
|--------------|--------------------------------------|
| `!register`  | Create a new account                 |
| `!login`     | Log in to your account               |
| `!search`    | Find museums near a pincode          |
| `!book`      | Book a museum ticket (login needed)  |
| `!logout`    | Log out from your account            |
| `!help`      | Show available commands              |

---

## Technical Architecture

- **WhatsApp Integration**: Uses WhatsApp Web API for handling messages.
- **Modular Design**: Clean separation of logic for commands and conversation handling.
- **State Management**: Maintains user state across multi-step interactions.
- **API Integration**: Connects to external museum and authentication APIs.
- **QR Code Generation**: Produces QR codes for ticket entry.

---

## How to Use

1. Start a chat with the bot’s WhatsApp number.
2. Use `!register` to sign up or `!login` to access your account.
3. Send `!search` and provide your pincode to discover nearby museums.
4. Choose a museum by replying with its number.
5. Use `!book` to reserve your ticket.
6. Receive a booking confirmation with QR code.

---

## Setup and Deployment

- The bot is **containerized with Docker** for simplified deployment.
- Includes **CI/CD workflows** for automated builds and deployment.

---

## Developed For

This solution was created for the **Smart India Hackathon (SIH)** challenge:
**SIH034 – Online Museum Chatbot-based Ticketing System**.

---

