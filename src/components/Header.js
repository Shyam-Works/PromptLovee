import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 bg-white bg-opacity-90 shadow-sm h-16 flex justify-between items-center px-6">
      <Link href="/" className="text-2xl font-bold text-pink-600 tracking-wider hover:text-pink-700 transition">
        PromptLover
      </Link>
      
      <button
        onClick={() => router.push('/create')}
        className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-full shadow-lg transition transform hover:scale-105"
      >
        + Create Prompt
      </button>
    </header>
  );
};

export default Header;