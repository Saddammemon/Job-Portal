import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

const drawerWidth = 240;

function Sidebar() {
  const navigate = useNavigate();
  const [openJobs, setOpenJobs] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [profile, setProfile] = useState(null); // Profile data

  // Toggle Jobs collapse
  const handleClick = () => {
    setOpenJobs(!openJobs);
  };

  // Navigate actions
  const handleJobListClick = () => {
    navigate('/jobs/list');
  };

  const handleJobCreateClick = () => {
    navigate('/jobs/create');
  };

  const handlDashboardClick = () => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      navigate("/dashboardAdmin");
    } else {
      navigate("/dashboard");
    }
  };

  const handlProfileClick = () => {
    navigate('/profile');
  };

  // Logout Dialog handlers
  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
    setOpenLogoutDialog(false);
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:5000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
        localStorage.setItem("role", response.data.role); // Store role for dashboard redirect
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Profile section */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar alt={profile?.name || "User"} src="/static/images/avatar/1.jpg" sx={{ width: 60, height: 60, mb: 1 }} />
        <Typography variant="subtitle1">Hello {profile?.name || "User"}</Typography>
      </Box>

      {/* Navigation List */}
      <List>
        <ListItem button key="Dashboard" onClick={handlDashboardClick}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* Jobs menu */}
        <ListItem button onClick={handleClick} key="Jobs">
          <ListItemIcon><WorkIcon /></ListItemIcon>
          <ListItemText primary="Jobs" />
          {openJobs ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openJobs} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 8 }} onClick={handleJobListClick}>
              <ListItemText primary="Job List" />
            </ListItem>

            {/* Show Create Job only if user is admin */}
            {profile?.role === "admin" && (
              <ListItem button sx={{ pl: 8 }} onClick={handleJobCreateClick}>
                <ListItemText primary="Create Job" />
              </ListItem>
            )}
          </List>
        </Collapse>

        {/* Profile */}
        <ListItem button key="Profile" onClick={handlProfileClick}>
          <ListItemIcon><AccountCircleIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>

        {/* Logout */}
        <ListItem button key="Logout" onClick={handleLogoutClick}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 2, textAlign: 'center' }}>
        <Button variant="contained" color="primary">Invite Now</Button>
        <Typography variant="body2" sx={{ mt: 1 }}>Invite Friends</Typography>
        <Typography variant="caption">Multiply your friends and earn referral bonus from us</Typography>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleLogoutCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Logout Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>Cancel</Button>
          <Button onClick={handleLogoutConfirm} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

export default Sidebar;
