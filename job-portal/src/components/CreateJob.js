import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function CreateJob() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const editingJob = location.state?.job || null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'full-time'
  });

  useEffect(() => {
    if (editingJob) {
      setFormData(editingJob);
    }
  }, [editingJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingJob) {
        // PUT for update
        await axios.put(`http://localhost:5000/jobs/${editingJob.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Job Updated Successfully!');
      } else {
        // POST for new job
        await axios.post('http://localhost:5000/jobs', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Job Created Successfully!');
      }

      navigate('/jobs/list');
    } catch (err) {
      console.error("Error saving job:", err);
      alert('Something went wrong!');
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 700,
          p: 4,
          borderRadius: 3,
          bgcolor: '#fff',
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
          {editingJob ? 'Edit Job' : 'Create Job'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                fullWidth
                size="small"
              >
                <MenuItem value="full-time">Full-time</MenuItem>
                <MenuItem value="part-time">Part-time</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} textAlign="right">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                {editingJob ? 'Update Job' : 'Create Job'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default CreateJob;
