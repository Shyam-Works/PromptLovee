import React, { useState } from "react";
import { AiFillEye, AiFillHeart } from "react-icons/ai";
import Modal from "./Modal";
import { useAuth } from "@/util/AuthContext";
import { useRouter } from "next/router";

const PromptCard = ({ initialPrompt, onUpdate }) => {
  const { user } = useAuth();
  const router = useRouter();

  // 1. Initialize prompt state
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // 2. Initialize isLiked state correctly
  const [isLiked, setIsLiked] = useState(
    // Ensure prompt.likedBy is an array before checking includes
    !!user && (prompt.likedBy || []).includes(user.id)
  );
  
  // Helper to check if the user has already viewed the prompt
  const hasViewed = !!user && (prompt.viewedBy || []).includes(user.id);


  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent card click (view) from triggering

    if (!user) {
      alert("Please log in to like/unlike a prompt.");
      router.push("/login");
      return;
    }
    
    // 🛑 LOGIC CHECK: Prevent double-clicking while an operation is in progress
    if (isLiking) {
      return; 
    } 

    setIsLiking(true);

    try {
        let updatedPrompt;
        let newIsLikedState;

        if (isLiked) {
            // Case 1: UNLIKING (User wants to undo the like)
            
            // Remove the user's ID from the likedBy array
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
            // Case 2: LIKING (User wants to add a like)
            
            updatedPrompt = { 
                ...prompt, 
                likes: prompt.likes + 1,
                // 🐛 Safely add user ID to the likedBy array (using || [] fix)
                likedBy: [...(prompt.likedBy || []), user.id], 
            };
            newIsLikedState = true;
        }

        setPrompt(updatedPrompt);
        setIsLiked(newIsLikedState); // Update the visual state
        
        // Notify parent component (which should call the server API to save the change)
        onUpdate && (await onUpdate(updatedPrompt));

    } catch (error) {
        console.error('Like/Unlike failed:', error);
        alert('An error occurred while trying to update the like status.');
        // In a real app, you would revert the state here if the API call failed
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

    // 🛑 LOGIC CHECK: Only increment views if the current user hasn't viewed it yet
    if (!hasViewed) {
      try {
        // --- View Update Logic ---
        const updatedPrompt = {
            ...prompt,
            views: prompt.views + 1,
            // 🐛 Safely add user ID to the viewedBy array (using || [] fix)
            viewedBy: [...(prompt.viewedBy || []), user.id], 
        };

        setPrompt(updatedPrompt);
        
        // Notify parent component (which should call the server API)
        onUpdate && (await onUpdate(updatedPrompt));
        
      } catch (error) {
        console.error('View update failed:', error);
      }
    }
    
    // Always open the modal after authentication/view check
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
      >
        {/* Image Section - Square aspect ratio */}
        <div className="w-full overflow-hidden relative">
          {/* ⭐️ Views and Likes Badge ⭐️ */}
          <div className="absolute top-2 right-2 z-10 bg-black bg-opacity-40 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white font-semibold flex items-center space-x-2">
            
            {/* Views */}
            <span className="flex items-center gap-1">
              <AiFillEye className="text-sm" /> {prompt.views}
            </span>
            
            {/* Likes - Now functions as a toggle button */}
            <span 
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleLike} 
            >
              <AiFillHeart 
                // Change color based on local isLiked state
                className={`text-sm transition ${isLiked ? 'text-red-500' : 'text-red-400'}`} 
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

        {/* Text Section - Compact */}
        <div className="p-3">
          {/* Prompt Preview with fade */}
          <div className="relative">
            <p className="text-md text-gray-600 leading-snug line-clamp-4">
              {(prompt.promptText?.split(" ").slice(0, 20).join(" ") || "Click to see more details") +
                (prompt.promptText?.split(" ").length > 20 ? "..." : "")}
            </p>

            <span className="text-pink-600 text-xs font-medium mt-1 inline-block">
              Read more...
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prompt={prompt}
      />
    </>
  );
};

export default PromptCard;