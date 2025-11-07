// pages/api/prompts/[id].js (Updated/Completed)
import connectDB from '../../../util/connectDB';
import Prompt from '../../../models/Prompt';

export default async function handler(req, res) {
  await connectDB();
  const { query: { id }, method } = req;
  const getUserId = () => req.cookies.sessionId; // Helper to get user ID

  switch (method) {
    case 'GET':
        // **Enforce listing restriction: Must be logged in to view details**
        const userIdOnGet = getUserId();
        if (!userIdOnGet) {
            return res.status(401).json({ success: false, error: 'You must be logged in to view listing details.' });
        }
        try {
          const prompt = await Prompt.findById(id);
          if (!prompt) {
            return res.status(404).json({ success: false, error: 'Prompt not found' });
          }
          res.status(200).json({ success: true, data: prompt });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
        break;

    case 'PUT':
      try {
        const { likes, views } = req.body;
        
        // **Restrict updates to ONLY likes and views (cannot modify content)**
        const updateData = {};
        if (likes !== undefined) updateData.likes = likes;
        if (views !== undefined) updateData.views = views;

        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ success: false, error: 'No valid update fields provided.' });
        }

        const prompt = await Prompt.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );

        if (!prompt) {
          return res.status(404).json({ success: false, error: 'Prompt not found' });
        }

        res.status(200).json({ success: true, data: prompt });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    
    case 'DELETE':
        const userIdOnDelete = getUserId();
        // 1. **Authentication Check**
        if (!userIdOnDelete) {
            return res.status(401).json({ success: false, error: 'You must be logged in to delete a prompt.' });
        }
  
        try {
          const prompt = await Prompt.findById(id);
  
          if (!prompt) {
            return res.status(404).json({ success: false, error: 'Prompt not found' });
          }
  
          // 2. **Authorization Check (User can only delete their own listing)**
          if (prompt.creator.toString() !== userIdOnDelete) {
            return res.status(403).json({ success: false, error: 'You are not authorized to delete this prompt.' });
          }
  
          await Prompt.deleteOne({ _id: id });
          res.status(200).json({ success: true, data: {} });
  
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
        break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}