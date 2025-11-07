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
        className="bg-white rounded-xl w-full max-w-5xl h-[85vh] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition z-10"
        >
          <AiOutlineClose className="text-xl" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 h-full overflow-hidden">
          {/* Image Side - Fixed container with centered image */}
         <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden w-[70%] max-h-[70vh]">
  <img
    src={prompt.imageUrl}
    alt="AI Generated Art"
    className="max-w-full max-h-full object-contain"
  />
</div>



          {/* Details Side */}
          <div className="flex flex-col h-full overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Prompt Details</h2>

            <p className="text-xs font-semibold text-pink-500 uppercase tracking-wider mb-3">
              AI Tool: {prompt.aiTool}
            </p>

            {/* Scrollable Description Box - Fixed Height */}
            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 mb-4 h-64 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">The Prompt:</h3>
              <p className="text-gray-600 whitespace-pre-wrap break-words">
                {prompt.promptText}
              </p>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition mb-4 flex-shrink-0"
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