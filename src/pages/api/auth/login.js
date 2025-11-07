// pages/api/auth/login.js
import connectDB from '../../../util/connectDB';
import User from '../../../models/User';
import { serialize } from 'cookie';

// Cookie setup for session
const ONE_DAY = 60 * 60 * 24;
const SESSION_COOKIE_NAME = 'sessionId';

export default async function handler(req, res) {
  await connectDB();

  // LOGIN (POST)
  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    try {
      const user = await User.findOne({ username }).select('+password');
      
      if (user && (await user.matchPassword(password))) {
        // Successful login: Set the session cookie
        const sessionCookie = serialize(SESSION_COOKIE_NAME, user._id.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Use secure in production
          maxAge: ONE_DAY,
          path: '/',
        });

        res.setHeader('Set-Cookie', sessionCookie);
        return res.status(200).json({ success: true, data: { username: user.username, id: user._id } });
      } else {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } 
  
  // CHECK SESSION (GET)
  else if (req.method === 'GET') {
    const sessionId = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
      return res.status(401).json({ success: false, error: 'No active session' });
    }

    try {
      const user = await User.findById(sessionId).select('-password');
      if (!user) {
        // Clear invalid cookie
        res.setHeader('Set-Cookie', serialize(SESSION_COOKIE_NAME, '', { maxAge: 0, path: '/' }));
        return res.status(401).json({ success: false, error: 'Session expired or invalid' });
      }
      return res.status(200).json({ success: true, data: { username: user.username, id: user._id } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Session check failed' });
    }

  } 
  
  // LOGOUT (DELETE)
  else if (req.method === 'DELETE') {
    // Clear the session cookie
    res.setHeader('Set-Cookie', serialize(SESSION_COOKIE_NAME, '', { maxAge: 0, path: '/' }));
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}