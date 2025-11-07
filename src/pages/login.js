// pages/login.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/util/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, register, user, isLoading: isAuthLoading } = useAuth();

  // Redirect if already logged in after auth check completes
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push('/');
    }
  }, [user, isAuthLoading, router]);
  
  if (isAuthLoading || user) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let result;
    if (isRegister) {
      result = await register(username, password);
    } else {
      result = await login(username, password);
    }

    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
        {isRegister ? 'Create Your Profile' : 'Login'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-100 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'
          }`}
        >
          {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
          }}
          className="text-pink-600 hover:text-pink-700 font-medium"
          disabled={loading}
        >
          {isRegister ? 'Already have an account? Login' : 'New user? Create Profile'}
        </button>
      </div>
    </div>
  );
}