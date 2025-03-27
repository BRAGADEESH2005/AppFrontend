import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthSlice } from '../../../store/authslice/auth';
import { useUserSlice } from '../../../store/user';
import Layout from '../../UI/Layout';
import getProblem from '../../../services/getProblem';

import axios from 'axios';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Paper,
  Tabs,
  Tab,
  Divider,
  Chip,
  CircularProgress,
  useTheme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import getUser from '../../../services/getUser';
import signOutAPI from '../../../services/signOut';

// TypeScript interfaces
interface Submission {
  problemId: string;
  languageId: number;
  status: string;
  submissionId: string;
  submittedAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  favoriteProgrammingLanguage: number;
  submissions: Submission[];
  roles: string[];
}

interface ProblemInfo {
  _id?: string;
  title: string;
  difficulty: string;
  [key: string]: any;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

interface ProblemsInfoState {
  [key: string]: ProblemInfo;
}

// Stats component for showing user metrics
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color = 'primary' }) => (
  <Paper
    elevation={1}
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      bgcolor: 'background.paper',
      borderRadius: '8px',
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Box sx={{ color: `${color}.main`, mb: 1 }}>{icon}</Box>
    <Typography variant='h5' color={color} sx={{ fontWeight: 600 }}>
      {value}
    </Typography>
    <Typography variant='body2' color='text.secondary' align='center'>
      {label}
    </Typography>
  </Paper>
);

// Main Profile component
const Profile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const currentUser = useUserSlice((state) => state.user);
  const setUser = useUserSlice((state) => state.setUser);
  const signOut = useAuthSlice((state) => state.signOut);
  const [tabValue, setTabValue] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [problemsInfo, setProblemsInfo] = useState<ProblemsInfoState>({});

  // Logout mutation
  const { mutateAsync: logoutMutate } = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: signOutAPI,
  });

  // Fetch user data
  const { data, isLoading } = useQuery({
    queryKey: ['profile-user', userId],
    queryFn: () => getUser(userId || currentUser?._id),
    enabled: isLogedIn,
  });

  const user = (data?.data?.user as User) || (currentUser as User);

  // Check if viewing own profile
  const isOwnProfile = currentUser?._id === userId;

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutMutate();
      setUser(null);
      signOut();
      navigate('/signin');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Get unique problem IDs from submissions
  const uniqueProblemIds: string[] = user?.submissions
    ? [...new Set(user.submissions.map((sub) => sub.problemId))]
    : [];

  // Get solved problem IDs (where at least one submission was accepted)
  const solvedProblemIds: string[] = user?.submissions
    ? [...new Set(user.submissions.filter((sub) => sub.status === 'Accepted').map((sub) => sub.problemId))]
    : [];

  // Fetch problem details for each unique problem
  useEffect(() => {
    const fetchProblemDetails = async (): Promise<void> => {
      const problemDetails: ProblemsInfoState = {};

      for (const problemId of uniqueProblemIds) {
        try {
          console.log('Problem ID--', problemId);
          const response = await getProblem(problemId?.slice(0, 24) as string);
          console.log('Res from problem--', response.data);
          problemDetails[problemId] = response.data;
        } catch (error) {
          console.error(`Error fetching problem ${problemId}:`, error);
          problemDetails[problemId] = { title: 'Unknown Problem', difficulty: 'unknown' };
        }
      }

      setProblemsInfo(problemDetails);
    };

    if (uniqueProblemIds.length > 0) {
      fetchProblemDetails();
    }
  }, [uniqueProblemIds]);

  // Calculate statistics
  const totalSubmissions: number = user?.submissions?.length || 0;
  const acceptedSubmissions: number = user?.submissions?.filter((s) => s.status === 'Accepted').length || 0;
  const acceptanceRate: number = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;
  const solvedProblems: number = solvedProblemIds.length;

  // Count problems by difficulty
  const problemsByDifficulty: Record<string, number> = solvedProblemIds.reduce(
    (acc: Record<string, number>, problemId) => {
      console.log('Problems Infofor diff--', problemsInfo);
      const difficulty = problemsInfo[problemId]?.difficulty?.toLowerCase() || 'unknown';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    },
    {}
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    // Reset page when changing tabs
    setPage(0);
    setTabValue(newValue);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newValue: number): void => {
    setPage(newValue);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Map language IDs to names
  const getLanguageName = (langId: number): string => {
    switch (langId) {
      case 50:
        return 'C';
      case 54:
        return 'C++';
      case 91:
        return 'Java';
      case 92:
        return 'Python';
      default:
        return `Language (${langId})`;
    }
  };

  // Format date nicely
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string | undefined): 'success' | 'warning' | 'error' | 'default' => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get status color
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Wrong Answer':
        return 'error';
      case 'Time Limit Exceeded':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Layout showFooter={true}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  // Filter submissions based on current tab
  const getSubmissionsForTab = (): Submission[] => {
    if (!user?.submissions) return [];

    let filteredSubmissions = [...user.submissions];

    // Sort by date (newest first)
    filteredSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    console.log('Tab value before filtering:', tabValue);

    if (tabValue === 1) {
      // Only accepted solutions
      filteredSubmissions = filteredSubmissions.filter((s) => {
        console.log(`Submission ${s.submissionId} status:`, s.status);
        return s.status === 'Accepted';
      });
    }

    console.log('Filtered Submissions--', filteredSubmissions);

    // Slice for pagination
    const paginatedSubmissions = filteredSubmissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    console.log('Final submissions to render:', paginatedSubmissions);

    return paginatedSubmissions;
  };

  return (
    <Layout showFooter={true}>
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          p: 3,
          bgcolor: 'background.default',
        }}
      >
        {/* Profile Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 3,
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || <AccountCircleIcon fontSize='large' />}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'center', sm: 'flex-start' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Typography variant='h4' sx={{ mb: 1 }}>
                {user?.username || 'User'}
              </Typography>

              {/* Only show logout button if viewing own profile */}
              {isOwnProfile && (
                <Button variant='outlined' color='error' startIcon={<LogoutIcon />} onClick={handleLogout} size='small'>
                  Logout
                </Button>
              )}
            </Box>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
              {user?.email || 'No email provided'}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                icon={<CodeIcon />}
                label={`Favorite Language: ${getLanguageName(user?.favoriteProgrammingLanguage)}`}
                color='primary'
                variant='outlined'
              />
              <Chip
                icon={<SchoolIcon />}
                label={`${solvedProblems} Problems Solved`}
                color='success'
                variant='outlined'
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Statistics Cards */}
        <Typography variant='h5' sx={{ mb: 3 }}>
          Statistics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <StatCard
              icon={<SchoolIcon fontSize='large' />}
              label='Problems Solved'
              value={solvedProblems}
              color='success'
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              icon={<CodeIcon fontSize='large' />}
              label='Total Submissions'
              value={totalSubmissions}
              color='primary'
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              icon={<CheckCircleIcon fontSize='large' />}
              label='Acceptance Rate'
              value={`${acceptanceRate}%`}
              color={acceptanceRate > 70 ? 'success' : acceptanceRate > 40 ? 'warning' : 'error'}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              icon={<TimerIcon fontSize='large' />}
              label='Latest Activity'
              value={
                user?.submissions?.length
                  ? new Date(user.submissions[user.submissions.length - 1].submittedAt).toLocaleDateString()
                  : 'None'
              }
              color='info'
            />
          </Grid>
        </Grid>

        {/* Difficulty Breakdown */}
        <Typography variant='h6' sx={{ mb: 2 }}>
          Problem Difficulty
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={4}>
            <Paper
              elevation={1}
              sx={{ p: 2, textAlign: 'center', borderLeft: '4px solid', borderColor: 'success.main' }}
            >
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Easy
              </Typography>
              <Typography variant='h5' color='success.main' sx={{ fontWeight: 'bold' }}>
                {problemsByDifficulty.easy || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              elevation={1}
              sx={{ p: 2, textAlign: 'center', borderLeft: '4px solid', borderColor: 'warning.main' }}
            >
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Medium
              </Typography>
              <Typography variant='h5' color='warning.main' sx={{ fontWeight: 'bold' }}>
                {problemsByDifficulty.medium || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', borderLeft: '4px solid', borderColor: 'error.main' }}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Hard
              </Typography>
              <Typography variant='h5' color='error.main' sx={{ fontWeight: 'bold' }}>
                {problemsByDifficulty.hard || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {/* Tab Section */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor='primary'
            indicatorColor='primary'
            aria-label='activity tabs'
          >
            <Tab label='All Submissions' />
            <Tab label='Accepted Solutions' />
          </Tabs>
        </Box>

        {/* Submissions Table */}
        {/* Pagination */}
        <TablePagination
          component='div'
          count={
            tabValue === 0
              ? user?.submissions?.length || 0
              : user?.submissions?.filter((s) => s.status === 'Accepted').length || 0
          }
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
        <TableContainer component={Paper} sx={{ mb: 2 }} key={`submissions-table-${tabValue}`}>
          <Table sx={{ minWidth: 650 }} aria-label='submissions table'>
            <TableHead>
              <TableRow>
                <TableCell>Problem</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getSubmissionsForTab().map((submission) => {
                const problem = problemsInfo[submission.problemId] || {};

                return (
                  <TableRow key={submission.submissionId} hover>
                    <TableCell>
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 500,
                          color: 'primary.main',
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/problems/${submission.problemId}`)}
                      >
                        {problem.title || 'Unknown Problem'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={problem.difficulty || 'Unknown'}
                        size='small'
                        color={getDifficultyColor(problem.difficulty)}
                      />
                    </TableCell>
                    <TableCell>{getLanguageName(submission.languageId)}</TableCell>
                    <TableCell>
                      <Chip
                        label={submission.status}
                        size='small'
                        color={getStatusColor(submission.status)}
                        icon={
                          submission.status === 'Accepted' ? (
                            <CheckCircleIcon fontSize='small' />
                          ) : (
                            <CancelIcon fontSize='small' />
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                  </TableRow>
                );
              })}

              {getSubmissionsForTab().length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align='center' sx={{ py: 3 }}>
                    <Typography variant='body1' color='text.secondary'>
                      {tabValue === 0 ? 'No submissions found.' : 'No accepted solutions yet.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};

export default Profile;
