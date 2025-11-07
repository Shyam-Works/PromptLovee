// pages/api/prompts/index.js (Corrected)
import connectDB from "../../../util/connectDB";
import Prompt from "../../../models/Prompt";
import User from "../../../models/User";
import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable";

// Configure Cloudinary (keep existing config)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  await connectDB(); // Helper to get user ID from session cookie

  const getUserId = () => req.cookies.sessionId;

  switch (
    req.method // ... GET case (unchanged) ...
  ) {
    case "GET":
      try {
        const { creatorId } = req.query;
        let filter = {};
        if (creatorId) {
          filter.creator = creatorId;
        }
        // Populate creator username if needed for display on the feed
        const prompts = await Prompt.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: prompts });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      const userId = getUserId(); // Authentication Check
      if (!userId) {
        return res
          .status(401)
          .json({
            success: false,
            error: "You must be logged in to create a prompt.",
          });
      }

      try {
        // Verify user exists (optional but recommended)
        const user = await User.findById(userId);
        if (!user) {
          return res
            .status(401)
            .json({
              success: false,
              error: "Invalid user session. Please log in again.",
            });
        }

        const form = new IncomingForm();
        form.parse(req, async (err, fields, files) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, error: "Form parsing error" });
          }

          const imageFile = files.image?.[0];
          if (!imageFile) {
            return res
              .status(400)
              .json({ success: false, error: "No image file provided" });
          }

          // **MISSING CODE RE-INSERTED HERE**
          // Upload to Cloudinary to define 'result'
          let result;
          try {
            result = await cloudinary.uploader.upload(imageFile.filepath, {
              folder: "promptlover",
            });
          } catch (uploadError) {
            console.error("Cloudinary Upload Error:", uploadError);
            return res
              .status(500)
              .json({ success: false, error: "Image upload failed." });
          }
          // **END OF RE-INSERTED CODE**

          const imageUrl = result.secure_url; // 'result' is now defined
          const promptText = fields.promptText?.[0];
          const aiTool = fields.aiTool?.[0]; // Extract category array from formidable fields
          const category = fields["category[]"];

          if (
            !imageUrl ||
            !promptText ||
            !aiTool ||
            !category ||
            category.length === 0
          ) {
            return res
              .status(400)
              .json({
                success: false,
                error: "Missing required fields (including 1-3 categories)",
              });
          } // Validate category count and ensure it's an array

          const categoryArray = Array.isArray(category) ? category : [category];
          if (categoryArray.length > 3) {
            return res
              .status(400)
              .json({ success: false, error: "Maximum 3 categories allowed." });
          } // Save to MongoDB

          const prompt = await Prompt.create({
            imageUrl,
            promptText,
            aiTool,
            category: categoryArray,
            creator: userId,
          });
          res.status(201).json({ success: true, data: prompt });
        });
      } catch (error) {
        // Catch database or major operational errors
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
