import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectCurrentExercise } from './currentExercise.selector';
import { CommentType, ExerciseResponseType } from '../post.types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AddCommentIcon from '@mui/icons-material/AddComment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Button, TextField } from '@mui/material';
import { selectAuth } from '../redux/auth/auth.selectors';
import { addCommentApi } from '../Comment/comment.posts';
import { addToFavoritesApi, removeFromFavoritesApi } from './exercise.posts'; // Import the API functions

const DisplayExercise: React.FC = () => {
    const exercise = useSelector(selectCurrentExercise);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFavoriteMessage, setShowFavoriteMessage] = useState(false);
    const currentUser = useSelector(selectAuth);

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleAddComment = async () => {
        if (!currentUser || !exercise.currentExercise)
            return;
        setIsLoading(true);
        const comment: CommentType = {
            id: 0,
            content: newComment,
            commentDate: new Date(),
            userId: currentUser.user.id,
            exerciseId: exercise.currentExercise?.id
        }

        await addCommentApi(comment);

        setIsLoading(false);
        setShowSuccessMessage(true);

        // Clear the comment text field after submission
        setNewComment('');
    };
    

    const handleLike = () => {
        // כאן תוכלי להוסיף לוגיקה להוספת לייק לתרגיל
    };

    const handleFavorite = async () => {
        setIsFavorite(!isFavorite);
        if (!isFavorite) {
            await addToFavoritesApi( currentUser!.user?.id,exercise.currentExercise.id);
        } else {
            await removeFromFavoritesApi( currentUser!.user?.id,exercise.currentExercise.id);
        }
        setShowFavoriteMessage(true);
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={8} lg={6}>
                    <Box display="flex" justifyContent="center">
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item key={exercise.currentExercise.id}>
                                <Paper elevation={3} sx={{ padding: '1rem', maxWidth: 600 }}>
                                    <Box mb={2}>
                                        <video controls width="100%">
                                            <source src={`data:video/mp4;base64,${exercise.currentExercise.videoData.fileContents || ""}`} type="video/mp4" />
                                        </video>
                                    </Box>
                                    <Typography variant="h5" gutterBottom>
                                        {exercise.currentExercise.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Category: {exercise.currentExercise.category}
                                    </Typography>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="comments-panel"
                                            id="comments-panel-header"
                                        >
                                            <Typography>תגובות</Typography>
                                        </AccordionSummary>
                                        {exercise.currentExercise.comments.map((comment, index) => (
                                            <AccordionDetails key={index}>
                                                <Typography>{comment.content}</Typography>
                                            </AccordionDetails>
                                        ))}
                                    </Accordion>
                                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                        <Button variant="contained" startIcon={<AddCommentIcon />} onClick={handleAddComment}>הוסף תגובה</Button>
                                        <IconButton onClick={handleLike} color="primary">
                                            <ThumbUpIcon />
                                        </IconButton>
                                        <IconButton onClick={handleFavorite} color="secondary">
                                            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                    </Box>
                                    <TextField
                                        id="new-comment"
                                        label="הוסף תגובה"
                                        variant="outlined"
                                        fullWidth
                                        value={newComment}
                                        onChange={handleCommentChange}
                                        //mt={2}
                                    />
                                    {/* תצוגת טעינה */}
                                    {isLoading && <Box mt={2} display="flex" justifyContent="center"><CircularProgress /></Box>}
                                    {/* הודעת הצלחה */}
                                    <Snackbar open={showSuccessMessage} autoHideDuration={6000} onClose={() => setShowSuccessMessage(false)}>
                                        <Alert onClose={() => setShowSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
                                            התגובה נוספה בהצלחה!
                                        </Alert>
                                    </Snackbar>
                                    {/* הודעת מועדפים */}
                                    <Snackbar open={showFavoriteMessage} autoHideDuration={6000} onClose={() => setShowFavoriteMessage(false)}>
                                        <Alert onClose={() => setShowFavoriteMessage(false)} severity={isFavorite ? "success" : "info"} sx={{ width: '100%' }}>
                                            {isFavorite ? "התרגיל נוסף למועדפים!" : "התרגיל הוסר מהמועדפים!"}
                                        </Alert>
                                    </Snackbar>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DisplayExercise;
