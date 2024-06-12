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

import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';
import RequireAuth from '@auth-kit/react-router/RequireAuth';

const store = createStore({
  authName:'_auth',
  authType:'cookie',
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
      <RequireAuth fallbackPath={'/'}>
        <NavBar />
        <Dashboard />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/admin",
    element: (
      <>
        <AdminNavBar />
        <AdminDashboard />
        <Footer />
      </>
    ),
  },
  {
    path: "/students",
    element: (
      <RequireAuth fallbackPath={'/'}>
        <NavBar />
        <Students />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/admin_instructors",
    element: (
      <>
        <AdminNavBar />
        <AdminInstructors />
        <Footer />
      </>
    ),
  },
  {
    path: "/attendance",
    element: (
      <RequireAuth fallbackPath={'/'}>
        <NavBar />
        <Attendance />
        <Footer />
      </RequireAuth>
    ),
  },
  {
    path: "/admin_attendance",
    element: (
      <>
        <AdminNavBar />
        <AdminAttendance />
        <Footer />
      </>
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
