const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8096'], // Allow both frontend origins
    methods: ["GET", "POST"],
    credentials: true
  }
});

const SERVER_PORT = 8081;

// Database connection and routes (as in your existing code)
require("dotenv").config();
const dbConnection = require("./config/db.config");
dbConnection();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:8096'],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Users routes 
app.use('/user', require('./routes/user/userLogin'));
app.use('/user', require('./routes/user/userSignUp'));
app.use('/user', require('./routes/user/userGetAllUsers'));
app.use('/user', require('./routes/user/userGetUserById'));
app.use('/user', require('./routes/user/userEditUser'));
app.use('/user', require('./routes/user/userDeleteAll'));
app.use('/user', require('./routes/user/userSearchUser'));
app.use('/user', require('./routes/user/userGetUsernameByUserId'));


// Location routes 
app.use('/user', require('./routes/location/locationUpdate'));
app.use('/user', require('./routes/location/locationGetNearby'));
app.use('/user', require('./routes/location/locationGetByUserId'));
app.use('/user', require('./routes/location/locationDelete'));
app.use('/user', require('./routes/location/locationGetAll'));

// Chat routes
app.use('/chat', require('./routes/chat/chatAddGroupUser'));
app.use('/chat', require('./routes/chat/chatArchive'));
app.use('/chat', require('./routes/chat/chatCreateChat'));
app.use('/chat', require('./routes/chat/chatGetArchivedChat'));
app.use('/chat', require('./routes/chat/chatGetByChatId'));
app.use('/chat', require('./routes/chat/chatGetMessage'));
app.use('/chat', require('./routes/chat/chatGroupRoleUpdate'));
app.use('/chat', require('./routes/chat/chatMessageMarkRead'));
app.use('/chat', require('./routes/chat/chatRemoveGroupUser'));
app.use('/chat', require('./routes/chat/chatSearch'));
app.use('/chat', require('./routes/chat/chatUnread'));
app.use('/chat', require('./routes/chat/chatSendMessage'));
app.use('/chat', require('./routes/chat/chatDeleteAll'));
app.use('/chat', require('./routes/chat/chatGetByUserId'));


// Serve static files from React app's build folder
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Socket.io connection
io.on("connection", (socket) => {

  socket.on("user-message", (message) => {
    io.emit("message", message); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
  });
});

// Start server
server.listen(SERVER_PORT, () => {
  console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
