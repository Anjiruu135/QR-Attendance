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
import AdminScanner from './pages/AdminScanner';
import AdminLogs from './pages/AdminLogs';
import Logs from './pages/Logs';
import AdminUserManagement from './pages/AdminUserManagement';

import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';

import { Navigate } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const store = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

const RequireAuth = ({ children, allowedUserTypes, fallbackPath }) => {
  const auth = useAuthUser();
  if (allowedUserTypes.includes(auth?.user_type)) {
    return children;
  } else {
    return <Navigate to={fallbackPath} />;
  }
};

const RequireSecondAuth = ({ children, allowedUserRoles, fallbackPath }) => {
  const auth = useAuthUser();
  if (allowedUserRoles.includes(auth?.role)) {
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
      <RequireAuth allowedUserTypes={['user']} fallbackPath={'/'}>
        <NavBar />
        <Dashboard />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/students",
    element: (
      <RequireAuth allowedUserTypes={['user']} fallbackPath={'/'}>
        <NavBar />
        <Students />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/attendance",
    element: (
      <RequireAuth allowedUserTypes={['user']} fallbackPath={'/'}>
        <NavBar />
        <Attendance />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/scanner",
    element: (
      <RequireAuth allowedUserTypes={['user']} fallbackPath={'/'}>
        <NavBar />
        <Scanner />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/logs",
    element: (
      <RequireAuth allowedUserTypes={['user']} fallbackPath={'/'}>
        <NavBar />
        <Logs />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/logs",
    element: (
      <RequireAuth allowedUserTypes={['admin']} fallbackPath={'/'}>
        <AdminNavBar />
        <AdminLogs />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/home",
    element: (
      <RequireAuth allowedUserTypes={['admin']} fallbackPath={'/'}>
        <AdminNavBar />
        <AdminDashboard />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/instructors",
    element: (
      <RequireAuth allowedUserTypes={['admin']} fallbackPath={'/'}>
        <RequireSecondAuth allowedUserRoles={['SuperAdmin', 'Admin', 'Encoder']} fallbackPath={'/'}>
          <AdminNavBar />
          <AdminInstructors />
          <Footer />
        </RequireSecondAuth>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/attendance",
    element: (
      <RequireAuth allowedUserTypes={['admin']} fallbackPath={'/'}>
        <RequireSecondAuth allowedUserRoles={['SuperAdmin', 'Admin']} fallbackPath={'/'}>
          <AdminNavBar />
          <AdminAttendance />
          <Footer />  
        </RequireSecondAuth>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/scanner",
    element: (
      <RequireAuth allowedUserTypes={['admin']} fallbackPath={'/'}>
        <RequireSecondAuth allowedUserRoles={['SuperAdmin', 'Scanner']} fallbackPath={'/'}>
          <AdminNavBar />
          <AdminScanner />
          <Footer />
        </RequireSecondAuth>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/usermanagement",
    element: (
      <RequireAuth allowedUserTypes={['admin']} fallbackPath={'/'}>
        <RequireSecondAuth allowedUserRoles={['SuperAdmin']} fallbackPath={'/'}>
          <AdminNavBar />
          <AdminUserManagement />
          <Footer />
        </RequireSecondAuth>
      </RequireAuth>
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
