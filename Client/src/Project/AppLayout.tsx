import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Typography, Snackbar, Alert, Card, CardContent, CardMedia } from '@mui/material';
import ExerciseForm from './Teacher/coachPersonalZone';
import { styled } from '@mui/system';
import { getAllByCoachIdExerciseApi, getAllExerciseApi } from './Exercise/exercise.posts';
import { ExerciseResponseType, MiniExerciseType } from './post.types';
import { Theme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectTeacher } from './Teacher/currentTeacher.selector';


const drawerWidth = 240;

const DrawerBox = styled(Box)({
  width: drawerWidth,
  flexShrink: 0,
});

const DrawerPaper = styled(Box)({
  width: drawerWidth,
});

const ContentBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const AppLayout: React.FC = () => {
        const currentCoach = useSelector(selectTeacher);
    const [open, setOpen] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [exercises, setExercises] = useState<MiniExerciseType[]>([]);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

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
  const coachId = currentCoach.currentTeacher?.id;
  console.log('fetchExercises start, coach:', currentCoach.currentTeacher);
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
    if (currentCoach.currentTeacher?.id) {
        fetchExercises();
    }
}, [currentCoach.currentTeacher?.id]);

    return (
        <Box sx={{ display: 'flex' }}>
            <DrawerBox sx={{ width: drawerWidth, flexShrink: 0 }}>
                <DrawerPaper sx={{ width: drawerWidth }}>
                    <List>
                        <ListItem button onClick={() => handleMenuClick('home')}>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button onClick={() => handleMenuClick('addExercise')}>
                            <ListItemText primary="Add Exercise" />
                        </ListItem>
                        <ListItem button onClick={() => handleMenuClick('exercises')}>
                            <ListItemText primary="All Exercises" />
                        </ListItem>
                    </List>
                </DrawerPaper>
            </DrawerBox>
            <ContentBox>
                {currentView === 'home' && <Typography variant="h4">Welcome to your personal zone</Typography>}
                {currentView === 'addExercise' && <ExerciseForm onExerciseAdded={handleExerciseAdded} />}
                {currentView === 'exercises' && (
                    <div>
                        <Typography variant="h4">All Exercises</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          {exercises.map(exercise => (
    <Card key={exercise.id} sx={{ m: 1, width: 300 }}>
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {exercise.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Category: {exercise.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Difficulty: {exercise.difficulty}
            </Typography>
        </CardContent>
    </Card>
))}
                        </Box>
                    </div>
                )}
            </ContentBox>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Exercise added successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AppLayout;
