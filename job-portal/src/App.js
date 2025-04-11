import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import JobList from './components/JobList';
import CreateJob from './components/CreateJob';
import CreateProfile from './components/CreateProfile';
import LoginForm from './components/Registration/Login';
import SignupForm from './components/Registration/SignUp';
import DashboardAdmin from './components/DashboardAdmin';

function AppContent() {
  const location = useLocation();
  
  // Hide Sidebar on Login and Signup pages
  const hideSidebar = location.pathname === '/' || location.pathname === '/signup';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {!hideSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboardAdmin" element={<DashboardAdmin/>}/>
        <Route path="/jobs/list" element={<JobList />} />
        <Route path="/jobs/create" element={<CreateJob />} />
        <Route path="/profile" element={<CreateProfile />} />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
