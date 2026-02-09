import React, { useState } from 'react';
import {
    TextField, Button, Box, FormControl, Grid, IconButton,
    InputAdornment, InputLabel, Link, FilledInput, CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTeacherApi } from './service.posts';
import { CoachType } from '../post.types';
import { setInitialized } from '../auth/auth.slice';

const Input = styled('input')({
    display: 'none',
});

const CoachForm: React.FC = () => {
    const [coachData, setCoachData] = useState<CoachType>({
        id: 0,
        fullName: '',
        email: '',
        password: '',
        certificationPath: '',
        profilePicturePath: '',
        token: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCoachData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // פונקציה נפרדת לטיפול בתעודת הסמכה
    const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setCoachData(prevState => ({
                ...prevState,
                certificationPath: files[0].name,
                certification: files[0],
            }));
        }
    };

    // פונקציה נפרדת לטיפול בתמונת פרופיל
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setCoachData(prevState => ({
                ...prevState,
                profilePicturePath: files[0].name,
                profilePicture: files[0],
            }));
        }
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const validate = () => {
        let tempErrors = { email: '', password: '' };
        let isValid = true;

        if (!coachData.email) {
            tempErrors.email = 'Email is required';
            isValid = false;
        }

        if (!coachData.password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('id', coachData.id.toString());
        formData.append('fullName', coachData.fullName);
        formData.append('email', coachData.email);
        formData.append('password', coachData.password);
        formData.append('certificationPath', coachData?.certificationPath || '');
        formData.append('profilePicturePath', coachData?.profilePicturePath || '');
        formData.append('token', coachData.token);
        
        if (coachData.certification) {
            formData.append('certification', coachData.certification);
        }
        if (coachData.profilePicture) {
            formData.append('profilePicture', coachData.profilePicture);
        }

        try {
            const userres = await addTeacherApi(formData);
            setCoachData({
                id: 0,
                fullName: '',
                email: '',
                password: '',
                certificationPath: '',
                profilePicturePath: '',
                token: '',
            });
            dispatch(setInitialized());
            navigate('/coachPersonalZone');
            console.log(`Teacher created with ID: ${userres}`);
        } catch (error) {
            console.error('Error adding coach:', error);
        }

        setLoading(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2} direction="column" alignItems="center">
                <TextField
                    sx={{ m: 1, width: '45ch' }}
                    label="Full Name"
                    name="fullName"
                    value={coachData.fullName}
                    onChange={handleChange}
                    variant="filled"
                    margin="normal"
                />
                <TextField
                    sx={{ m: 1, width: '45ch' }}
                    label="Email"
                    name="email"
                    type="email"
                    variant="filled"
                    value={coachData.email}
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
                        value={coachData.password}
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

                {/* העלאת תעודת הסמכה */}
                <label htmlFor="certification">
                    <Input
                        accept="image/*"
                        id="certification"
                        type="file"
                        onChange={handleCertificationChange}
                    />
                    <Button variant="contained" component="span">
                        Upload Certification
                    </Button>
                </label>
                {coachData.certificationPath && <p>{coachData.certificationPath}</p>}

                <p></p>

                {/* העלאת תמונת פרופיל */}
                <label htmlFor="profilePicture">
                    <Input
                        accept="image/*"
                        id="profilePicture"
                        type="file"
                        onChange={handleProfilePictureChange}
                    />
                    <Button variant="contained" component="span">
                        Upload Profile Picture
                    </Button>
                </label>
                {coachData.profilePicturePath && <p>{coachData.profilePicturePath}</p>}

                <Box sx={{ position: 'relative', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
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
                    <Link href="/coachLogin" variant="body2">
                        {"Already have an account? Click here"}
                    </Link>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CoachForm;