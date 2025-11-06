import '../../dist/output.css';

import Header from '@/components/Header';

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;