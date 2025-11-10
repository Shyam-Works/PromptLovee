// pages/_app.js (Updated with Elegant Design)
import '@/../../dist/output.css'; 
import Header from '@/components/Header';
import { AuthProvider } from '@/util/AuthContext';
import './index.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        {/* Google Fonts - Elegant combination */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Inline styles for custom fonts */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-heading: 'Playfair Display', serif;
            --font-body: 'Inter', sans-serif;
            --font-accent: 'Poppins', sans-serif;
          }
          
          body {
            font-family: var(--font-body);
            font-weight: 400;
            letter-spacing: -0.01em;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            font-weight: 700;
            letter-spacing: -0.02em;
          }
          
          button, .btn {
            font-family: var(--font-accent);
            letter-spacing: 0.01em;
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #db2777;
            border-radius: 5px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #be185d;
          }
          
          /* Gradient background */
          
          
          /* Glass morphism effect */
          .glass-effect {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          
          /* Smooth animations */
          * {
            transition: all 0.2s ease-in-out;
          }
          
          /* Focus states */
          button:focus,
          a:focus {
            outline: 2px solid #db2777;
            outline-offset: 2px;
          }
          
          /* Loading animation */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .fade-in {
            animation: fadeIn 0.4s ease-out;
          }
          
          /* Mobile optimization */
          @media (max-width: 640px) {
            body {
              font-size: 15px;
            }
            
            h1 {
              font-size: 2rem;
              line-height: 1.2;
            }
            
            h2 {
              font-size: 1.5rem;
            }
            
            h3 {
              font-size: 1.25rem;
            }
          }
          
          /* Elegant shadows */
          .elegant-shadow {
            box-shadow: 0 4px 6px -1px rgba(219, 39, 119, 0.1), 
                        0 2px 4px -1px rgba(219, 39, 119, 0.06);
          }
          
          .elegant-shadow-lg {
            box-shadow: 0 10px 15px -3px rgba(219, 39, 119, 0.1), 
                        0 4px 6px -2px rgba(219, 39, 119, 0.05);
          }
          
          /* Hover effects */
          .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .hover-lift:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(219, 39, 119, 0.15), 
                        0 10px 10px -5px rgba(219, 39, 119, 0.1);
          }
        `}} />
      </Head>
      
      <div className="min-h-screen elegant-bg">
        <div className="glass-effect sticky top-0 z-50 border-b border-pink-100/50">
          <Header />
        </div>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 fade-in">
          <Component {...pageProps} />
        </main>
        
        {/* Elegant footer */}
        <footer className="glass-effect border-t border-pink-100/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600 text-sm sm:text-base font-light">
                Crafted with <span className="text-pink-600">♡</span> for creative minds
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">
                © {new Date().getFullYear()} All rights reserved
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default MyApp;