// pages/profile.js
import { useAuth } from '@/util/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PromptCard from '@/components/PromptCard';

export default function Profile() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [userPrompts, setUserPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.push('/login'); 
      return;
    }

    const fetchUserPrompts = async () => {
      setIsLoading(true);
      try {
        // Fetch prompts created by the current user
        const res = await fetch(`/api/prompts?creatorId=${user.id}`); 
        const data = await res.json();
        
        if (data.success) {
          setUserPrompts(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to load your prompts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserPrompts();
  }, [user, isAuthLoading, router]);

  const handleDelete = async (promptId) => {
    if (!window.confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
      return;
    }

    try {
      // Call DELETE API endpoint for a specific prompt ID
      const res = await fetch(`/api/prompts/${promptId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Optimistically update the UI
        setUserPrompts(prev => prev.filter(p => p._id !== promptId));
      } else {
        const errorData = await res.json();
        alert(`Failed to delete prompt: ${errorData.error}`);
      }
    } catch (error) {
      alert('An unexpected error occurred during deletion.');
    }
  };

  if (isAuthLoading || (!user && !isLoading)) {
    return null; // Redirect handled by useEffect
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading your listings...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Your Prompts
      </h1>
      
      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      {userPrompts.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <p className="text-xl mb-4">You haven't created any prompts yet.</p>
          <p>Click '+ Create Prompt' in the header to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userPrompts.map((prompt) => (
            <div key={prompt._id} className="relative group">
              <PromptCard 
                initialPrompt={prompt} 
                onUpdate={() => {}} // Pass a no-op since likes/views updates are not critical on the profile view
              />
              <button
                onClick={() => handleDelete(prompt._id)}
                className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-full text-xs opacity-0 group-hover:opacity-100 transition shadow-lg z-10"
              >
                DELETE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}