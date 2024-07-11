require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const UserRouter = require("./routes/UsersRoutes");
const ChatRouter = require("./routes/ChatsRoutes");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
const corOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corOptions));

// MongoDB Connection
const mongoUri = process.env.MONGODB_URL;
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB");
    console.error(err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Hello home page");
});

app.use("/users", UserRouter);
app.use("/users/chats", ChatRouter);

// Set up Socket.IO
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_chat", (chat_id) => {
    socket.join(chat_id);
    console.log(`User with ID: ${socket.id} joined chat: ${chat_id}`);
  });

  socket.on("send_message", (data) => {
    const { _id, sender, content } = data;
    io.to(_id).emit("receive_message", { _id, sender, content });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server

server.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
