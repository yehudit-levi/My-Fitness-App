import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Grid, Typography, CircularProgress, Card, CardContent, CardMedia,
    Container, Button, Stack, Chip, Paper, Avatar,
} from '@mui/material';
import { styled } from '@mui/system';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import Slider from "react-slick";
import { getLastExerciseApi, getExerciseByIdApi } from './Exercise/exercise.posts';
import { ExerciseResponseType } from './post.types';
import { setCurrentExercise } from './Exercise/currentExercise.slice';
import { selectAuth } from './redux/auth/auth.selectors';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ClickableCard = styled(Card)({
    cursor: 'pointer',
    transition: 'transform 0.25s ease',
    '&:hover': { transform: 'translateY(-6px)' },
});

export default function Home() {
    const [exercises, setExercises] = useState<ExerciseResponseType[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(selectAuth);

    const fetchExercises = async () => {
        try {
            const data = await getLastExerciseApi(6); // נניח שאנחנו רוצים לקבל 6 תרגילים
            setExercises(data);
        } catch (error) {
            alert('Failed to fetch exercises:');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    const handleChooseExercise = async (id: number) => {
        try {
            const exercise: ExerciseResponseType = await getExerciseByIdApi(id);
            dispatch(setCurrentExercise(exercise));
            navigate('/displayExercise');
        } catch (error) {
            console.error('Failed to fetch exercise by ID:', error);
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        arrows: false,
    };

    return (
        <Box>
            {/* Hero */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #11141A 0%, #1B0F08 60%, #0D1117 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    pt: { xs: 6, md: 10 },
                    pb: { xs: 6, md: 10 },
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Chip
                                label="הכושר שלך מתחיל כאן"
                                color="secondary"
                                sx={{ mb: 2, fontWeight: 700 }}
                            />
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    lineHeight: 1.15,
                                    fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3.2rem' },
                                }}
                            >
                                ברוכים הבאים ל
                                <Box component="span" sx={{ color: 'primary.main' }}>אתר הספורט</Box>
                                {' '}המוביל בישראל
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: 520 }}>
                                מגוון רחב של תרגילים, טיפים לאימון נכון ומאמרים מקצועיים שיעזרו לכם
                                לשפר את הכושר הגופני שלכם ולהגיע לתוצאות המיטביות.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                {isAuthenticated ? (
                                    <Button
                                        component={RouterLink}
                                        to="/exercise"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        startIcon={<FitnessCenterIcon />}
                                    >
                                        לתרגילים
                                    </Button>
                                ) : (
                                    <Button
                                        component={RouterLink}
                                        to="/signup2"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        startIcon={<HowToRegIcon />}
                                    >
                                        הרשמה בחינם
                                    </Button>
                                )}
                                <Button
                                    component={RouterLink}
                                    to="/coachSignup"
                                    variant="outlined"
                                    color="secondary"
                                    size="large"
                                    startIcon={<GroupsIcon />}
                                    sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                                >
                                    הצטרפו כמאמנים
                                </Button>
                            </Stack>
                            {!isAuthenticated && (
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    variant="text"
                                    color="inherit"
                                    startIcon={<LoginIcon />}
                                    sx={{ mt: 2, color: 'text.secondary' }}
                                >
                                    כבר יש לך חשבון? התחברות
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
                                    '& .slick-dots li button:before': {
                                        color: '#FF6A00',
                                        opacity: 0.5,
                                    },
                                    '& .slick-dots li.slick-active button:before': {
                                        color: '#FF6A00',
                                        opacity: 1,
                                    },
                                }}
                            >
                                <Slider {...sliderSettings}>
                                    <Box key={1}>
                                        <img src={require('./public/Images/sport_1635393782-1024x682.jpg')} alt="sports-1" style={{ width: '100%', height: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
                                    </Box>
                                    <Box key={2}>
                                        <img src={require('./public/Images/lovepik-sports-mens-running-movements-picture_500595968.jpg')} alt="sports-2" style={{ width: '100%', height: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
                                    </Box>
                                    <Box key={3}>
                                        <img src={require('./public/Images/1636360815-1715848678895798.jpeg')} alt="sports-3" style={{ width: '100%', height: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
                                    </Box>
                                </Slider>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* למה כדאי להירשם - מוצג רק למי שלא מחובר */}
            {!isAuthenticated && (
                <Box sx={{ backgroundColor: '#11141A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                                הרשמה בחינם, גישה מלאה לכל התוכן
                            </Typography>
                            <Typography color="text.secondary">
                                חלק מהתכנים באתר פתוחים למשתמשים רשומים בלבד - וההרשמה לוקחת פחות מדקה
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                                        <VideoLibraryIcon />
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 700, mb: 1 }}>גישה לכל התרגילים</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        עיינו וסננו בין כל התרגילים שהמאמנים שלנו פרסמו
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                                        <FavoriteIcon />
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 700, mb: 1 }}>שמירת מועדפים</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        סמנו את התרגילים האהובים עליכם וחזרו אליהם בקלות
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                                        <ChatBubbleOutlineIcon />
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 700, mb: 1 }}>לייקים ותגובות</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        הגיבו על תרגילים ושתפו את החוויה שלכם עם הקהילה
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                component={RouterLink}
                                to="/signup2"
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<HowToRegIcon />}
                            >
                                הרשמה עכשיו
                            </Button>
                        </Box>
                    </Container>
                </Box>
            )}

            {/* התרגילים החדשים ביותר */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        התרגילים החדשים ביותר
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        עדכון שוטף מהמאמנים שלנו
                    </Typography>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {exercises.map((exercise) => (
                            <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                                <ClickableCard onClick={() => handleChooseExercise(exercise.id)}>
                                    <CardMedia
                                        component="video"
                                        controls
                                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                        src={exercise.imageOrVideo || ""}
                                        title={exercise.description}
                                        sx={{ backgroundColor: '#000' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                            {exercise.description}
                                        </Typography>
                                        <Chip label={exercise.category} size="small" color="secondary" variant="outlined" />
                                    </CardContent>
                                </ClickableCard>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
