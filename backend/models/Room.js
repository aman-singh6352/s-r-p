import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const sessionSchema = new mongoose.Schema({
  startTime: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 } // in seconds
});

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: String }],
  messages: [messageSchema],
  history: [sessionSchema]
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);