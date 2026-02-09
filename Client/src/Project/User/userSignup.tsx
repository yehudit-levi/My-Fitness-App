import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { UserType } from '../post.types';
import { addUserApi } from './user.posts';
import { FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, MenuItem, Select, SelectChangeEvent, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Input = styled('input')({
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

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
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
    
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setUserData(prevState => ({
                ...prevState,
                profilePicturePath: files[0].name,
                profilePicture: files[0],
            }));
        }
    };

    const validate = () => {
        let tempErrors = { email: '', password: '', username: '', min: '', profilePicturePath: '' };
        let isValid = true;

        if (!userData.username.trim()) {
            tempErrors.username = 'Username is required';
            isValid = false;
        }

        if (!userData.min.trim()) {
            tempErrors.min = 'Gender is required';
            isValid = false;
        }

        if (!userData.email.trim()) {
            tempErrors.email = 'Email is required';
            isValid = false;
        }

        if (!userData.password.trim()) {
            tempErrors.password = 'Password is required';
            isValid = false;
        }

        if (!userData.profilePicturePath) {
            tempErrors.profilePicturePath = 'Profile picture is required';
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
        } catch (error) {
            console.error('Error adding user:', error);
        } finally {
            setLoading(false); // סיום טעינה
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2} direction="column" alignItems="center">
                <TextField sx={{ m: 1, width: '45ch' }}
                    label="Username"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    error={Boolean(errors.username)}
                    helperText={errors.username}
                    variant="filled"
                    margin="normal"
                />
                
                <FormControl sx={{ m: 1, width: '45ch' }} variant="filled">
                    <InputLabel>Gender</InputLabel>
                    <Select
                        fullWidth
                        label="min"
                        name="min"
                        value={userData.min}
                        onChange={handleGenderChange}
                        error={Boolean(errors.min)}
                    >
                        <MenuItem value="">ללא</MenuItem>
                        <MenuItem value="זכר">זכר</MenuItem>
                        <MenuItem value="נקבה">נקבה</MenuItem>
                        <MenuItem value="אחר">אחר</MenuItem>
                    </Select>
                    {errors.min && (
                        <Box sx={{ color: 'error.main', mt: 1 }}>
                            {errors.min}
                        </Box>
                    )}
                </FormControl>

                <TextField sx={{ m: 1, width: '45ch' }}
                    label="Email"
                    name="email"
                    type="email"
                    variant="filled"
                    value={userData.email}
                    onChange={handleChange}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    margin="normal"
                />

                <FormControl sx={{ m: 1, width: '45ch' }} variant="filled">
                    <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                    <FilledInput
                        id="filled-adornment-password"
                        name="password"
                        required
                        value={userData.password}
                        onChange={handleChange}
                        type={showPassword ? 'text' : 'password'}
                        error={Boolean(errors.password)}
                        endAdornment={
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
                        }
                    />
                    {errors.password && (
                        <Box sx={{ color: 'error.main', mt: 1 }}>
                            {errors.password}
                        </Box>
                    )}
                </FormControl>
                
                <label htmlFor="profilePicture">
                    <Input
                        accept="image/*"
                        id="profilePicture"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <Button variant="contained" component="span">
                        Upload Profile Picture
                    </Button>
                </label>
                {errors.profilePicturePath && (
                    <Box sx={{ color: 'error.main', mt: 1 }}>
                        {errors.profilePicturePath}
                    </Box>
                )}
                <Box sx={{ position: 'relative', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading} // נעילת כפתור בזמן טעינה
                        sx={{ width: '45ch' }}
                    >
                        Submit
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
                <Grid item>
                    <Link href="/login" variant="body2">
                        {"Already have an account? Sign in"}
                    </Link>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserForm;
