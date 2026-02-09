import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUserApi } from './user.posts';
import { setUser } from '../redux/auth/auth.slice';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { setSession } from '../auth/utils';
import { UserResponseType } from '../post.types';

export default function SignIn() {
  const [errors, setErrors] = React.useState({
    error: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false); // מצב טעינה נוסף

  const validate = (data: FormData) => {
    console.log('validate');
    let isValidData = true;
    const temp = { ...errors };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test((data.get('email') || "").toString());
    setErrors(temp);
    return isValidData;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();
    setLoading(true); // תחילת טעינה
    const data = new FormData(event.currentTarget);       
    const result1 = await loginUserApi(data.get('email')!.toString(), data.get('password')!.toString());
    //const result2 = await loginUserApi(data.get('email')!.toString(), data.get('password')!.toString());
    //console.log(result1.token)
    if (result1.token != null) {              
      dispatch(setUser(result1.user));
       setSession(result1)
      navigate('/personalZone');
    } else {
      alert(`משתמש לא קיים`);
    }
    setLoading(false); // סיום טעינה
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {errors.error && (
          <Typography variant="body1" color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {errors.error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
          />

          <Box sx={{ position: 'relative', mt: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading} // נעילת כפתור בזמן טעינה
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup2" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
