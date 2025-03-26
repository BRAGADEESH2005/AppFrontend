import { createBrowserRouter } from 'react-router-dom';
import Home from './Pages/Home';
import Problem from './Pages/Problem/Index';
import SignIn from './Pages/SignIn/Index';
import SignUp from './Pages/SignUp/Index';
import Leaderboard from './Pages/Leaderboard/Leaderboard';  // Update import path
import Layout from './Layout';  // Make sure this path is correct
import Profile from './Pages/Profile/Index';  // Update import path

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'problems/:problemname',
        element: <Problem />,
      },
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'leaderboard',
        element: <Leaderboard />,
      },
      {
        path: 'profile/:userId',
        element: <Profile />,
      }
    ],
  },
]);

export default router;
