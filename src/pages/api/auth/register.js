// pages/api/auth/register.js
import connectDB from '../../../util/connectDB';
import User from '../../../models/User';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Please provide username and password' });
  }

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(409).json({ success: false, error: 'Username already taken' });
    }

    const user = await User.create({ username, password });
    
    // Do not return the password hash
    res.status(201).json({ success: true, data: { username: user.username, id: user._id } });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}