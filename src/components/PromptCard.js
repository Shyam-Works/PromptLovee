import React, { useState } from "react";
import { AiFillEye, AiFillHeart } from "react-icons/ai";
import Modal from "./Modal";
import { useAuth } from "@/util/AuthContext";
import { useRouter } from "next/router";

const formatNumber = (num) => {
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1).replace(/\.0$/, '');
    return `${formatted}k+`;
  }
  return num.toString();
};

const PromptCard = ({ initialPrompt, onUpdate }) => {
  const { user } = useAuth();
  const router = useRouter();

  const [prompt, setPrompt] = useState(initialPrompt);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [isLiked, setIsLiked] = useState(
    !!user && (prompt.likedBy || []).includes(user.id)
  );

  const hasViewed = !!user && (prompt.viewedBy || []).includes(user.id);

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!user) {
      alert("Please log in to like/unlike a prompt.");
      router.push("/login");
      return;
    }

    if (isLiking) {
      return;
    }

    setIsLiking(true);

    try {
      let updatedPrompt;
      let newIsLikedState;

      if (isLiked) {
        const newLikedBy = (prompt.likedBy || []).filter(
          (userId) => userId !== user.id
        );

        updatedPrompt = {
          ...prompt,
          likes: prompt.likes - 1,
          likedBy: newLikedBy,
        };
        newIsLikedState = false;

      } else {
        updatedPrompt = {
          ...prompt,
          likes: prompt.likes + 1,
          likedBy: [...(prompt.likedBy || []), user.id],
        };
        newIsLikedState = true;
      }

      setPrompt(updatedPrompt);
      setIsLiked(newIsLikedState);

      onUpdate && (await onUpdate(updatedPrompt));

    } catch (error) {
      console.error('Like/Unlike failed:', error);
      alert('An error occurred while trying to update the like status.');
    } finally {
      setTimeout(() => setIsLiking(false), 500);
    }
  };

  const handleCardClick = async () => {
    if (!user) {
      alert("You must be logged in to view listing details.");
      router.push("/login");
      return;
    }
    if (!hasViewed) {
      try {
        const updatedPrompt = {
          ...prompt,
          views: prompt.views + 10,
          viewedBy: [...(prompt.viewedBy || []), user.id],
        };

        setPrompt(updatedPrompt);

        onUpdate && (await onUpdate(updatedPrompt));

      } catch (error) {
        console.error('View update failed:', error);
      }
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col break-inside-avoid mb-6"
      >
        {/* Image Section */}
        <div className="w-full overflow-hidden relative">
          <div className="absolute top-2 right-2 z-5 bg-black bg-opacity-40 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white font-semibold flex items-center space-x-2">
            <span className="flex items-center gap-1">
              <AiFillEye className="text-sm" /> {formatNumber(prompt.views)}
            </span>

            <span
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleLike}
            >
              <AiFillHeart
                className={`text-sm transition ${isLiked ? 'text-red-500' : 'text-white-400'}`}
              />
              {prompt.likes}
            </span>
          </div>

          <img
            src={prompt.imageUrl}
            alt="AI Generated Art"
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Text Section */}
        <div className="p-4 flex flex-col">
          <h3 className="text-md font-semibold text-gray-800 mb-1">
            {prompt.promptText.length > 60
              ? prompt.promptText.slice(0, 57) + "..."
              : prompt.promptText}
          </h3>
          <p className="text-sm text-pink-500 font-semibold">
            AI Tool: {prompt.aiTool}
          </p>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prompt={prompt}
      />
    </>
  );
};

export default PromptCard;
