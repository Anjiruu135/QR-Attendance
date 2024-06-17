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

const userStore = createStore({
  authName:'_user_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

const adminStore = createStore({
  authName: '_admin_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});


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
      <RequireAuth authType='user' fallbackPath={'/'}>
        <NavBar />
        <Dashboard />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/admin",
    element: (
      <RequireAuth authType='admin' fallbackPath={'/'}>
        <AdminNavBar />
        <AdminDashboard />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/students",
    element: (
      <RequireAuth authType='user' fallbackPath={'/'}>
        <NavBar />
        <Students />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/admin_instructors",
    element: (
      <RequireAuth authType='admin' fallbackPath={'/'}>
        <AdminNavBar />
        <AdminInstructors />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/attendance",
    element: (
      <RequireAuth authType='user' fallbackPath={'/'}>
        <NavBar />
        <Attendance />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/admin_attendance",
    element: (
      <RequireAuth authType='admin' fallbackPath={'/'}>
        <AdminNavBar />
        <AdminAttendance />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/scanner",
    element: (
      <RequireAuth authType='user' fallbackPath={'/'}>
        <NavBar />
        <Scanner />
        <Footer />
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
      <AuthProvider store={userStore}>
        <AuthProvider store={adminStore}>
          <div className="App">
            <RouterProvider router={router} />
          </div>
        </AuthProvider>
      </AuthProvider>
    </>
  )
}

export default App
