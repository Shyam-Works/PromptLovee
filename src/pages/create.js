// pages/create.js (Modern & User-Friendly)
import { useState } from 'react';
import { useRouter } from 'next/router';
import { PROMPT_CATEGORIES } from '@/util/PromptCategories';
import { useAuth } from '@/util/AuthContext';

export default function CreatePrompt() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    promptText: '',
    aiTool: 'Midjourney',
    category: [],
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

  const handleCategoryToggle = (category) => {
    setForm(prev => {
      const isSelected = prev.category.includes(category);
      
      if (isSelected) {
        return {
          ...prev,
          category: prev.category.filter(c => c !== category)
        };
      } else {
        if (prev.category.length >= 3) {
          alert('You can select a maximum of 3 categories.');
          return prev;
        }
        return {
          ...prev,
          category: [...prev.category, category]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.promptText || form.category.length === 0 || !form.aiTool || !form.image) {
      alert('Please fill all fields, select 1-3 categories, and upload an image.');
      return;
    }
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append('promptText', form.promptText);
    formData.append('aiTool', form.aiTool);
    form.category.forEach(cat => formData.append('category[]', cat));
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
      } else if (res.status === 401) {
        router.push('/login');
        alert(`Login required: ${data.error}`);
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

  if (!user && !router.pathname.includes('login')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Share Your AI Creation
          </h1>
          <p className="text-gray-600 text-lg">
            Inspire others with your amazing AI-generated artwork
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Image Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Image</h2>
              
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="image"
                  className="block cursor-pointer"
                >
                  {form.imagePreview ? (
                    <div className="relative group">
                      <img
                        src={form.imagePreview}
                        alt="Preview"
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-xl flex items-center justify-center">
                        <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-pink-300 rounded-xl p-12 text-center hover:border-pink-500 transition-colors aspect-square flex flex-col items-center justify-center bg-pink-50/50">
                      <svg className="w-16 h-16 text-pink-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-pink-600 font-medium mb-1">Click to upload image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>

              {/* AI Tool Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Tool Used
                </label>
                <select
                  name="aiTool"
                  value={form.aiTool}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
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
            </div>

            {/* Right Column - Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Prompt Details</h2>

              {/* Prompt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Prompt
                </label>
                <textarea
                  name="promptText"
                  rows="6"
                  value={form.promptText}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition resize-none"
                  placeholder="Describe the prompt you used to create this image..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.promptText.length} characters
                </p>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories (Select 1-3)
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {PROMPT_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        form.category.includes(cat)
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {form.category.length}/3 selected
                  {form.category.length > 0 && (
                    <span className="ml-2 text-pink-600">
                      {form.category.join(', ')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="text-center">
            <button

              type="submit"
              disabled={loading}
              className={`inline-block w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Prompt...' : 'Create Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}