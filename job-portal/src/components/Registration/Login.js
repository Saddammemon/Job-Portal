import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  ThemeProvider,
  createTheme,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";

// Theme
const theme = createTheme();

// Styled container with background gradient
const Background = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

// Styled login card
const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  maxWidth: 400,
  width: "100%",
  borderRadius: 20,
  boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
  backgroundColor: "#ffffffdd",
}));

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleLoginClick = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });
      console.log("Role from response:", response);

      const { token, user, role,user_id } = response.data;
      console.log("user", user);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", user_id);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      //  navigate('/dashboard');
      if (role === "admin") {
        navigate("/dashboardAdmin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Background>
        <LoginCard elevation={6}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Login to your account to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Box textAlign="right" mb={1}>
            <Link href="#" underline="hover" variant="body2">
              Forgot password?
            </Link>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 1, py: 1.2, borderRadius: 2 }}
            onClick={handleLoginClick}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Typography variant="body2" sx={{ mt: 3 }}>
            Don’t have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={handleSignupClick}
            >
              Sign Up
            </Link>
          </Typography>
        </LoginCard>
      </Background>
    </ThemeProvider>
  );
}

export default LoginForm;
