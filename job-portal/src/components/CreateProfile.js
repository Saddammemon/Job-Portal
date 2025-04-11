import React, { useState, useCallback, useEffect } from 'react';
import {
  TextField,
  Typography,
  Grid,
  Button,
  Box,
  Avatar,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';

function CreateProfile() {
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    bio: '',
    profilePicture: null,
    skills: '',
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/users/profile/basic', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        setProfileData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          bio: data.bio || '',
          profilePicture: null, // profilePicture is handled separately
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
        });

        if (data.profilePicture) {
          setPreview(data.profilePicture); // if backend sends a URL
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setProfileData((prev) => ({
      ...prev,
      profilePicture: file,
    }));
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('phone', profileData.phone);
    formData.append('address', profileData.address);
    formData.append('bio', profileData.bio);
    formData.append('skills', JSON.stringify(profileData.skills.split(',').map((s) => s.trim())));

    if (profileData.profilePicture) {
      formData.append('profilePicture', profileData.profilePicture);
    }

    try {
      const response = await axios.put('http://localhost:5000/users/profile', formData, {
        
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Profile updated successfully!');
      console.log('Updated profile:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f0f2f5',
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          bgcolor: '#fff',
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">
          Personal Information
        </Typography>

        {/* Avatar Section */}
        <Box mt={1} mb={2} display="flex" justifyContent="center" {...getRootProps()}>
          <input {...getInputProps()} />
          <Box
            sx={{
              position: 'relative',
              width: 80,
              height: 80,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #ccc',
              cursor: 'pointer',
            }}
          >
            <Avatar
              src={preview || ''}
              sx={{ width: '100%', height: '100%' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 24,
              }}
            >
              <LockIcon fontSize="small" />
            </Box>
          </Box>
        </Box>

        {/* Form Section */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Skills"
                name="skills"
                value={profileData.skills}
                onChange={handleChange}
                fullWidth
                size="small"
                helperText="e.g., React, Node.js"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Bio"
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                fullWidth
                size="small"
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  sx={{ px: 4 }}
                >
                  Save Profile
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default CreateProfile;
