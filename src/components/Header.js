// components/Header.js (Updated)
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/util/AuthContext'; // NEW IMPORT
import { FaUserCircle } from 'react-icons/fa'; // Requires 'react-icons'

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
    <header className="sticky top-0 z-10 bg-white bg-opacity-90 shadow-sm h-16 flex justify-between items-center px-6">
      <Link href="/" className="text-2xl font-bold text-pink-600 tracking-wider hover:text-pink-700 transition">
        PromptLover❤️
      </Link>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={handleCreateClick}
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-full shadow-lg transition transform hover:scale-105"
        >
          + Create Prompt
        </button>

        {/* User Profile/Auth Links */}
        {user ? (
          <>
            <Link href="/profile" className="flex items-center text-gray-700 hover:text-pink-600 transition">
              <FaUserCircle className="w-6 h-6 mr-1" />
              <span className="hidden sm:inline font-semibold">{user.username}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-full transition">
            Login / Register
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;