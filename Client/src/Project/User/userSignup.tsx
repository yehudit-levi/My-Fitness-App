import React, { useState } from 'react';
import { UserType } from '../post.types';
import { addUserApi } from './user.posts';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel,
    MenuItem, Select, SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/system';

const HiddenInput = styled('input')({
    display: 'none',
});

const UserForm: React.FC = () => {
    const [userData, setUserData] = useState<UserType>({
        id: 0,
        username: '',
        min: '',
        email: '',
        password: '',
        profilePicturePath: '',
        token: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        username: '',
        min: '',
        profilePicturePath: ''
    });
    const [loading, setLoading] = useState(false); // מצב טעינה נוסף
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleGenderChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // מכסת ה-Cloudinary (התוכנית החינמית) מגבילה קבצי תמונה ל-10MB - בודקים מראש בצד הלקוח
    // כדי לתת משוב מיידי במקום לחכות להעלאה שתיכשל בשרת.
    const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    profilePicturePath: 'התמונה גדולה מדי (מקסימום 10MB) - נא לבחור תמונה קטנה יותר',
                }));
                e.target.value = '';
                return;
            }
            setErrors(prevErrors => ({ ...prevErrors, profilePicturePath: '' }));
            setUserData(prevState => ({
                ...prevState,
                profilePicturePath: file.name,
                profilePicture: file,
            }));
        }
    };

    const validate = () => {
        let tempErrors = { email: '', password: '', username: '', min: '', profilePicturePath: '' };
        let isValid = true;

        if (!userData.username.trim()) {
            tempErrors.username = 'נא להזין שם משתמש';
            isValid = false;
        }

        if (!userData.min.trim()) {
            tempErrors.min = 'נא לבחור מגדר';
            isValid = false;
        }

        if (!userData.email.trim()) {
            tempErrors.email = 'נא להזין כתובת אימייל';
            isValid = false;
        }

        if (!userData.password.trim()) {
            tempErrors.password = 'נא להזין סיסמה';
            isValid = false;
        }

        if (!userData.profilePicturePath) {
            tempErrors.profilePicturePath = 'נא להעלות תמונת פרופיל';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // תחילת טעינה

        if (!validate()) {
            setLoading(false); // סיום טעינה במקרה של שגיאה
            return;
        }

        const formData = new FormData();
        formData.append('id', userData.id.toString());
        formData.append('username', userData.username);
        formData.append('min', userData.min);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('profilePicturePath', userData.profilePicturePath);
        formData.append('token', userData.token);
        if (userData.profilePicture) {
            formData.append('profilePicture', userData.profilePicture);
        }

        try {
            const userres = await addUserApi(formData);
            setUserData({
                id: 0,
                username: '',
                min: '',
                email: '',
                password: '',
                profilePicturePath: '',
                token: '',
            });
            navigate('/login');
            console.log(`User created with ID: ${userres.id}`);
        } catch (error: any) {
            console.error('Error adding user:', error);
            if (error?.response?.status === 409) {
                // השרת מחזיר 409 (Conflict) כשכבר קיים משתמש עם כתובת האימייל הזו
                alert(error.response.data || 'כבר קיים משתמש רשום עם כתובת האימייל הזו');
            } else if (error?.response?.status === 400 && error?.response?.data) {
                alert(error.response.data);
            } else {
                alert('אירעה שגיאה בהרשמה. נסי שוב.');
            }
        } finally {
            setLoading(false); // סיום טעינה
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
            <Paper sx={{ p: { xs: 3, md: 5 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                        <PersonAddAltIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                        הרשמת משתמש חדש
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        כמה פרטים קצרים וכבר מתחילים להתאמן
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="שם משתמש"
                                    name="username"
                                    value={userData.username}
                                    onChange={handleChange}
                                    error={Boolean(errors.username)}
                                    helperText={errors.username}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="normal" error={Boolean(errors.min)}>
                                    <InputLabel>מגדר</InputLabel>
                                    <Select
                                        label="מגדר"
                                        name="min"
                                        value={userData.min}
                                        onChange={handleGenderChange}
                                    >
                                        <MenuItem value="">ללא</MenuItem>
                                        <MenuItem value="זכר">זכר</MenuItem>
                                        <MenuItem value="נקבה">נקבה</MenuItem>
                                        <MenuItem value="אחר">אחר</MenuItem>
                                    </Select>
                                    {errors.min && <FormHelperText>{errors.min}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="כתובת אימייל"
                                    name="email"
                                    type="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="סיסמה"
                                    name="password"
                                    required
                                    value={userData.password}
                                    onChange={handleChange}
                                    type={showPassword ? 'text' : 'password'}
                                    error={Boolean(errors.password)}
                                    helperText={errors.password}
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                                    <label htmlFor="profilePicture">
                                        <HiddenInput
                                            accept="image/*"
                                            id="profilePicture"
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            startIcon={<PhotoCameraIcon />}
                                        >
                                            העלאת תמונת פרופיל
                                        </Button>
                                    </label>
                                    {userData.profilePicturePath && (
                                        <Chip
                                            icon={<CheckCircleIcon />}
                                            label={userData.profilePicturePath}
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    )}
                                </Stack>
                                {errors.profilePicturePath && (
                                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                        {errors.profilePicturePath}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>

                        <Box sx={{ position: 'relative', mt: 3 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={loading} // נעילת כפתור בזמן טעינה
                            >
                                הרשמה
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
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Link component={RouterLink} to="/login" variant="body2">
                                {"כבר יש לך חשבון? התחברות"}
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default UserForm;
