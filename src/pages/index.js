// index.js (Finalized with Hover/Flyout Subcategories)
import React, { useState, useEffect, useMemo } from 'react';
import PromptCard from '@/components/PromptCard';
import Masonry from 'react-masonry-css';

// Assuming you created a file like util/CategoryMap.js
import { MAIN_CATEGORIES, CATEGORY_MAP } from '@/util/PromptCategories';


const FilterContainer = ({ 
    mainCategories, 
    selectedMain, 
    selectedSub, 
    onSelectMain, 
    onSelectSub 
}) => {
    // State to track which main category button the user is currently hovering over
    const [hoveredMainCategory, setHoveredMainCategory] = useState(null);

    // Determines which subcategories to show in the flyout
    const subCategoriesToShow = hoveredMainCategory 
        ? CATEGORY_MAP[hoveredMainCategory] || []
        : [];

    // Handler for clicking a subcategory in the flyout
    const handleSubcategoryClick = (subCategory) => {
        // We select both the main category and the subcategory when the sub is clicked
        onSelectMain(hoveredMainCategory); 
        onSelectSub(subCategory);
        setHoveredMainCategory(null); // Hide flyout after selection
    };

    // Handler for viewing all items in the hovered main category
    const handleViewAllClick = () => {
        onSelectMain(hoveredMainCategory);
        onSelectSub(null); // Reset sub-selection
        setHoveredMainCategory(null); // Hide flyout
    };

    return (
        <div className="flex flex-col items-center mb-12">
            {/* 1. Main Category Buttons (Top Row) */}
            <div className="flex flex-wrap justify-center gap-3 mb-4 relative z-10">
                <button
                    onClick={() => onSelectMain(null)}
                    onMouseEnter={() => setHoveredMainCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
                        selectedMain === null
                            ? 'bg-pink-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    All Prompts
                </button>
                
                {mainCategories.map((mainCategory) => (
                    <div
                        key={mainCategory}
                        // Set hover state when mouse enters the button area
                        onMouseEnter={() => setHoveredMainCategory(mainCategory)}
                        // Clear hover state when mouse leaves the entire flyout container
                        onMouseLeave={() => setHoveredMainCategory(null)}
                        className="relative"
                    >
                        <button
                            // Clicking selects the main category and resets subcategory
                            onClick={() => onSelectMain(mainCategory)} 
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
                                selectedMain === mainCategory || (selectedSub && CATEGORY_MAP[mainCategory]?.includes(selectedSub))
                                    ? 'bg-pink-600 text-white shadow-lg'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {mainCategory}
                        </button>

                        {/* 2. Flyout Subcategory Menu (Visible on Hover) */}
                        {hoveredMainCategory === mainCategory && subCategoriesToShow.length > 0 && (
                            <div className="absolute top-full  w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-xl z-20 transform -translate-x-1/2 left-1/2">
                                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">
                                    Filter by {mainCategory}
                                </h3>
                                <button
                                    onClick={handleViewAllClick}
                                    className="w-full text-left p-2 mb-2 rounded-md text-sm font-semibold text-pink-600 hover:bg-pink-50"
                                >
                                    View All
                                </button>
                                
                                <div className="space-y-1">
                                    {subCategoriesToShow.map((subCategory) => (
                                        <button
                                            key={subCategory}
                                            onClick={() => handleSubcategoryClick(subCategory)}
                                            className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                                                selectedSub === subCategory 
                                                ? 'bg-pink-100 text-pink-700 font-medium' 
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {subCategory}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            
        </div>
    );
};


export default function Home() {
    const [filteredPrompts, setFilteredPrompts] = useState([]); 
    const [allPrompts, setAllPrompts] = useState([]); 
    
    const [selectedMainCategory, setSelectedMainCategory] = useState(null); 
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); 
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };
    useEffect(() => {
        loadPrompts();
    }, []);

    const loadPrompts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/prompts');
            const data = await res.json();
            if (data.success) {
                setAllPrompts(data.data); 
            }
            else setError(data.error);
        } catch {
            setError('Failed to load prompts');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromptUpdate = async (updatedPrompt) => {
        try {
            await fetch(`/api/prompts/${updatedPrompt._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    likes: updatedPrompt.likes,
                    views: updatedPrompt.views,
                }),
            });

            setAllPrompts(prev =>
                prev.map(p => (p._id === updatedPrompt._id ? updatedPrompt : p))
            );
        } catch (err) {
            console.error('Error updating prompt:', err);
        }
    };
    
    // --- Combined Filtering Logic ---
    useEffect(() => {
        let currentFiltered = allPrompts;

        if (selectedSubcategory) {
            // Priority 1: Filter by specific subcategory
            currentFiltered = allPrompts.filter(prompt => 
                prompt.category.includes(selectedSubcategory)
            );
        } else if (selectedMainCategory) {
            // Priority 2: Filter by ALL subcategories within the selected main group
            const subcategoriesInMain = CATEGORY_MAP[selectedMainCategory] || [];
            currentFiltered = allPrompts.filter(prompt => 
                prompt.category.some(cat => subcategoriesInMain.includes(cat))
            );
        } 
        // If both are null, show all prompts

        setFilteredPrompts(currentFiltered);
    }, [allPrompts, selectedMainCategory, selectedSubcategory]);
    
    // Handlers
    const handleSelectMainCategory = (category) => {
        setSelectedMainCategory(category);
        setSelectedSubcategory(null); // Reset subcategory when main category changes
    };

    const handleSelectSubcategory = (category) => {
        setSelectedSubcategory(category);
    };


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading prompts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-10">
                Error loading prompts: {error}
            </div>
        );
    }

    return ( 
        // no space at left or right and take div whole width
        <div className="w-full py-10 px-0 ">

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-10 text-center">
                Find Your Next <span className='text-pink-600'>Prompt</span> Inspiration
            </h1>

            {/* Combined Filter Component */}
            <FilterContainer 
                mainCategories={MAIN_CATEGORIES}
                selectedMain={selectedMainCategory}
                selectedSub={selectedSubcategory}
                onSelectMain={handleSelectMainCategory}
                onSelectSub={handleSelectSubcategory}
            />

            {/* Prompt List Display */}
            {filteredPrompts.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    <p className="text-xl mb-4">
                        No prompts found for the selected filter.
                    </p>
                    <p>
                        Be the first to{' '}
                        <span className="font-bold text-pink-600">create a prompt!</span>
                    </p>
                </div>
            ) : (
                <div className="container mx-auto px-4">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
                    {filteredPrompts.map((prompt) => (
                        <PromptCard
                            key={prompt._id}
                            initialPrompt={prompt}
                            onUpdate={handlePromptUpdate}
                        />
                    ))}
                </Masonry>
    </div>
            )}
        </div>
    );
}
