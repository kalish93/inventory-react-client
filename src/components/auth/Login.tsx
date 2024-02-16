import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/user/userActions';
import { AppDispatch } from '../../app/store';
import { LinearProgress, Card, CardContent, Typography, TextField, Button, Snackbar, Alert, FormControl, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ username?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ username?: boolean; password?: boolean }>({});
  const loading = useSelector((state: any) => state.user.loading);
  const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleLogin = async () => {
    setError({});
    if (!username || !password) {
      setError({
        username: !username ? 'Username is required' : undefined,
        password: !password ? 'Password is required' : undefined,
      });
      return;
    }
  
    try {
      await dispatch(login(username, password));
      showSnackbar('Login successful!', 'success');
    } catch (error) {
      showSnackbar('Invalid username or password','error');
      setError({ username: 'Invalid username or password' });
    }
  };
  
  const handleBlur = (field: 'username' | 'password') => {
    setTouched({ ...touched, [field]: true });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {loading && <LinearProgress />}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                error={!!error.username || (touched.username && !username)}
                onBlur={() => handleBlur('username')}
              />
              {touched.username && !username && <FormHelperText error>Username is required</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={!!error.password || (touched.password && !password)}
                onBlur={() => handleBlur('password')}
              />
              {touched.password && !password && <FormHelperText error>Password is required</FormHelperText>}
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || !username || !password}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity as 'success' | 'error'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginComponent;
