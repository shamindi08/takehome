'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  //for the user object
  interface User {
    id: number;
    username: string;
    email: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      setProfile(user);
    }
  }, [token]);

  const fetchUsers = async () => {
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    const response = await fetch('https://lionfish-app-igrly.ondigitalocean.app/auth/fetch-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ page, limit }),
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      setUsers(data.users);
    } else {
      setError(data.message || 'Failed to fetch users');
    }
  };
//always fetch the users when the page or limit changes
  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="heading ">WELCOME {profile?.username}</h1>
      {profile && (
        <div className="profile-card">
          <p className="font-Proxima text-black Nova text-xl"><strong>Username:</strong> {profile.username}</p>
          {/* <p className="text-lg"><strong>User ID:</strong> {profile.id}</p>
          <p className="text-lg"><strong>Email:</strong> {profile.email}</p> */}
        </div>
      )}
      {loading && (
        <div className="loading-animation">
          <div className="spinner"></div>
          <p className="loading">Loading...</p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && users?.length === 0 ? (
        <p>No users to display</p>
      ) : (
        <div>
          {users?.map((user: any) => (
            <div key={user.id} className="user-card">
              <p className="text-lg"><strong>ID:</strong> {user.id}</p>
              <p className="text-lg"><strong>Username:</strong> {user.username}</p>
              <p className="text-lg"><strong>Email:</strong> {user.email}</p>
            </div>
          ))}
          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="button-action">Previous</button>
            <button onClick={() => setPage(page + 1)} className="button-action">Next</button>
          </div>
          
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-7 rounded-lg mx-auto block mt-5">Logout</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
