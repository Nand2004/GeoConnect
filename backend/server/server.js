const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8096'] // Allow both origins
  }
});

const SERVER_PORT = 8081;

// Database connection and routes (as in your existing code)
require("dotenv").config();
const dbConnection = require("./config/db.config");
dbConnection();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Users routes (as in your existing code)
app.use('/user', require('./routes/user/userLogin'));
app.use('/user', require('./routes/user/userSignUp'));
app.use('/user', require('./routes/user/userGetAllUsers'));
app.use('/user', require('./routes/user/userGetUserById'));
app.use('/user', require('./routes/user/userEditUser'));
app.use('/user', require('./routes/user/userDeleteAll'));

// Location routes (as in your existing code)
app.use('/user', require('./routes/location/locationUpdate'));
app.use('/user', require('./routes/location/locationGetNearby'));
app.use('/user', require('./routes/location/locationGetByUserId'));
app.use('/user', require('./routes/location/locationDelete'));
app.use('/user', require('./routes/location/locationGetAll'));

// Serve static files from React app's build folder
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("user-message", (message) => {
    console.log("Received message from user:", message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start server
server.listen(SERVER_PORT, () => {
  console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
