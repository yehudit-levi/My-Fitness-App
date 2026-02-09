import React, { useEffect, useState } from 'react';
import {
    TextField, Button, Box, Grid, FormControl, InputLabel, Select, MenuItem,
    CircularProgress, Typography, Divider, Card, Chip, Dialog, DialogTitle, DialogContent, 
    IconButton, DialogActions, Tooltip
} from '@mui/material';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';
import { addExerciseApi, getAllByCoachIdExerciseApi, updateExerciseApi } from '../Exercise/exercise.posts';
import { ExerciseResponseType, ExerciseType, MiniExerciseType } from '../post.types';
import { selectTeacher } from './currentTeacher.selector';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// עיצובים
const StyledCard = styled(Card)({
    position: 'relative',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': { transform: 'translateY(-8px)' },
});

const ActionButtons = styled(Box)({
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 3,
    display: 'flex',
    gap: '8px',
});

const VideoBackground = styled('video')({
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    objectFit: 'cover', zIndex: 1,
});

const CardOverlay = styled(Box)({
    position: 'absolute',
    bottom: 0, left: 0, width: '100%', height: '60%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
    zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    padding: '16px', color: 'white',
});

const Input = styled('input')({ display: 'none' });

interface ExerciseFormProps {
    onExerciseAdded: () => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onExerciseAdded }) => {
    const currentCoach = useSelector(selectTeacher);
    const coachId = currentCoach.currentTeacher?.id;

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
        <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FitnessCenterIcon fontSize="large" color="primary" />
                    התרגילים שלי
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ borderRadius: 8, px: 3, py: 1, background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)' }}>
                    הוסף תרגיל חדש
                </Button>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={3}>
                {exercises.map((exercise) => (
                    <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                        <StyledCard>
                            <ActionButtons>
                                <Tooltip title="עריכה">
                                    <IconButton size="small" sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#eee' } }} onClick={() => handleOpenEdit(exercise)}>
                                        <EditIcon fontSize="small" color="primary" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="מחיקה">
                                    <IconButton size="small" sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#ffebee' } }} onClick={() => setDeleteId(exercise.id)}>
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
            borderRadius: '8px' // עיצוב אופציונלי
        }}
        src={`data:video/mp4;base64,${exercise.videoData.fileContents}`} 
    >
        הדפדפן שלך אינו תומך בהצגת וידאו.
    </video>
)}                            <CardOverlay>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{exercise.description}</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip label={exercise.category} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                                    <Chip label={exercise.difficulty} size="small" color="primary" />
                                </Box>
                            </CardOverlay>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            {/* מודל הוספה ועריכה */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isEditMode ? 'עריכת תרגיל' : 'יצירת תרגיל חדש'}
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ border: 'none' }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="תיאור התרגיל" value={exerciseData.description} onChange={(e) => setExerciseData({...exerciseData, description: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>קהל יעד</InputLabel>
                                    <Select label="קהל יעד" value={exerciseData.min} onChange={(e) => setExerciseData({...exerciseData, min: e.target.value})} sx={{ borderRadius: 3 }}>
                                        <MenuItem value="זכר">גברים</MenuItem>
                                        <MenuItem value="נקבה">נשים</MenuItem>
                                        <MenuItem value="כולם">כולם</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>רמה</InputLabel>
                                    <Select label="רמה" value={exerciseData.difficulty} onChange={(e) => setExerciseData({...exerciseData, difficulty: e.target.value})} sx={{ borderRadius: 3 }}>
                                        <MenuItem value="Easy">מתחילים</MenuItem>
                                        <MenuItem value="Medium">בינוני</MenuItem>
                                        <MenuItem value="Hard">מתקדם</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {!isEditMode && (
                                <Grid item xs={12}>
                                    <label htmlFor="video-upload">
                                        <Input accept="video/*" id="video-upload" type="file" onChange={(e) => setExerciseData({...exerciseData, videoUrl: e.target.files?.[0]})} />
                                        <Button variant="outlined" component="span" fullWidth startIcon={<CloudUploadIcon />} sx={{ py: 1.5, borderRadius: 3, borderStyle: 'dashed' }}>
                                            {exerciseData.videoUrl ? 'וידאו נבחר!' : 'העלאת וידאו לתרגיל'}
                                        </Button>
                                    </label>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.5, mt: 2, borderRadius: 8, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', fontWeight: 'bold' }}>
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
        </Box>
    );
};

export default ExerciseForm;