import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
      <>
        <NavBar />
        <Dashboard />
        <Footer />
      </>
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
      <>
        <NavBar />
        <Students />
        <Footer />
      </>
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
      <>
        <NavBar />
        <Attendance />
        <Footer />
      </>
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
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App
