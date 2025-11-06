import connectDB from '../../../util/connectDB';
import Prompt from '../../../models/Prompt';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      try {
        const { likes, views } = req.body;
        
        const updateData = {};
        if (likes !== undefined) updateData.likes = likes;
        if (views !== undefined) updateData.views = views;

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

    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}