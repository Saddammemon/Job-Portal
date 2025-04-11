import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import axios from "axios";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const DashboardAdmin = () => {
  const [jobList, setJobList] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jobs");
        setJobList(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

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
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const recentJobs = jobList.slice(-2).reverse();

  return (
    <Box sx={{ flex: 1, bgcolor: "#f5f5f5", p: 5,paddingBottom:"106px" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome, {profile?.name || "Guest"}!
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#fff3cd", height: 150, p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <WorkOutlineIcon sx={{ fontSize: 40, color: "#856404" }} />
              <Box>
                <Typography variant="subtitle2">Total Open Jobs</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {jobList.length}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#f8d7da", height: 150, p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <AssignmentTurnedInIcon sx={{ fontSize: 40, color: "#721c24" }} />
              <Box>
                <Typography variant="subtitle2">Total Jobs Created</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {jobList.length}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#d4edda", height: 150, p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <AssessmentIcon sx={{ fontSize: 40, color: "#155724" }} />
              <Box>
                <Typography variant="subtitle2">Tax Report</Typography>
                <Typography variant="body2" fontWeight={500}>
                  Prepare your yearly Tax Report till <strong>Oct 20</strong>
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Jobs Section */}
      <Typography variant="h6" mb={2}>
        Recent Jobs Created
      </Typography>

      <Grid container spacing={2}>
        {recentJobs.map((job, index) => (
          <Grid item xs={12} md={6} key={job.id || index}>
            <Card sx={{ p: 2, bgcolor: "#ffffff", boxShadow: 3, borderRadius: 2 }}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <BusinessCenterIcon sx={{ color: "#1976d2" }} />
                  <Typography fontWeight="bold">{job.title}</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOnIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" color="primary">
                    {job.type}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AttachMoneyIcon sx={{ color: "green", fontSize: 20 }} />
                    <Typography fontWeight="bold">${job.salary}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardAdmin;
