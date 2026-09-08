import React, { useEffect, useState } from 'react';
import {
    TextField, Button, Box, Grid, FormControl, InputLabel, Select, MenuItem,
    CircularProgress, Typography, Container, Card, Chip, Dialog, DialogTitle, DialogContent,
    IconButton, DialogActions, Tooltip, Paper, Stack
} from '@mui/material';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';
import { addExerciseApi, getAllByCoachIdExerciseApi, updateExerciseApi } from '../Exercise/exercise.posts';
import { ExerciseResponseType, ExerciseType, MiniExerciseType } from '../post.types';
import { selectAuth } from '../redux/auth/auth.selectors';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

// עיצובים
const StyledCard = styled(Card)({
    position: 'relative',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
});

const ActionButtons = styled(Box)({
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 3,
    display: 'flex',
    gap: '8px',
});

const CardOverlay = styled(Box)({
    position: 'absolute',
    bottom: 0, left: 0, width: '100%', height: '60%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
    zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    padding: '16px', color: '#F0F2F5',
});

const Input = styled('input')({ display: 'none' });

interface ExerciseFormProps {
    onExerciseAdded: () => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onExerciseAdded }) => {
    const currentUser = useSelector(selectAuth);
    const coachId = currentUser.user?.id;

    const [open, setOpen] = useState(false);
    const [exercises, setExercises] = useState<ExerciseResponseType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [exerciseData, setExerciseData] = useState<ExerciseType>({
        id: 0, description: '', min: '', category: '', difficulty: '',
        publishDate: '', coachId: coachId || 0, imageOrVideo: '', videoUrl: undefined,
    });

    const fetchCoachExercises = async () => {
        if (!coachId) return;
        try {
            const data = await getAllByCoachIdExerciseApi(coachId, 0);
            setExercises(data || []);
        } catch (error) { console.error('Error fetching exercises:', error); }
    };

    useEffect(() => { fetchCoachExercises(); }, [coachId]);

    const handleOpenAdd = () => {
        setIsEditMode(false);
        setExerciseData({
            id: 0, description: '', min: '', category: '', difficulty: '',
            publishDate: '', coachId: coachId || 0, imageOrVideo: '', videoUrl: undefined,
        });
        setOpen(true);
    };

    const handleOpenEdit = (exercise: ExerciseResponseType) => {
        setIsEditMode(true);
        setExerciseData({
            ...exerciseData,
            id: exercise.id,
            description: exercise.description,
            category: exercise.category,
            difficulty: exercise.difficulty,
            min: exercise.min
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            try {
                // await deleteExerciseApi(deleteId); 
                setExercises(prev => prev.filter(ex => ex.id !== deleteId));
                setDeleteId(null);
            } catch (e) { alert("שגיאה במחיקה"); }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await updateExerciseApi(exerciseData, exerciseData.id);
            } else {
                const formData = new FormData();
                Object.entries(exerciseData).forEach(([key, value]) => {
                    if (value) formData.append(key, value as any);
                });
                await addExerciseApi(formData);
            }
            await fetchCoachExercises();
            onExerciseAdded();
            handleClose();
        } catch (error) {
            alert(isEditMode ? 'שגיאה בעדכון התרגיל' : 'שגיאה בהוספת התרגיל');
        } finally { setLoading(false); }
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4, gap: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main' }}>
                        <FitnessCenterIcon sx={{ color: '#fff' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            התרגילים שלי
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            נהלו כאן את התרגילים שפרסמתם באתר
                        </Typography>
                    </Box>
                </Stack>
                <Button variant="contained" color="primary" size="large" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                    הוסף תרגיל חדש
                </Button>
            </Stack>

            {exercises.length === 0 ? (
                <Paper sx={{ textAlign: 'center', py: 8, px: 3, border: '1px dashed rgba(255,255,255,0.12)' }}>
                    <VideoLibraryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        עדיין לא פרסמת תרגילים
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        לחצו על "הוסף תרגיל חדש" כדי לפרסם את התרגיל הראשון שלכם
                    </Typography>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                        הוסף תרגיל חדש
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {exercises.map((exercise) => (
                        <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                            <StyledCard>
                                <ActionButtons>
                                    <Tooltip title="עריכה">
                                        <IconButton size="small" sx={{ bgcolor: '#161B22', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#1f2733' } }} onClick={() => handleOpenEdit(exercise)}>
                                            <EditIcon fontSize="small" color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="מחיקה">
                                        <IconButton size="small" sx={{ bgcolor: '#161B22', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,92,92,0.15)' } }} onClick={() => setDeleteId(exercise.id)}>
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </ActionButtons>
                                {exercise.videoData?.fileContents && (
                                    <video
                                        key={exercise.id}
                                        controls // מוסיף את כפתור ההפעלה והשליטה
                                        preload="metadata" // טוען רק את המידע הראשוני כדי לא להכביד על הדף
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                        src={`data:video/mp4;base64,${exercise.videoData.fileContents}`}
                                    >
                                        הדפדפן שלך אינו תומך בהצגת וידאו.
                                    </video>
                                )}
                                <CardOverlay>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{exercise.description}</Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Chip label={exercise.category} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#F0F2F5' }} />
                                        <Chip label={exercise.difficulty} size="small" color="primary" />
                                    </Box>
                                </CardOverlay>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* מודל הוספה ועריכה */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isEditMode ? 'עריכת תרגיל' : 'יצירת תרגיל חדש'}
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ borderColor: 'divider' }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="תיאור התרגיל" value={exerciseData.description} onChange={(e) => setExerciseData({ ...exerciseData, description: e.target.value })} variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>קהל יעד</InputLabel>
                                    <Select label="קהל יעד" value={exerciseData.min} onChange={(e) => setExerciseData({ ...exerciseData, min: e.target.value })}>
                                        <MenuItem value="זכר">גברים</MenuItem>
                                        <MenuItem value="נקבה">נשים</MenuItem>
                                        <MenuItem value="כולם">כולם</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>רמה</InputLabel>
                                    <Select label="רמה" value={exerciseData.difficulty} onChange={(e) => setExerciseData({ ...exerciseData, difficulty: e.target.value })}>
                                        <MenuItem value="Easy">מתחילים</MenuItem>
                                        <MenuItem value="Medium">בינוני</MenuItem>
                                        <MenuItem value="Hard">מתקדם</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {!isEditMode && (
                                <Grid item xs={12}>
                                    <label htmlFor="video-upload">
                                        <Input accept="video/*" id="video-upload" type="file" onChange={(e) => setExerciseData({ ...exerciseData, videoUrl: e.target.files?.[0] })} />
                                        <Button variant="outlined" component="span" fullWidth startIcon={<CloudUploadIcon />} sx={{ py: 1.5, borderStyle: 'dashed' }}>
                                            {exerciseData.videoUrl ? 'וידאו נבחר!' : 'העלאת וידאו לתרגיל'}
                                        </Button>
                                    </label>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ py: 1.5, mt: 2 }}>
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'אישור ופרסום'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* דיאלוג אישור מחיקה */}
            <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
                <DialogTitle sx={{ fontWeight: 'bold' }}>אישור מחיקה</DialogTitle>
                <DialogContent><Typography>האם אתה בטוח שברצונך למחוק תרגיל זה?</Typography></DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteId(null)}>ביטול</Button>
                    <Button onClick={confirmDelete} variant="contained" color="error">מחק לצמיתות</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ExerciseForm;
