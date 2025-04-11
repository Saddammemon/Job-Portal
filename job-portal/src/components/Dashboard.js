import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import axios from "axios";

function Dashboard() {
  const [jobList, setJobList] = useState([]);
  const [profile, setProfile] = useState(null); // should be null or {}
  const [jobsApplied, setJobsApplied] = useState(null); // should be null or {}

  // Fetch jobs
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

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data); // fixed this
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Fetch applyed
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:5000/jobs/applied", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobsApplied(response.data); // fixed this
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Box sx={{ flex: 1, bgcolor: "#f5f5f5", p: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        User Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome, {profile?.name || "Guest"}!
      </Typography>

      {/* Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#fff3cd", height: 150 }}>
            <CardContent>
              <Typography variant="subtitle2">Total Jobs Available</Typography>
              <Typography variant="h6" fontWeight="bold">
                {jobList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#f8d7da", height: 150 }}>
            <CardContent>
              <Typography variant="subtitle2">Total Applied Jobs</Typography>
              <Typography variant="h6" fontWeight="bold">
                {jobsApplied ? jobsApplied.length : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "#d4edda", height: 150 }}>
            <CardContent>
              <Typography variant="subtitle2">Refiral Bonus</Typography>
              <Typography variant="h6" fontWeight="bold">
                3000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Jobs */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Recent Applied Jobs
        </Typography>

        {jobsApplied && jobsApplied.length > 0 ? (
          jobsApplied
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort newest first
            .slice(0, 2) // Take only 2 records
            .map((appliedJob, index) => (
              <Box key={index}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography fontWeight="bold">
                      {appliedJob.Job.title}
                    </Typography>
                    <Typography variant="caption">
                      {appliedJob.Job.company}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography
                      variant="caption"
                      color="primary"
                      fontWeight="bold"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {appliedJob.status}
                    </Typography>
                    <Typography fontSize={12}>
                      {new Date(appliedJob.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                {index !== 1 && <Divider sx={{ mb: 1 }} />}
              </Box>
            ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No applied jobs yet.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Dashboard;
