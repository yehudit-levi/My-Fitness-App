import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Select, MenuItem, Accordion, AccordionSummary } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setCurrentExercise } from './Exercise/currentExercise.slice';
import { ExerciseResponseType, MiniExerciseType } from './post.types';
import { getAllExerciseApi, getExerciseByIdApi } from './Exercise/exercise.posts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SelectChangeEvent } from '@mui/material';

const ExerciseCard = styled(Card)({
  width: '100%',
  height: 'auto',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const Try: React.FC = () => {
    const dispatch = useDispatch();
    const [exercises, setExercises] = useState<MiniExerciseType[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
    const [genderFilter, setGenderFilter] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchExercises = async () => {
        try {
            const data = await getAllExerciseApi();
            setExercises(data);
        } catch (error) {
            console.error('Failed to fetch exercises:', error);
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

    const handleCategoryFilterChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
  setCategoryFilter(event.target.value);
};

    const handleGenderFilterChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
        setGenderFilter(event.target.value );
    };

    const handleDifficultyFilterChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
        setDifficultyFilter(event.target.value );
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="comments-panel"
                            id="comments-panel-header"
                        >
                            <Typography>סינון</Typography>
                        </AccordionSummary>
                        <Box mb={2}>
                            <Select<string> value={categoryFilter || ''} onChange={handleCategoryFilterChange} displayEmpty>
                                <MenuItem value="">All Categories</MenuItem>
                                <MenuItem value="Cardio">Cardio</MenuItem>
                                <MenuItem value="Strength">Strength</MenuItem>
                                <MenuItem value="Flexibility">Flexibility</MenuItem>
                                <MenuItem value="Balance">Balance</MenuItem>
                                {/* Add more MenuItem components for additional categories */}
                            </Select>
                        </Box>
                        <Box mb={2}>
                            <Select<string> value={difficultyFilter || ''} onChange={handleDifficultyFilterChange} displayEmpty>
                                <MenuItem value="">All Difficulties</MenuItem>
                                <MenuItem value="Easy">Easy</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Hard">Hard</MenuItem>
                                {/* Add more MenuItem components for additional difficulty levels */}
                            </Select>
                        </Box>
                        <Box mb={2}>
                            <Select<string> value={genderFilter || ''} onChange={handleGenderFilterChange} displayEmpty>
                            <MenuItem value="">ללא</MenuItem>
                        <MenuItem value="זכר">זכר</MenuItem>
                        <MenuItem value="נקבה">נקבה</MenuItem>
                        <MenuItem value="אחר">אחר</MenuItem>
                                {/* Add more MenuItem components for additional difficulty levels */}
                            </Select>
                        </Box>
                    </Accordion>
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={2}>
                        {exercises
                            .filter(exercise => (!categoryFilter || exercise.category === categoryFilter) && (!difficultyFilter || exercise.difficulty === difficultyFilter))
                            .map(exercise => (
                                <Grid item key={exercise.id} xs={12}>
                                    <Box mt={2}>
                                        <ExerciseCard>
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
                                            <Button onClick={() => handleChooseExercise(exercise.id)} variant="contained" color="primary">
                                                View Exercise
                                            </Button>
                                        </ExerciseCard>
                                    </Box>
                                </Grid>
                            ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Try;
