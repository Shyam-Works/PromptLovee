import React, { useState, useEffect } from 'react';
import PromptCard from '@/components/PromptCard';

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/prompts');
      const data = await res.json();
      
      if (data.success) {
        setPrompts(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load prompts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptUpdate = async (updatedPrompt) => {
    try {
      await fetch(`/api/prompts/${updatedPrompt._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likes: updatedPrompt.likes,
          views: updatedPrompt.views,
        }),
      });

      setPrompts(prevPrompts =>
        prevPrompts.map(p => p._id === updatedPrompt._id ? updatedPrompt : p)
      );
    } catch (error) {
      console.error('Error updating prompt:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading prompts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error loading prompts: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        🎨 Prompt Marketplace
      </h1>
      
      {prompts.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <p className="text-xl mb-4">No prompts found.</p>
          <p>Be the first to <span className="font-bold text-pink-600">create a prompt!</span></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {prompts.map((prompt) => (
            <PromptCard 
              key={prompt._id} 
              initialPrompt={prompt}
              onUpdate={handlePromptUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}