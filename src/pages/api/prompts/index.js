import connectDB from '../../../util/connectDB';
import Prompt from '../../../models/Prompt';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable body parser for formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const prompts = await Prompt.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: prompts });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const form = new IncomingForm();
        
        form.parse(req, async (err, fields, files) => {
          if (err) {
            return res.status(500).json({ success: false, error: 'Form parsing error' });
          }

          const imageFile = files.image?.[0];

          if (!imageFile) {
            return res.status(400).json({ success: false, error: 'No image file provided' });
          }

          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(imageFile.filepath, {
            folder: 'promptlover',
          });

          // Extract data
          const imageUrl = result.secure_url;
          const promptText = fields.promptText?.[0];
          const aiTool = fields.aiTool?.[0];

          if (!imageUrl || !promptText || !aiTool) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
          }

          // Save to MongoDB
          const prompt = await Prompt.create({ imageUrl, promptText, aiTool });
          res.status(201).json({ success: true, data: prompt });
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}