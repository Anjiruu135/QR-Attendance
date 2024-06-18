import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import NotFound from './pages/NotFound'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import AdminDashboard from './pages/AdminDashboard';
import AdminNavBar from './components/AdminNavBar';
import AdminInstructors from './pages/AdminInstructors';
import AdminAttendance from './pages/AdminAttendance';
import Scanner from './pages/Scanner';

import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';
import RequireAuth from '@auth-kit/react-router/RequireAuth';

import { Navigate } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const store = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

const RequireAdminAuth = ({ children, fallbackPath }) => {
  const auth = useAuthUser();
  if (auth?.role === 'admin') {
    return children;
  } else {
    return <Navigate to={fallbackPath} />;
  }
};

const RequireUserAuth = ({ children, fallbackPath }) => {
  const auth = useAuthUser();
  if (auth?.role === 'user') {
    return children;
  } else {
    return <Navigate to={fallbackPath} />;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/home",
    element: (
      <RequireUserAuth fallbackPath={'/'}>
        <NavBar />
        <Dashboard />
        <Footer />
      </RequireUserAuth>
    ),
  },
  {
    path: "/admin/home",
    element: (
      <RequireAdminAuth fallbackPath={'/'}>
        <AdminNavBar />
        <AdminDashboard />
        <Footer />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/students",
    element: (
      <RequireUserAuth fallbackPath={'/'}>
        <NavBar />
        <Students />
        <Footer />
      </RequireUserAuth>
    ),
  },
  {
    path: "/admin/instructors",
    element: (
      <RequireAdminAuth fallbackPath={'/'}>
        <AdminNavBar />
        <AdminInstructors />
        <Footer />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/attendance",
    element: (
      <RequireUserAuth fallbackPath={'/'}>
        <NavBar />
        <Attendance />
        <Footer />
      </RequireUserAuth>
    ),
  },
  {
    path: "/admin/attendance",
    element: (
      <RequireAdminAuth fallbackPath={'/'}>
        <AdminNavBar />
        <AdminAttendance />
        <Footer />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/scanner",
    element: (
      <RequireUserAuth fallbackPath={'/'}>
        <NavBar />
        <Scanner />
        <Footer />
      </RequireUserAuth>
    ),
  },
  {
    path: "*",
    element: (
      <>
        <NotFound />
      </>
    ),
  },
]);

function App() {

  return (
    <>
      <AuthProvider store={store}>
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </>
  )
}

export default App
