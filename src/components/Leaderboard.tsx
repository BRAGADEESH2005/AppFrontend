import React, { useEffect, useState } from 'react';
import axios from '../services/axios';

interface LeaderboardUser {
  username: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/users/leaderboard');
        if (response.data && response.data.status === 'Success') {
          setUsers(response.data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-100 p-4 font-bold">
          <div>Rank</div>
          <div>Username</div>
          <div>Score</div>
        </div>
        {users.map((user, index) => (
          <div key={index} className="grid grid-cols-3 p-4 border-b">
            <div>#{index + 1}</div>
            <div>{user.username}</div>
            <div>{user.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
