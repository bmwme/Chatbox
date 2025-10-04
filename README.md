# ChatBox - Real-time Chat Application

A modern, real-time chat application built with Node.js, Express, and Socket.IO.

## Features

- 🗨️ **Real-time messaging** - Instant message delivery using WebSockets
- 👥 **Multiple users** - Support for multiple users chatting simultaneously
- 🔔 **Join/Leave notifications** - Get notified when users join or leave
- ⌨️ **Typing indicators** - See when other users are typing
- 📱 **Responsive design** - Works on desktop and mobile devices
- 🕒 **Message timestamps** - See when messages were sent
- 👤 **User count** - Display number of online users
- 🎨 **Modern UI** - Beautiful, gradient-based interface

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **For development (with auto-restart):**
   ```bash
   npm run dev
   ```

4. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

## How to Use

1. **Enter your name** in the login screen
2. **Click "Join Chat"** to enter the chat room
3. **Type your message** in the input field at the bottom
4. **Press Enter or click "Send"** to send your message
5. **See real-time messages** from other users
6. **Watch typing indicators** when others are typing

## Testing with Multiple Users

To test the chat with multiple users:

1. Open multiple browser tabs/windows
2. Go to `http://localhost:3000` in each tab
3. Enter different names for each user
4. Start chatting between the tabs!

## Project Structure

```
chatbox/
├── server.js          # Main server file with Socket.IO logic
├── package.json       # Dependencies and scripts
├── public/            # Static files served to clients
│   ├── index.html     # Main HTML page
│   ├── style.css      # Styling and animations
│   └── script.js      # Client-side JavaScript and Socket.IO
└── README.md          # This file
```

## Technologies Used

- **Backend:** Node.js, Express.js, Socket.IO
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Real-time Communication:** WebSockets via Socket.IO
- **Styling:** Modern CSS with gradients and animations

## Customization

You can easily customize the chat application:

- **Colors:** Modify the gradient colors in `style.css`
- **Max users:** Add user limits in `server.js`
- **Message history:** Add database integration for persistent messages
- **Rooms:** Extend to support multiple chat rooms
- **File sharing:** Add support for image/file uploads

## Deployment

To deploy this application:

1. **Use a service like Heroku, Railway, or DigitalOean**
2. **Set the PORT environment variable** (the app will use process.env.PORT)
3. **Make sure to install dependencies** with `npm install`
4. **Start the app** with `npm start`

## License

MIT License - feel free to use this project for learning or your own applications!