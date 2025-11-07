import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/util/AuthContext'; // NEW IMPORT
import { FaUserCircle, FaPlus } from 'react-icons/fa'; // Requires 'react-icons' - ADDED FaPlus

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth(); // Get auth state 

  const handleCreateClick = () => {
    if (user) {
      router.push('/create');
    } else {
      // **Require login to create prompt**
      alert('Please log in to create a prompt listing.');
      router.push('/login'); 
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    // z-50 ensures it stays on top, as previously fixed
    <header className="sticky top-0 z-50 bg-white bg-opacity-90 shadow-sm h-16 flex justify-between items-center px-4 sm:px-6">
      <Link href="/" className="text-2xl font-bold text-pink-600 tracking-wider hover:text-pink-700 transition">
          <Image
          src="/Logo.svg" 
          alt="PromptLover Logo"
          // Reduce width on small screens if necessary, or just rely on the container size
          width={150} // Slightly reduced width for better fit
          height={0}
        />
      </Link>
      
      <div className="flex items-center space-x-2 sm:space-x-4"> {/* Reduced space on mobile */}
        
        {/* + Create Prompt Button (Responsive) */}
        <button
          onClick={handleCreateClick}
          // The button is tall/wide on sm+ screens, but smaller/icon-only on mobile
          className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-3 sm:px-6 rounded-full shadow-lg transition transform hover:scale-105 flex items-center justify-center"
        >
          <FaPlus className="w-4 h-4 sm:hidden" /> {/* Show icon only on small screens */}
          <span className="hidden sm:inline">+ Create Prompt</span> {/* Show text on sm+ screens */}
        </button>

        {/* User Profile/Auth Links */}
        {user ? (
          <>
            <Link href="/profile" className="flex items-center text-gray-700 hover:text-pink-600 transition">
              <FaUserCircle className="w-6 h-6 mr-0 sm:mr-1" /> {/* Reduce margin on mobile */}
              <span className="hidden md:inline font-semibold">{user.username}</span> {/* Hide username on small (sm) and medium (md) screens, show only on large screens */}
            </Link>
            <button
              onClick={handleLogout}
              // Adjust padding/font size for smaller screens
              className="text-gray-500 hover:text-red-500 transition font-medium text-sm sm:text-base"
            >
              Logout
            </button>
          </>
        ) : (
          // Login / Register Button (Responsive)
          <Link 
            href="/login" 
            // Use smaller padding and text on mobile, revert on sm+
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-3 sm:px-4 rounded-full transition text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Login / Register</span>
            <span className="sm:hidden">Login</span> {/* Simpler text on mobile */}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;