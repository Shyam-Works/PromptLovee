// models/User.js (Minor Update)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    maxlength: [40, 'Username cannot be more than 40 characters'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Important: Don't return password by default
  },
  // ⭐️ NEW FIELD: Array to track prompts liked by this user
  likedPrompts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Prompt',
    default: [],
  },
}, { timestamps: true });

// Hash password before saving
// ... (pre('save') remains the same)

// Method to compare passwords
// ... (matchPassword remains the same)

// ... (Pre-save and matchPassword methods remain the same)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);