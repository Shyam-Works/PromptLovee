// index.js (Elegant Design)
import React, { useState, useEffect } from 'react';
import PromptCard from '@/components/PromptCard';
import Masonry from 'react-masonry-css';
import { MAIN_CATEGORIES, CATEGORY_MAP } from '@/util/PromptCategories';


const FilterContainer = ({ 
    mainCategories, 
    selectedMain, 
    selectedSub, 
    onSelectMain, 
    onSelectSub,
    sortBy,
    onSortChange
}) => {
    const [hoveredMainCategory, setHoveredMainCategory] = useState(null);

    const subCategoriesToShow = hoveredMainCategory 
        ? CATEGORY_MAP[hoveredMainCategory] || []
        : [];

    const handleSubcategoryClick = (subCategory) => {
        onSelectMain(hoveredMainCategory); 
        onSelectSub(subCategory);
        setHoveredMainCategory(null);
    };

    const handleViewAllClick = () => {
        onSelectMain(hoveredMainCategory);
        onSelectSub(null);
        setHoveredMainCategory(null);
    };

    return (
        <div className="flex flex-col items-center mb-10 sm:mb-14 lg:mb-16 fade-in">
            {/* Main Category Buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 relative z-10 px-2">
                <button
                    onClick={() => onSelectMain(null)}
                    onMouseEnter={() => setHoveredMainCategory(null)}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                        selectedMain === null
                            ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-200 scale-105'
                            : 'bg-white text-gray-700 hover:bg-gray-50 elegant-shadow hover:shadow-md'
                    }`}
                >
                    All Prompts
                </button>
                
                {mainCategories.map((mainCategory) => (
                    <div
                        key={mainCategory}
                        onMouseEnter={() => setHoveredMainCategory(mainCategory)}
                        onMouseLeave={() => setHoveredMainCategory(null)}
                        className="relative"
                    >
                        <button
                            onClick={() => onSelectMain(mainCategory)} 
                            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                                selectedMain === mainCategory || (selectedSub && CATEGORY_MAP[mainCategory]?.includes(selectedSub))
                                    ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-200 scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 elegant-shadow hover:shadow-md'
                            }`}
                        >
                            {mainCategory}
                        </button>

                        {/* Flyout Subcategory Menu */}
                        {hoveredMainCategory === mainCategory && subCategoriesToShow.length > 0 && (
                            <div className="absolute top-full mt-2 w-56 sm:w-64 p-4 bg-white border border-pink-100 rounded-2xl elegant-shadow-lg z-20 transform -translate-x-1/2 left-1/2">
                                <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">
                                    {mainCategory}
                                </h3>
                                <button
                                    onClick={handleViewAllClick}
                                    className="w-full text-left px-3 py-2 mb-2 rounded-xl text-sm font-semibold text-pink-600 hover:bg-pink-50 transition-colors"
                                >
                                    View All
                                </button>
                                
                                <div className="space-y-1">
                                    {subCategoriesToShow.map((subCategory) => (
                                        <button
                                            key={subCategory}
                                            onClick={() => handleSubcategoryClick(subCategory)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                                                selectedSub === subCategory 
                                                ? 'bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 font-semibold' 
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
            
            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl elegant-shadow">
                <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Sort by</span>
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => onSortChange('latest')}
                        className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                            sortBy === 'latest'
                                ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-md shadow-pink-200'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        ✨ Latest
                    </button>
                    <button
                        onClick={() => onSortChange('likes')}
                        className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                            sortBy === 'likes'
                                ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-md shadow-pink-200'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        ❤️ Most Liked
                    </button>
                    <button
                        onClick={() => onSortChange('views')}
                        className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                            sortBy === 'views'
                                ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-md shadow-pink-200'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        👁️ Most Viewed
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function Home() {
    const [filteredPrompts, setFilteredPrompts] = useState([]); 
    const [allPrompts, setAllPrompts] = useState([]); 
    
    const [selectedMainCategory, setSelectedMainCategory] = useState(null); 
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); 
    const [sortBy, setSortBy] = useState('latest');
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const breakpointColumnsObj = {
        default: 4,
        1280: 3,
        768: 2,
        640: 1
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
    
    useEffect(() => {
        let currentFiltered = allPrompts;

        if (selectedSubcategory) {
            currentFiltered = allPrompts.filter(prompt => 
                prompt.category.includes(selectedSubcategory)
            );
        } else if (selectedMainCategory) {
            const subcategoriesInMain = CATEGORY_MAP[selectedMainCategory] || [];
            currentFiltered = allPrompts.filter(prompt => 
                prompt.category.some(cat => subcategoriesInMain.includes(cat))
            );
        } 

        const sortedPrompts = [...currentFiltered].sort((a, b) => {
            switch (sortBy) {
                case 'likes':
                    return b.likes - a.likes;
                case 'views':
                    return b.views - a.views;
                case 'latest':
                default:
                    return b._id.localeCompare(a._id) ;
            }
        });

        setFilteredPrompts(sortedPrompts);
    }, [allPrompts, selectedMainCategory, selectedSubcategory, sortBy]);
    
    const handleSelectMainCategory = (category) => {
        setSelectedMainCategory(category);
        setSelectedSubcategory(null);
    };

    const handleSelectSubcategory = (category) => {
        setSelectedSubcategory(category);
    };

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
    };


    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-base sm:text-lg text-gray-600 font-light">Loading your inspiration...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center bg-white p-6 sm:p-8 rounded-2xl elegant-shadow-lg max-w-md">
                    <div className="text-4xl sm:text-5xl mb-4">😞</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-sm sm:text-base text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={loadPrompts}
                        className="px-6 py-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return ( 
        <div className="w-full py-4 sm:py-6 lg:py-8">
            {/* Hero Section */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 fade-in">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                    Discover Your Next
                </h1>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 bg-clip-text text-transparent">
                        Prompt Inspiration
                    </span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                    Explore a curated collection of AI prompts crafted by creative minds worldwide
                </p>
            </div>

            {/* Filter & Sort Component */}
            <FilterContainer 
                mainCategories={MAIN_CATEGORIES}
                selectedMain={selectedMainCategory}
                selectedSub={selectedSubcategory}
                onSelectMain={handleSelectMainCategory}
                onSelectSub={handleSelectSubcategory}
                sortBy={sortBy}
                onSortChange={handleSortChange}
            />

            {/* Prompt Grid */}
            {filteredPrompts.length === 0 ? (
                <div className="text-center py-16 sm:py-20 lg:py-24 px-4 fade-in">
                    <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg mx-auto elegant-shadow-lg">
                        <div className="text-5xl sm:text-6xl mb-6">🎨</div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                            No Prompts Found
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 font-light">
                            Be a pioneer! Create the first prompt in this category.
                        </p>
                        <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all text-sm sm:text-base">
                            Create Prompt
                        </button>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto px-2 sm:px-4 fade-in">
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="flex -ml-4 sm:-ml-6 w-auto"
                        columnClassName="pl-4 sm:pl-6 bg-clip-padding"
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