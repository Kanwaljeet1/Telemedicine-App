import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";
import app from "./App.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5050;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, specify your frontend URL
    methods: ["GET", "POST"]
  }
});

//mongodb driver

import {MongoClient } from 'mongodb';
// or as an es module:

// Connection URL
const url = "mongodb+srv://kanwalkaur1310_db_user:labrapassword@cluster0.tuqoyzo.mongodb.net/";
const client = new MongoClient(url);

// Database Name
const dbName = 'Telemedicine-app';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('Users');

  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());



  



// Socket.io Signaling Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room ${roomID}`);
    socket.to(roomID).emit("user-joined", socket.id);
  });

  socket.on("signal", (data) => {
    // Forward signal data to everyone in the room EXCEPT the sender
    socket.to(data.roomID).emit("signal", {
      signal: data.signal,
      from: socket.id
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export const getVideoToken = (req, res) => {
  // Check if credentials exist for Twilio, else return error or mock
  if (process.env.TWILIO_SID && process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET) {
    const token = new twilio.jwt.AccessToken(
      process.env.TWILIO_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET
    );
    token.addGrant(new twilio.jwt.AccessToken.VideoGrant());
    res.json({ token: token.toJwt() });
  } else {
    res.status(500).json({ error: "Twilio credentials not configured" });
  }
};

app.get("/api/video/token", getVideoToken);

app.get("/", (req, res) => {
  res.send("Telemedicine API with Signaling running");
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

