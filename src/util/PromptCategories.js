// util/CategoryMap.js
export const CATEGORY_MAP = {
  'Portraits & People': [
    "Men's Portraits",
    "Women's Portraits",
    "Professional Headshots",
    "Fashion (Editorial)",
  ],
  'Business & Design': [
    "Product Design",
    "Marketing/Advertising",
    "Poster Design",
    "Logo/Iconography",
    "T-Shirt Graphics",
    "Album/Book Cover",
    "Mascot Design",
  ],
  'Conceptual & Scenery': [
    "Landscape/Scenery",
    "Cityscapes/Urban",
    "Interior Design",
    "Mood Boards/Aesthetics",
    "Still Life",
    "Historical Recreations",
    "Dungeons & Dragons (D&D)",
  ],
  'Technical & Utility': [
    "Technical Illustration",
    "Infographics/Data Viz",
    "Video Game Assets",
    "Web/UI Backgrounds",
    "Greeting Card Art",
    "Medical/Scientific",
  ],
  'Miscellaneous': [
    "Food & Beverage",
    "Pets & Animals",
    "Children's Education",
    "Sports & Action",
    "Vehicle Art (Cars/Planes)",
    "Religious/Spiritual",
  ],
};

// Export Main Categories in your desired display order
export const MAIN_CATEGORIES = Object.keys(CATEGORY_MAP);

// Export all subcategories as a flat list (useful for validation/initial prompt check)
export const ALL_SUBCATEGORIES = Object.values(CATEGORY_MAP).flat();