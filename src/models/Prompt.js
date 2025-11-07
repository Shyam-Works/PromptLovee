// src/models/Prompt.js (Updated)
import mongoose from "mongoose";

const PromptSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, "Image URL is required."],
  },
  promptText: {
    type: String,
    required: [true, "Prompt text is required."],
  }, // **UPDATED FIELD TO SUPPORT MULTIPLE CATEGORIES (MAX 3)**
  category: {
    type: [String], // Change to an array of Strings
    required: [true, "At least one category is required."],
    validate: {
      validator: (v) => v.length > 0 && v.length <= 3,
      message: "A prompt must have between 1 and 3 categories.",
    },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  aiTool: {
    type: String,
    required: [true, "AI Tool is required."],
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

export default mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);
