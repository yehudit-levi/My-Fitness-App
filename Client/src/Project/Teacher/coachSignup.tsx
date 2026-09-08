import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { addCoachUpgradeRequestApi, getMyCoachRequestApi } from './service.posts';
import { selectAuth } from '../redux/auth/auth.selectors';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { styled } from '@mui/system';

const HiddenInput = styled('input')({
    display: 'none',
});

// טופס שדרוג משתמש קיים ומחובר ל"מאמן": אין כאן יותר שם/מייל/סיסמה משלו - כל אלו כבר
// קיימים למשתמש הרשום, וכל מה שנדרש הוא העלאת תעודת הסמכה. הבקשה נשלחת לאישור מנהל,
// ורק לאחריו הופך המשתמש בפועל למאמן (IsCoach=true) - בלי ליצור חשבון/רשומה כפולה.
const CoachForm: React.FC = () => {
    const currentUser = useSelector(selectAuth);
    const userId = currentUser?.user?.id;

    const [certification, setCertification] = useState<File | null>(null);
    const [certificationName, setCertificationName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            if (!userId) {
                setCheckingStatus(false);
                return;
            }
            try {
                const mine = await getMyCoachRequestApi(userId);
                setHasPendingRequest(!!mine);
            } catch (e) {
                console.error('Failed to check pending coach request:', e);
            } finally {
                setCheckingStatus(false);
            }
        };
        checkStatus();
    }, [userId]);

    const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setCertification(files[0]);
            setCertificationName(files[0].name);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userId) {
            setError('יש להתחבר לפני שליחת בקשת שדרוג למאמן');
            return;
        }
        if (!certification) {
            setError('נא להעלות תעודת הסמכה');
            return;
        }

        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('userId', userId.toString());
        formData.append('certification', certification);

        try {
            await addCoachUpgradeRequestApi(formData);
            setRequestSent(true);
        } catch (error: any) {
            console.error('Error sending coach upgrade request:', error);
            if (error?.response?.status === 409) {
                setError(error.response.data || 'כבר קיימת בקשה או שהמשתמש כבר רשום כמאמן');
            } else if (error?.response?.status === 400 && error?.response?.data) {
                setError(error.response.data);
            } else {
                setError('אירעה שגיאה בשליחת הבקשה. נסי שוב.');
            }
        }

        setLoading(false);
    };

    if (checkingStatus) {
        return (
            <Container component="main" maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    // המשתמש כבר מאמן - אין סיבה להציג לו שוב את טופס ההצטרפות.
    if (currentUser?.user?.isCoach) {
        return (
            <Container component="main" maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
                <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                        <SportsGymnasticsIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
                        את/ה כבר רשום/ה כמאמן/ת!
                    </Typography>
                    <Button component={RouterLink} to="/coachPersonalZone" variant="contained" color="primary" size="large">
                        לאזור המאמנים שלי
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (requestSent || hasPendingRequest) {
        return (
            <Container component="main" maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
                <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                        {requestSent ? <MarkEmailReadIcon fontSize="large" /> : <HourglassEmptyIcon fontSize="large" />}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
                        {requestSent ? 'הבקשה שלך נשלחה בהצלחה!' : 'הבקשה שלך ממתינה לאישור'}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        בקשת השדרוג שלך למאמן/ת הועברה לבדיקת מנהל האתר.
                        לאחר קבלת החלטה תישלח אליך הודעת מייל - אם הבקשה תאושר,
                        האזור האישי שלך יציג באופן מיידי גם את אזור המאמנים.
                    </Typography>
                    <Button component={RouterLink} to="/personalZone" variant="contained" color="primary" size="large">
                        לאיזור האישי
                    </Button>
                </Paper>
            </Container>
        );
    }

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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                        <SportsGymnasticsIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                        שדרוג לחשבון מאמן
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textAlign: 'center' }}>
                        העלו את תעודת ההסמכה שלכם, והבקשה תישלח לאישור מנהל האתר
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                                    <label htmlFor="certification">
                                        <HiddenInput
                                            accept="image/*"
                                            id="certification"
                                            type="file"
                                            onChange={handleCertificationChange}
                                        />
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            startIcon={<WorkspacePremiumIcon />}
                                        >
                                            העלאת תעודת הסמכה
                                        </Button>
                                    </label>
                                    {certificationName && (
                                        <Chip
                                            icon={<CheckCircleIcon />}
                                            label={certificationName}
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    )}
                                </Stack>
                            </Grid>

                            {error && (
                                <Grid item xs={12}>
                                    <Typography color="error" variant="body2">{error}</Typography>
                                </Grid>
                            )}
                        </Grid>

                        <Box sx={{ position: 'relative', mt: 3 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={loading}
                            >
                                שליחת בקשה
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
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CoachForm;
