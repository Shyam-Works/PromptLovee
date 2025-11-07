import React, { useState } from "react";
import { AiFillEye, AiFillHeart } from "react-icons/ai";
import Modal from "./Modal";
import { useAuth } from "@/util/AuthContext";
import { useRouter } from "next/router";

const PromptCard = ({ initialPrompt, onUpdate }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);
    const updated = { ...prompt, likes: prompt.likes + 1 };
    setPrompt(updated);
    onUpdate && (await onUpdate(updated));
    setTimeout(() => setIsLiking(false), 500);
  };

  const handleCardClick = async () => {
    if (!user) {
      alert("You must be logged in to view listing details.");
      router.push("/login");
      return;
    }
    const updated = { ...prompt, views: prompt.views + 1 };
    setPrompt(updated);
    onUpdate && (await onUpdate(updated));
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
      >
        {/* Image Section - Square aspect ratio */}
        <div className="w-full overflow-hidden">
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