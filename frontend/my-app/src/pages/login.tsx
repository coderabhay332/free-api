import { useState } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useLoginMutation } from "../services/api";
import { useDispatch } from 'react-redux';
import { setTokens } from '../store/reducers/authReducer';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
  Paper,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';

const validationSchema = yup.object({
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Minimum 5 characters required")
    .max(16, "Maximum 16 characters allowed"),
});

type FormData = yup.InferType<typeof validationSchema>;

export default function LoginForm() {
  const [loginUser] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const loginResponse = await loginUser(data).unwrap();

      if (!loginResponse?.success || !loginResponse?.data?.accessToken) {
        throw new Error(loginResponse?.message || "Authentication failed");
      }

      const { accessToken, refreshToken } = loginResponse.data;
      dispatch(setTokens({ accessToken, refreshToken }));

      // Redirect based on role
      const redirectPath = loginResponse.data.user.role === 'ADMIN' ? "/admin/dashboard" : "/user/dashboard";
      
      navigate(redirectPath, { replace: true });
      toast.success("Login successful!");
    } catch (error: any) {
      console.error("Login error:", error);
      
      toast.error(
        error?.status === 401
          ? "Invalid email or password"
          : error?.status === 403
          ? "Account not verified or blocked"
          : error?.message || "Login failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#e8f0f8'
    }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 800, 
              color: '#1e4976',
              cursor: 'pointer',
              '&:hover': { color: '#4285f4' },
              transition: 'color 0.3s'
            }}
            onClick={() => navigate("/")}
          >
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container component="main" maxWidth="sm" sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}>
        <Paper elevation={4} sx={{ 
          p: 4, 
          width: '100%',
          borderRadius: 2,
          border: '1px solid #d5e5f6'
        }}>
          <Typography variant="h5" component="h1" fontWeight="bold" color="#1e4976" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please sign in to your account
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={isSubmitting}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isValid || isSubmitting}
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                bgcolor: '#1e4976',
                '&:hover': {
                  bgcolor: '#0d3c6e',
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                }
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{" "}
                <MuiLink 
                  component={NavLink} 
                  to="/signup"
                  sx={{ 
                    color: '#4285f4',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Create one
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

