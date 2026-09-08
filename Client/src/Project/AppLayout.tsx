import React, { useState, useEffect } from 'react';
import {
    Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Snackbar, Alert,
    Card, CardContent, Chip, Avatar, Toolbar, Stack, Paper, Grid
} from '@mui/material';
import ExerciseForm from './Teacher/coachPersonalZone';
import { styled } from '@mui/system';
import { getAllByCoachIdExerciseApi, getAllExerciseApi } from './Exercise/exercise.posts';
import { ExerciseResponseType, MiniExerciseType } from './post.types';
import { useSelector } from 'react-redux';
import { selectAuth } from './redux/auth/auth.selectors';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

const drawerWidth = 240;

const menuItems = [
    { key: 'home', label: 'בית', icon: <HomeIcon /> },
    { key: 'addExercise', label: 'הוספת תרגיל', icon: <AddCircleIcon /> },
    { key: 'exercises', label: 'כל התרגילים שלי', icon: <ListAltIcon /> },
];

const AppLayout: React.FC = () => {
    const currentUser = useSelector(selectAuth);
    const [currentView, setCurrentView] = useState('home');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [exercises, setExercises] = useState<MiniExerciseType[]>([]);

    const handleMenuClick = (view: string) => {
        setCurrentView(view);
        if (view === 'exercises') {
            fetchExercises();
        }
    };

    const handleExerciseAdded = () => {
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const fetchExercises = async () => {
        const coachId = currentUser.user?.id;
        console.log('fetchExercises start, coach:', currentUser.user);
        if (!coachId) {
            console.warn('No coach id, skipping fetch');
            setExercises([]);
            return;
        }
        try {
            console.log('Request URL ->', `/Exercise/coach/${coachId}?num=0`);
            const fetchedExercises = await getAllByCoachIdExerciseApi(coachId, 0);
            console.log('Fetched exercises:', fetchedExercises);
            setExercises(Array.isArray(fetchedExercises) ? fetchedExercises : []);
        } catch (err: any) {
            console.error('Failed to fetch exercises:', err);
            // extra axios debug
            if (err?.response) {
                console.error('axios response status:', err.response.status, 'data:', err.response.data);
            } else {
                console.error('axios error message:', err?.message || err);
            }
        }
    };

    useEffect(() => {
        if (currentUser.user?.id) {
            fetchExercises();
        }
    }, [currentUser.user?.id]);

    if (currentUser.user && !currentUser.user.isCoach) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                <Paper sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', maxWidth: 480 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        אזור זה מיועד למאמנים בלבד
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        אם ברצונך להצטרף כמאמן/ת, ניתן לשלוח בקשת שדרוג מהאזור האישי שלך.
                    </Typography>
                    <Chip
                        component={RouterLink}
                        to="/coachSignup"
                        label="שדרוג לחשבון מאמן"
                        color="primary"
                        clickable
                    />
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
            <Drawer
                variant="permanent"
                anchor="right"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#11141A',
                        borderLeft: '1px solid rgba(255,255,255,0.06)',
                        borderRight: 'none',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                            <SportsGymnasticsIcon fontSize="small" />
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {currentUser.user?.username || 'האזור האישי שלי'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                אזור מאמנים
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
                <List sx={{ px: 1 }}>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.key}
                            selected={currentView === item.key}
                            onClick={() => handleMenuClick(item.key)}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255,106,0,0.14)',
                                    color: 'primary.main',
                                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
                {currentView === 'home' && (
                    <Paper sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', mt: { xs: 2, md: 6 }, maxWidth: 640, mx: 'auto' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                            <SportsGymnasticsIcon fontSize="large" />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                            ברוכים הבאים לאזור האישי שלכם
                        </Typography>
                        <Typography color="text.secondary">
                            מכאן תוכלו להוסיף תרגילים חדשים ולנהל את כל התרגילים שפרסמתם באתר
                        </Typography>
                    </Paper>
                )}
                {currentView === 'addExercise' && <ExerciseForm onExerciseAdded={handleExerciseAdded} />}
                {currentView === 'exercises' && (
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
                            כל התרגילים שלי
                        </Typography>
                        {exercises.length === 0 ? (
                            <Paper sx={{ textAlign: 'center', py: 6, border: '1px dashed rgba(255,255,255,0.12)' }}>
                                <VideoLibraryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                <Typography color="text.secondary">עדיין לא פרסמתם תרגילים</Typography>
                            </Paper>
                        ) : (
                            <Grid container spacing={2}>
                                {exercises.map(exercise => (
                                    <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography gutterBottom variant="h6" sx={{ fontWeight: 700 }}>
                                                    {exercise.description}
                                                </Typography>
                                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                    <Chip label={exercise.category} size="small" variant="outlined" />
                                                    <Chip label={exercise.difficulty} size="small" color="primary" />
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                )}
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    התרגיל נוסף בהצלחה!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AppLayout;
