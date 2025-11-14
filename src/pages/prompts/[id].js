// pages/prompts/[id].js
// This is a PAGE ROUTE - create this file in your pages/prompts folder
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { useAuth } from '@/util/AuthContext';

export default function PromptDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  const [prompt, setPrompt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPrompt = async () => {
      try {
        const res = await fetch(`/api/prompts/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setPrompt(data.data);
          
          // Track view if user is logged in and hasn't viewed yet
          if (user && !data.data.viewedBy?.includes(user.id)) {
            await fetch(`/api/prompts/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                views: data.data.views + 1,
                viewedBy: [...(data.data.viewedBy || []), user.id],
              }),
            });
          }
        } else {
          setError(data.error || 'Prompt not found');
        }
      } catch (err) {
        setError('Failed to load prompt');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, [id, user]);

  const handleUpdate = async (updatedPrompt) => {
    try {
      await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likes: updatedPrompt.likes,
          likedBy: updatedPrompt.likedBy,
        }),
      });
      setPrompt(updatedPrompt);
    } catch (err) {
      console.error('Error updating prompt:', err);
    }
  };

  const handleClose = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-5xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Prompt Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      prompt={prompt}
      onUpdate={handleUpdate}
    />
  );
}