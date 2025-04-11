import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Stack,
  Chip,
  Grid,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

function JobList() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
        setAppliedJobs(response.data.appliedJobs || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    axios
      .get("http://localhost:5000/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  };

  const handleDeleteClick = (id) => {
    setSelectedJobId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    axios
      .delete(`http://localhost:5000/jobs/${selectedJobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setJobs((prevJobs) =>
          prevJobs.filter((job) => job.id !== selectedJobId)
        );
        setOpenDialog(false);
        setSelectedJobId(null);
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
        setOpenDialog(false);
      });
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setSelectedJobId(null);
  };

  const handleEdit = (rowData) => {
    navigate("/jobs/create", {
      state: {
        job: rowData,
      },
    });
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(
        "http://localhost:5000/jobs/apply",
        {
          user_id: profile.id,
          job_id: jobId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Job applied successfully!");
      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for job.");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Job List
      </Typography>

      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid item key={job.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                position: "relative",
                boxShadow: 3,
                height: "100%",
              }}
            >
              {profile?.role === "admin" && (
                <IconButton
                  onClick={() => handleDeleteClick(job.id)}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ position: "absolute", top: 8, left: 8 }}
              >
                {job.postedAt || "10 days ago"}
              </Typography>

              <CardContent sx={{ p: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight={600}
                  fontSize={14}
                >
                  {job.company}
                </Typography>
                <Typography variant="h6" fontWeight="bold" fontSize={16}>
                  {job.title}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  mt={1}
                  mb={1}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <WorkOutlineIcon fontSize="small" />
                    <Typography variant="body2">
                      {job.salary || "$50,000/year"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2">
                      {job.jobType || "Full-time"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">{job.location}</Typography>
                  </Stack>
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontSize: 13,
                  }}
                >
                  {job.description.slice(0, 100)}{" "}
                  <Tooltip title={job.description} arrow placement="top">
                    <span
                      style={{
                        color: "tomato",
                        cursor: "pointer",
                      }}
                    >
                      read more
                    </span>
                  </Tooltip>
                </Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  mt={2}
                  alignItems="center"
                >
                  {profile?.role === "admin" ? (
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={() => handleEdit(job)}
                    >
                      Edit
                    </Button>
                  ) : appliedJobs.includes(job.id) ? (
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      disabled
                    >
                      Already Applied
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => handleApply(job.id)}
                    >
                      Apply
                    </Button>
                  )}

                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton>
                      <FavoriteBorderIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize={13}
                    >
                      Suggest reward: {job.reward || "500 USD"}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this job? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default JobList;
