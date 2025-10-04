// Initialize Socket.IO connection
const socket = io();

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const chatScreen = document.getElementById('chatScreen');
const usernameInput = document.getElementById('usernameInput');
const joinBtn = document.getElementById('joinBtn');
const currentUserSpan = document.getElementById('currentUser');
const userCountSpan = document.getElementById('userCount');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

// Global variables
let currentUsername = '';
let isTyping = false;
let typingTimer;
let typingUsers = new Set();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Focus on username input
    usernameInput.focus();
    
    // Handle enter key in username input
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinChat();
        }
    });
    
    // Handle join button click
    joinBtn.addEventListener('click', joinChat);
    
    // Handle enter key in message input
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Handle send button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Handle typing indicator
    messageInput.addEventListener('input', handleTyping);
});

// Join chat function
function joinChat() {
    const username = usernameInput.value.trim();
    
    if (username === '') {
        alert('Please enter your name');
        return;
    }
    
    if (username.length > 20) {
        alert('Name must be 20 characters or less');
        return;
    }
    
    currentUsername = username;
    currentUserSpan.textContent = username;
    
    // Hide login screen and show chat screen
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    
    // Focus on message input
    messageInput.focus();
    
    // Emit user joined event
    socket.emit('user joined', username);
    
    // Clear welcome message after joining
    setTimeout(() => {
        const welcomeMsg = document.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }
    }, 1000);
}

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message === '') {
        return;
    }
    
    if (message.length > 500) {
        alert('Message must be 500 characters or less');
        return;
    }
    
    // Emit chat message
    socket.emit('chat message', { message: message });
    
    // Clear input and focus
    messageInput.value = '';
    messageInput.focus();
    
    // Stop typing indicator
    if (isTyping) {
        isTyping = false;
        socket.emit('typing', { isTyping: false });
    }
}

// Handle typing indicator
function handleTyping() {
    if (!isTyping) {
        isTyping = true;
        socket.emit('typing', { isTyping: true });
    }
    
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        isTyping = false;
        socket.emit('typing', { isTyping: false });
    }, 1000);
}

// Socket event listeners
socket.on('chat message', function(data) {
    displayMessage(data, data.username === currentUsername);
});

socket.on('user joined', function(data) {
    displaySystemMessage(data.message, data.timestamp);
});

socket.on('user left', function(data) {
    displaySystemMessage(data.message, data.timestamp);
});

socket.on('user count', function(count) {
    userCountSpan.textContent = `${count} user${count !== 1 ? 's' : ''} online`;
});

socket.on('typing', function(data) {
    if (data.isTyping) {
        typingUsers.add(data.username);
    } else {
        typingUsers.delete(data.username);
    }
    updateTypingIndicator();
});

// Display message function
function displayMessage(data, isOwn = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    headerDiv.textContent = `${data.username} • ${data.timestamp}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = data.message;
    
    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Display system message function
function displaySystemMessage(message, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = `${message} • ${timestamp}`;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Update typing indicator
function updateTypingIndicator() {
    if (typingUsers.size === 0) {
        typingIndicator.textContent = '';
        return;
    }
    
    const users = Array.from(typingUsers);
    let text = '';
    
    if (users.length === 1) {
        text = `${users[0]} is typing...`;
    } else if (users.length === 2) {
        text = `${users[0]} and ${users[1]} are typing...`;
    } else {
        text = `${users.length} people are typing...`;
    }
    
    typingIndicator.textContent = text;
}

// Scroll to bottom function
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle connection errors
socket.on('connect_error', function(error) {
    console.error('Connection error:', error);
    alert('Failed to connect to the chat server. Please refresh the page and try again.');
});

socket.on('disconnect', function(reason) {
    console.log('Disconnected:', reason);
    displaySystemMessage('Disconnected from server. Trying to reconnect...', new Date().toLocaleTimeString());
});

socket.on('reconnect', function(attemptNumber) {
    console.log('Reconnected after', attemptNumber, 'attempts');
    displaySystemMessage('Reconnected to server!', new Date().toLocaleTimeString());
});