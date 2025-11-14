import React, { useState } from 'react';
import { AiOutlineClose, AiFillEye, AiFillHeart, AiOutlineShareAlt, AiOutlineCheck } from 'react-icons/ai';
import { useAuth } from '@/util/AuthContext';
import { useRouter } from 'next/router';

const Modal = ({ isOpen, onClose, prompt, onUpdate }) => {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  
  const [isLiked, setIsLiked] = useState(
    !!user && (prompt.likedBy || []).includes(user.id)
  );

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const copyLinkToClipboard = () => {
    const url = `${window.location.origin}/prompts/${prompt._id}`;
    navigator.clipboard.writeText(url);
    setIsLinkCopied(true);
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!user) {
      alert("Please log in to like/unlike a prompt.");
      router.push("/login");
      return;
    }

    if (isLiking) return;

    setIsLiking(true);

    try {
      let updatedPrompt;

      if (isLiked) {
        const newLikedBy = (prompt.likedBy || []).filter(
          (userId) => userId !== user.id
        );
        updatedPrompt = {
          ...prompt,
          likes: prompt.likes - 1,
          likedBy: newLikedBy,
        };
        setIsLiked(false);
      } else {
        updatedPrompt = {
          ...prompt,
          likes: prompt.likes + 1,
          likedBy: [...(prompt.likedBy || []), user.id],
        };
        setIsLiked(true);
      }

      onUpdate && (await onUpdate(updatedPrompt));
    } catch (error) {
      console.error('Like/Unlike failed:', error);
      alert('An error occurred while trying to update the like status.');
    } finally {
      setTimeout(() => setIsLiking(false), 500);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-3xl sm:max-w-4xl md:max-w-5xl 
                   max-h-[85vh] sm:max-h-[9vh] md:max-h-[95vh] relative flex flex-col overflow-hidden shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition z-10 shadow"
        >
          <AiOutlineClose className="text-xl" />
        </button>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 md:p-5 overflow-hidden h-full">
          {/* Image Side */}
          <div className="flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden
                h-80 sm:h-96 md:h-[90vh] md:w-2/5">
            <img
              src={prompt.imageUrl}
              alt="AI Generated Art"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Details Side */}
          <div className="flex flex-col md:w-3/5 gap-3 md:gap-4 overflow-y-auto">
            <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-800">Prompt Details</h2>
            <p className="text-xs sm:text-sm md:text-sm font-semibold text-pink-500 uppercase tracking-wider">
              AI Tool: {prompt.aiTool}
            </p>

            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-dashed border-gray-300 
                            overflow-y-auto max-h-40 sm:max-h-52 md:max-h-72">
              <h3 className="text-md sm:text-lg md:text-lg font-semibold text-gray-700 mb-1">The Prompt:</h3>
              <p className="text-gray-600 whitespace-pre-wrap break-words">{prompt.promptText}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className={`flex-1 text-white font-medium py-2 rounded-lg transition ${
                  isCopied ? 'bg-pink-600 hover:bg-pink-600' : 'bg-pink-500 hover:bg-pink-600'
                }`}
              >
                {isCopied ? 'Copied!' : 'Copy Prompt'}
              </button>

              <button
                onClick={copyLinkToClipboard}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  isLinkCopied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isLinkCopied ? (
                  <>
                    <AiOutlineCheck className="text-lg" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <AiOutlineShareAlt className="text-lg" />
                    Share
                  </>
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <AiFillEye /> {prompt.views} views
              </span>
              <span 
                className="flex items-center gap-1 cursor-pointer hover:text-red-500 transition"
                onClick={handleLike}
              >
                <AiFillHeart className={isLiked ? 'text-red-500' : 'text-gray-400'} />
                {prompt.likes} likes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;