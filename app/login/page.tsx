'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserDetails(token);
    }
  }, []);

  const fetchUserDetails = async (token: string) => {
    const response = await fetch('https://lionfish-app-igrly.ondigitalocean.app/auth/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data);
    } else if (response.status === 401) {
      setError('Unauthorized access. Please log in again.');
      localStorage.removeItem('token');
    } else {
      setError(data.message || 'Failed to fetch user details');
    }
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
  };

  const handleLogin = async (e: React.FormEvent) => { //to prevent the default form submission
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validatePassword(password)) {
      setError('The password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and special characters.');
      setLoading(false);
      return;
    }

    const response = await fetch('https://lionfish-app-igrly.ondigitalocean.app/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log('Response:', data); // for logging the response data
    setLoading(false);

    if (response.ok) {
      localStorage.setItem('token', data.token);
      router.push('/profile');
    } else if (response.status === 401) {
      setError('Invalid credentials. Please try again.');
    } else {
      setError(data.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center   text-gray-900 items-center min-h-screen">
      {user ? (
        <div className=" rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4">User Details</h2>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="bg-slate-50 p-6 rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4">Login</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-800 rounded"
              required
              minLength={6}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 bg-blue-500 text-white rounded ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
