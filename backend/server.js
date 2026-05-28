import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import Room from './models/Room.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Socket.io
io.on('connection', (socket) => {
  socket.on('joinRoom', async ({ roomId, username }) => {
    socket.join(roomId);
    
    await Room.findByIdAndUpdate(roomId, { $addToSet: { participants: username } });
    io.to(roomId).emit('userJoined', { username });
  });

  socket.on('sendMessage', async ({ roomId, sender, text }) => {
    const msg = { sender, text, timestamp: new Date() };
    await Room.findByIdAndUpdate(roomId, { $push: { messages: msg } });
    io.to(roomId).emit('messageRecieved', msg);
  });

  socket.on('timerUpdate', ({ roomId, timeRemaining, isRunning }) => {
    socket.to(roomId).emit('timerSynced', { timeRemaining, isRunning });
  });

  socket.on('disconnect', () => {
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server sprinting on port ${PORT}`));