'use client';

import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen --background">
      <h1 className="text-4xl  text-gray-900 font-bold mb-6">Welcome to My App</h1>
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </button>
    </div>
  );
};

export default Home;
