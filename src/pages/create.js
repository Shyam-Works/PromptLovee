import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreatePrompt() {
  const [form, setForm] = useState({
    promptText: '',
    aiTool: 'Midjourney',
    image: null,
    imagePreview: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.promptText || !form.aiTool || !form.image) {
      alert('Please fill all fields and select an image.');
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append('promptText', form.promptText);
    formData.append('aiTool', form.aiTool);
    formData.append('image', form.image);

    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert('Prompt created successfully!');
        router.push('/');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('An unexpected error occurred during creation.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        Share Your AI Masterpiece
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Prompt Text Input */}
        <div>
          <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 mb-1">
            The Prompt (What you used to generate the image)
          </label>
          <textarea
            id="promptText"
            name="promptText"
            rows="4"
            value={form.promptText}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            placeholder="A whimsical unicorn flying over a cyberpunk city, 4k, hyperrealistic"
            required
          />
        </div>

        {/* AI Tool Select */}
        <div>
          <label htmlFor="aiTool" className="block text-sm font-medium text-gray-700 mb-1">
            AI Tool Used
          </label>
          <select
            id="aiTool"
            name="aiTool"
            value={form.aiTool}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            required
          >
            <option>Midjourney</option>
            <option>OpenAI</option>
            <option>Gemini</option>
            <option>DALL-E</option>
            <option>Stable Diffusion</option>
            <option>Other</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Result Image (PNG/JPG)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
            required
          />
          {form.imagePreview && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img 
                src={form.imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover"
              />
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
            }`}
          >
            {loading ? 'Uploading & Creating...' : 'Submit Prompt'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}