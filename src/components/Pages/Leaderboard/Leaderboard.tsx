import React, { useEffect, useState } from 'react';
import axios from '../../../services/axios';
import Layout from '../../UI/Layout';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@mui/material';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface LeaderboardUser {
  username: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colorMode } = usethemeUtils();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/users/leaderboard');
        if (response.data && response.data.status === 'Success') {
          setUsers(response.data.data || []);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Leaderboard error:', err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return '#FFD700'; // Gold
      case 1:
        return '#C0C0C0'; // Silver
      case 2:
        return '#CD7F32'; // Bronze
      default:
        return 'inherit';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="tw-flex tw-justify-center tw-items-center tw-h-[80vh]">
          <CircularProgress />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Typography color="error" className="tw-text-center tw-mt-8">
          {error}
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="tw-container tw-mx-auto tw-p-8">
        <div className="tw-flex tw-items-center tw-justify-center tw-mb-8 tw-gap-3">
          <EmojiEventsIcon sx={{ fontSize: 40, color: '#FFD700' }} />
          <Typography variant="h4" className="tw-text-center tw-font-bold">
            Leaderboard
          </Typography>
        </div>
        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: colorMode === 'dark' ? '#1e1e1e' : 'white',
            maxWidth: 800,
            margin: 'auto'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: colorMode === 'dark' ? 'white' : 'inherit' }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colorMode === 'dark' ? 'white' : 'inherit' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colorMode === 'dark' ? 'white' : 'inherit' }}>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    backgroundColor: index < 3 ? (colorMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)') : 'inherit'
                  }}
                >
                  <TableCell 
                    sx={{ 
                      color: getRankColor(index),
                      fontWeight: index < 3 ? 'bold' : 'normal'
                    }}
                  >
                    #{index + 1}
                  </TableCell>
                  <TableCell sx={{ color: colorMode === 'dark' ? 'white' : 'inherit' }}>{user.username}</TableCell>
                  <TableCell sx={{ color: colorMode === 'dark' ? 'white' : 'inherit' }}>{user.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
};

export default Leaderboard;