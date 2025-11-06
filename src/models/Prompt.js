// /src/models/Prompt.js
import mongoose from 'mongoose';

const PromptSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required.'],
  },
  promptText: {
    type: String,
    required: [true, 'Prompt text is required.'],
  },
  aiTool: {
    type: String,
    required: [true, 'AI Tool is required.'],
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Prompt || mongoose.model('Prompt', PromptSchema);