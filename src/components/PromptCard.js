import { AiFillEye, AiFillHeart } from 'react-icons/ai';
import { useState } from 'react';
import Modal from './Modal';
import React from 'react';

const PromptCard = ({ initialPrompt, onUpdate }) => { 
  const [prompt, setPrompt] = useState(initialPrompt); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    const updatedPrompt = { ...prompt, likes: prompt.likes + 1 };
    setPrompt(updatedPrompt);
    
    if (onUpdate) {
      await onUpdate(updatedPrompt);
    }
    
    setTimeout(() => setIsLiking(false), 500);
  };

  const handleCardClick = async () => {
    const updatedPrompt = { ...prompt, views: prompt.views + 1 };
    setPrompt(updatedPrompt);
    
    if (onUpdate) {
      await onUpdate(updatedPrompt);
    }
    
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        onClick={handleCardClick}
      >
        {/* Image */}
        <div className="aspect-square overflow-hidden">
  <img
    src={prompt.imageUrl}
    alt="AI Generated Art"
    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
    loading="lazy"
  />
</div>
        
        {/* Overlay for Views/Likes */}
        <div className="absolute top-2 right-2 flex gap-2 p-2 bg-black bg-opacity-50 rounded-lg text-white text-xs">
          <span className="flex items-center gap-1">
            <AiFillEye /> {prompt.views}
          </span>
          <button 
            onClick={handleLike} 
            className="flex items-center gap-1 hover:scale-110 transition-transform disabled:opacity-50"
            disabled={isLiking}
            aria-label="Like this prompt"
          >
            <AiFillHeart className="text-red-400" /> {prompt.likes}
          </button>
        </div>
      </div>
      
      {/* Modal to display details on click */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        prompt={prompt} 
      />
    </>
  );
};

export default PromptCard;