const express = require("express")
require('dotenv').config();
const connectDB = require("./config/db")
const path = require("path");
const http = require('http'); // Import http
const { Server } = require("socket.io"); // Import Socket.io
const Message = require('./models/Message'); // Import Message model
const cors = require('cors'); // Import cors

const app = express();
app.use(cors()); // Use cors middleware
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        // Allow local dev (localhost:5173) and production frontend
        origin: ["http://localhost:5173", "https://artgallery-y0rw.onrender.com", "https://art-gallery-mern-stack-project.vercel.app"],
        methods: ["GET", "POST"]
    }
});

const api = require('./routes/AuthRoutes')
const art = require('./routes/ArtRoutes')
const cart = require('./routes/CartRoutes')
const chat = require('./routes/ChatRoutes')
const payment = require('./routes/PaymentRoutes')

app.use(express.json());
app.use((req, res, next) => {
    console.log(`[REAL SERVER] ${req.method} ${req.url}`);
    next();
});

connectDB();

// Socket.io Logic
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", async (roomId) => {
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} joined room: ${roomId}`);

        // Optional: Send previous messages upon joining
        try {
            const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
            socket.emit("receive_history", messages);
        } catch (err) {
            console.error("Error fetching history:", err);
        }
    });

    socket.on("send_message", async (data) => {
        // data: { roomId, senderId, message }
        // console.log("Message received:", data);

        try {
            // Save to DB
            const newMessage = new Message({
                roomId: data.roomId,
                senderId: data.senderId,
                message: data.message
            });
            await newMessage.save();

            // Emit to everyone in the room (including sender, or use  to exclude sender)
            // Using io.in().emit() ensures everyone gets it including sender for confirmation, 
            // or UI updates optimistically and we just broadcast.
            // Let's emit to the room.
            io.in(data.roomId).emit("receive_message", data);
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

app.get('/', (req, res) => {
    res.status(200).send({ message: "Welcome to ART GALLERY" });
})

app.use('/verify', api);
app.use('/art', art);
app.use('/cart', cart);
app.use('/chat', chat);
app.use('/payment', payment);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.listen(process.env.PORT, () => {
    console.log("Server Listening on PORT " + process.env.PORT);
})