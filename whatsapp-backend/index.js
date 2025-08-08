require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins (adjust for production)
    methods: ["GET", "POST", "PUT"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Routes (pass socket instance to route)
const webhookRoutes = require("./routes/webhook")(io);
app.use("/webhook", webhookRoutes);

// Socket events
io.on("connection", (socket) => {
  console.log("Socket.IO client connected");
});

// Start server
server.listen(3001, () => console.log("Backend running on http://localhost:3001"));
