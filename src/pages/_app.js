// pages/_app.js (Updated)
import '@/../../dist/output.css'; 
import Header from '@/components/Header';
import { AuthProvider } from '@/util/AuthContext'; // NEW IMPORT
import './index.css';
function MyApp({ Component, pageProps }) {
  return (
    // **NEW: AuthProvider Wrapper**
    <AuthProvider> 
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  );
}

export default MyApp;