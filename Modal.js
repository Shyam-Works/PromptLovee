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
      // Increased external padding p-6/p-8 forces the card inward, providing necessary margin.
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-6 sm:p-8"
      onClick={onClose}
    >
      <div
        // Max width is reduced (max-w-xs) to shrink the overall card size on mobile.
        className="bg-white rounded-xl w-full max-w-xs sm:max-w-lg md:max-w-5xl max-h-full relative flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Remains positioned relative to the card's edge */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition z-10"
        >
          <AiOutlineClose className="text-xl" />
        </button>

        {/* Content Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 p-3 sm:p-4 md:p-6 h-full overflow-y-auto md:overflow-hidden">
          
          {/* Image Side - Responsive container changes */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden h-48 sm:h-64 md:h-auto md:max-h-full">
            <img
              src={prompt.imageUrl}
              alt="AI Generated Art"
              className="w-full h-full object-contain p-2"
            />
          </div>

          {/* Details Side - Full width on mobile */}
          <div className="flex flex-col h-full overflow-hidden">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 mt-3 md:mt-0">Prompt Details</h2>

            <p className="text-xs font-semibold text-pink-500 uppercase tracking-wider mb-2">
              AI Tool: {prompt.aiTool}
            </p>
            
            {/* Categories (Optional, based on your Prompt model) */}
            {prompt.category?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {prompt.category.map((cat, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
                            {cat}
                        </span>
                    ))}
                </div>
            )}

            {/* Scrollable Description Box - Reduced vertical padding (py-3) for compactness */}
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-dashed border-gray-300 mb-3 h-auto max-h-[40vh] md:h-64 overflow-y-auto flex-grow">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1">The Prompt:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                {prompt.promptText}
              </p>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition mb-3 flex-shrink-0 text-sm"
            >
              Copy Prompt to Clipboard
            </button>

            <div className="flex gap-4 text-sm text-gray-500 flex-shrink-0">
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