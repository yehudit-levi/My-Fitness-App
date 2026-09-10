import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Select, MenuItem,
  FormControl, InputLabel, Container, Chip, Stack, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setCurrentExercise } from './Exercise/currentExercise.slice';
import { ExerciseResponseType, MiniExerciseType } from './post.types';
import { getAllExerciseApi, getExerciseByIdApi } from './Exercise/exercise.posts';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { SelectChangeEvent } from '@mui/material';

const ExerciseCard = styled(Card)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.25s ease',
  '&:hover': {
    transform: 'translateY(-6px)',
  },
});

const ExerciseList: React.FC = () => {
    const dispatch = useDispatch();
    const [exercises, setExercises] = useState<MiniExerciseType[]>([]);
    const [loading, setLoading] = useState(true);
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

    const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
        setCategoryFilter(event.target.value || null);
    };

    const handleGenderFilterChange = (event: SelectChangeEvent<string>) => {
        setGenderFilter(event.target.value || null);
    };

    const handleDifficultyFilterChange = (event: SelectChangeEvent<string>) => {
        setDifficultyFilter(event.target.value || null);
    };

    const clearFilters = () => {
        setCategoryFilter(null);
        setDifficultyFilter(null);
        setGenderFilter(null);
    };

    const hasActiveFilters = !!(categoryFilter || difficultyFilter || genderFilter);

    const filteredExercises = exercises.filter(exercise =>
        (!categoryFilter || exercise.category === categoryFilter) &&
        (!difficultyFilter || exercise.difficulty === difficultyFilter) &&
        (!genderFilter || exercise.min === genderFilter));

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    כל התרגילים
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    סנני לפי קטגוריה, רמת קושי או מגדר ותמצאי בדיוק את מה שמתאים לך
                </Typography>
            </Box>

            {/* סרגל סינון */}
            <Card sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', minWidth: 90 }}>
                        <FilterAltIcon fontSize="small" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>סינון</Typography>
                    </Stack>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel id="category-filter-label">קטגוריה</InputLabel>
                        <Select<string>
                            labelId="category-filter-label"
                            label="קטגוריה"
                            value={categoryFilter || ''}
                            onChange={handleCategoryFilterChange}
                            displayEmpty
                        >
                            <MenuItem value="">הכל</MenuItem>
                            <MenuItem value="Cardio">Cardio</MenuItem>
                            <MenuItem value="Strength">Strength</MenuItem>
                            <MenuItem value="Flexibility">Flexibility</MenuItem>
                            <MenuItem value="Balance">Balance</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel id="difficulty-filter-label">רמת קושי</InputLabel>
                        <Select<string>
                            labelId="difficulty-filter-label"
                            label="רמת קושי"
                            value={difficultyFilter || ''}
                            onChange={handleDifficultyFilterChange}
                            displayEmpty
                        >
                            <MenuItem value="">הכל</MenuItem>
                            <MenuItem value="Easy">Easy</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Hard">Hard</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel id="gender-filter-label">מגדר</InputLabel>
                        <Select<string>
                            labelId="gender-filter-label"
                            label="מגדר"
                            value={genderFilter || ''}
                            onChange={handleGenderFilterChange}
                            displayEmpty
                        >
                            <MenuItem value="">הכל</MenuItem>
                            <MenuItem value="זכר">זכר</MenuItem>
                            <MenuItem value="נקבה">נקבה</MenuItem>
                            <MenuItem value="אחר">אחר</MenuItem>
                        </Select>
                    </FormControl>

                    {hasActiveFilters && (
                        <Button
                            onClick={clearFilters}
                            startIcon={<ClearIcon />}
                            color="secondary"
                            size="small"
                            sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}
                        >
                            נקה סינון
                        </Button>
                    )}
                </Stack>
            </Card>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
                    <CircularProgress color="primary" />
                </Box>
            ) : filteredExercises.length === 0 ? (
                <Box textAlign="center" sx={{ py: 8, color: 'text.secondary' }}>
                    <FitnessCenterIcon sx={{ fontSize: 56, mb: 2, opacity: 0.4 }} />
                    <Typography variant="h6">לא נמצאו תרגילים התואמים לסינון</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredExercises.map(exercise => (
                        <Grid item key={exercise.id} xs={12} sm={6} md={4}>
                            <ExerciseCard>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" sx={{ fontWeight: 700 }}>
                                        {exercise.description}
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                                        <Chip label={exercise.category} size="small" color="secondary" variant="outlined" />
                                        <Chip label={exercise.difficulty} size="small" color="primary" variant="outlined" />
                                    </Stack>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        onClick={() => handleChooseExercise(exercise.id)}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        startIcon={<PlayCircleOutlineIcon />}
                                    >
                                        צפה בתרגיל
                                    </Button>
                                </Box>
                            </ExerciseCard>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default ExerciseList;
