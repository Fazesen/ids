require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth.js");
const alertRoutes = require("./routes/alerts.js");
const Alert = require("./models/Alert.js");   // <-- IMPORTANT

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// ⚡ Real-time WebSocket Server
const io = new Server(server, {
    cors: { origin: "*" }
});

// Make socket available globally
global.alertSocket = io;

// --------------------------------------------------------
// 🧠 BUFFER SYSTEM: store incoming alerts for 5 seconds
// --------------------------------------------------------
let incomingAlerts = [];
const ALERT_INTERVAL = 5000; // send/save alert every 5 sec

// MongoDB Connection
const localMongo = "mongodb://127.0.0.1:27017/ids";
mongoose.connect(process.env.MONGO_URI || localMongo)
    .then(() => console.log("🔥 MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));


// --------------------------------------------------------
// API Routes
// --------------------------------------------------------
app.use("/auth", authRoutes);
app.use("/alerts", alertRoutes);


// --------------------------------------------------------
// WebSocket connection listener
// --------------------------------------------------------
io.on("connection", (socket) => {
    console.log("⚡ Dashboard Connected to Live Alerts");

    // Collect alerts instead of saving immediately
    socket.on("new_alert", (data) => {
        incomingAlerts.push({
            timestamp: new Date(data.timestamp * 1000),
            type: data.type,
            severity: data.severity,
            src: data.src,
            dst: data.dst,
            protocol: data.protocol,
            confidence: data.confidence
        });
    });
});


// --------------------------------------------------------
// Every 5 seconds: send + save ONLY ONE alert
// --------------------------------------------------------
setInterval(async () => {

    if (incomingAlerts.length === 0) return;

    // Pick the LAST alert (you can change this to highest severity)
    const alert = incomingAlerts[incomingAlerts.length - 1];

    // Clear buffer
    incomingAlerts = [];

    // Send only 1 alert to frontend
    io.emit("filtered_alert", alert);

    // Save only 1 alert to MongoDB
    try {
        await Alert.create(alert);
        console.log("💾 Saved filtered alert:", alert.type);
    } catch (err) {
        console.error("❌ Mongo Save Error:", err);
    }

}, ALERT_INTERVAL);


// --------------------------------------------------------
// Start Server
// --------------------------------------------------------
const PORT = 5000;
server.listen(PORT, () =>
    console.log(`🚀 API Server running at http://localhost:${PORT}`)
);
