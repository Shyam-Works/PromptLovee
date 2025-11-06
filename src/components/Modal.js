import React from 'react';
import { AiOutlineClose, AiFillEye, AiFillHeart } from 'react-icons/ai';

const Modal = ({ isOpen, onClose, prompt }) => {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.promptText);
    alert('Prompt copied to clipboard!');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"
        >
          <AiOutlineClose className="text-xl" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Image Side */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={prompt.imageUrl} 
              alt="AI Generated Art" 
              className="w-full h-auto object-contain max-h-96"
            />
          </div>

          {/* Details Side */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Prompt Details</h2>
            
            <p className="text-xs font-semibold text-pink-500 uppercase tracking-wider mb-4">
              AI Tool: {prompt.aiTool}
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">The Prompt:</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{prompt.promptText}</p>
            </div>
            
            <button 
              onClick={copyToClipboard}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Copy Prompt to Clipboard
            </button>

            <div className="mt-4 flex gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <AiFillEye /> {prompt.views} views
              </span>
              <span className="flex items-center gap-1">
                <AiFillHeart className="text-red-400" /> {prompt.likes} likes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;