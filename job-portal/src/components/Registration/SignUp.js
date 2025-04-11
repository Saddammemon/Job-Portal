import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  Alert,
  Link,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

const Background = styled(Box)(() => ({
  minHeight: '100vh',
  width: '100vw',
  backgroundImage: 'url("/images/job-bg.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const SignupCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  maxWidth: 600,
  width: '100%',
  borderRadius: 20,
  boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
  backgroundColor: '#ffffffdd',
}));

function SignupForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async () => {
    setError('');
    setSuccess('');

    if (!email || !password || !confirmPassword || !role) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/users/register', {
        email,
        password,
        role,
        name,
      });

      setSuccess('Signup successful! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Background>
        <SignupCard elevation={6}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Sign up to find your dream job
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.2, borderRadius: 2 }}
            onClick={handleSignup}
          >
            Signup
          </Button>

          <Typography variant="body2" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link component="button" variant="body2" onClick={() => navigate('/')}>Login</Link>
          </Typography>
        </SignupCard>
      </Background>
    </ThemeProvider>
  );
}

export default SignupForm;
