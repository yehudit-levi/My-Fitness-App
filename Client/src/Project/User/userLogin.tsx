import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUserApi } from './user.posts';
import { setUser } from '../redux/auth/auth.slice';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
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
    try {
      const result1 = await loginUserApi(data.get('email')!.toString(), data.get('password')!.toString());
      if (result1.token != null) {
        dispatch(setUser(result1.user));
        setSession(result1)
        navigate('/personalZone');
      } else {
        alert(`אימייל או סיסמה שגויים`);
      }
    } catch (error) {
      // השרת מחזיר 401 כשהאימייל/הסיסמה שגויים - axios זורק שגיאה עבור סטטוס כזה,
      // אז תופסים אותה כאן ומציגים הודעה ידידותית במקום לקרוס.
      console.error('Login failed:', error);
      alert('אימייל או סיסמה שגויים');
    } finally {
      setLoading(false); // סיום טעינה
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
            התחברות
          </Typography>
          {errors.error && (
            <Typography variant="body1" color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {errors.error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }} >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="כתובת אימייל"
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
              label="סיסמה"
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
                size="large"
                disabled={loading} // נעילת כפתור בזמן טעינה
                sx={{ mt: 1, mb: 1 }}
              >
                התחברות
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
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
              <Link href="#" variant="body2">
                שכחת סיסמה?
              </Link>
              <Link component={RouterLink} to="/signup2" variant="body2">
                {"אין לך חשבון? הרשמה"}
              </Link>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
