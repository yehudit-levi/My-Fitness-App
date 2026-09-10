import React, { useState } from 'react';
import {
    Box, Grid, Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
    IconButton, CircularProgress, Snackbar, Alert, Container, Chip, Stack, Divider,
    Avatar, List, ListItem, ListItemAvatar, ListItemText,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { selectCurrentExercise } from './currentExercise.selector';
import { setCurrentExercise } from './currentExercise.slice';
import { CommentType, ExerciseResponseType } from '../post.types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import { Button, TextField } from '@mui/material';
import { selectAuth } from '../redux/auth/auth.selectors';
import { addCommentApi } from '../Comment/comment.posts';
import { addToFavoritesApi, removeFromFavoritesApi, getExerciseByIdApi } from './exercise.posts'; // Import the API functions

// כתובת בסיס לתמונת הפרופיל של משתמש - אותה כתובת שרת כמו ב-axios.ts
const USER_IMAGE_BASE_URL = 'https://localhost:7225/api/User/image';

const DisplayExercise: React.FC = () => {
    const exercise = useSelector(selectCurrentExercise);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFavoriteMessage, setShowFavoriteMessage] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const currentUser = useSelector(selectAuth);
    const isAuthenticated = currentUser.isAuthenticated;

    // בודק שהמשתמש מחובר לפני ביצוע פעולה (לייק / מועדפים / תגובה).
    // משתמש שלא מחובר לא אמור להגיע לכאן בכלל (הכפתורים/השדה מוסתרים לו),
    // אבל זו הגנה נוספת כדי שלעולם לא ננסה לגשת ל-currentUser.user כשהוא null.
    const ensureAuthenticated = () => {
        if (!isAuthenticated || !currentUser.user) {
            setShowLoginMessage(true);
            return false;
        }
        return true;
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleAddComment = async () => {
        if (!ensureAuthenticated()) return;
        if (!exercise.currentExercise || !newComment.trim())
            return;
        setIsLoading(true);
        const comment: CommentType = {
            id: 0,
            content: newComment,
            commentDate: new Date(),
            userId: currentUser.user!.id,
            exerciseId: exercise.currentExercise!.id
        }

        try {
            await addCommentApi(comment);

            // רענון מיידי של רשימת התגובות מהשרת, כדי שהתגובה החדשה תופיע מיד בלי לרענן את הדף
            const refreshedExercise = await getExerciseByIdApi(exercise.currentExercise!.id);
            dispatch(setCurrentExercise(refreshedExercise));

            setShowSuccessMessage(true);
            // Clear the comment text field after submission
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('אירעה שגיאה בהוספת התגובה. נסי שוב.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleLike = () => {
        if (!ensureAuthenticated()) return;
        // כאן תוכלי להוסיף לוגיקה להוספת לייק לתרגיל
        setLiked(!liked);
    };

    const handleFavorite = async () => {
        if (!ensureAuthenticated()) return;
        setIsFavorite(!isFavorite);
        if (!isFavorite) {
            await addToFavoritesApi(currentUser.user!.id, exercise.currentExercise.id);
        } else {
            await removeFromFavoritesApi(currentUser.user!.id, exercise.currentExercise.id);
        }
        setShowFavoriteMessage(true);
    };

    const comments = exercise.currentExercise.comments || [];

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
            <Paper elevation={0} sx={{ overflow: 'hidden' }}>
                <Box sx={{ backgroundColor: '#000' }}>
                    <video controls width="100%" style={{ display: 'block', maxHeight: 480 }}>
                        <source src={exercise.currentExercise.imageOrVideo || ""} type="video/mp4" />
                    </video>
                </Box>

                <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
                        {exercise.currentExercise.description}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                        <Chip label={exercise.currentExercise.category} color="secondary" variant="outlined" />
                        {exercise.currentExercise.difficulty && (
                            <Chip label={exercise.currentExercise.difficulty} color="primary" variant="outlined" />
                        )}
                    </Stack>

                    {!isAuthenticated && (
                        <Paper
                            variant="outlined"
                            sx={{
                                mb: 3, p: 1.5, borderRadius: 3, display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between', flexWrap: 'wrap', gap: 1,
                                backgroundColor: 'rgba(255,106,0,0.06)', borderColor: 'rgba(255,106,0,0.3)',
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                יש להתחבר כדי ללייק, לשמור למועדפים ולהוסיף תגובה
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/login"
                                size="small"
                                variant="contained"
                                color="primary"
                                startIcon={<LoginIcon />}
                            >
                                התחברות
                            </Button>
                        </Paper>
                    )}

                    {/* פס פעולות */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            mb: 3, p: 1, borderRadius: 3,
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <Button
                            onClick={handleLike}
                            startIcon={liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                            color={liked ? 'primary' : 'inherit'}
                            sx={{ color: liked ? undefined : 'text.secondary' }}
                        >
                            אהבתי
                        </Button>
                        <Button
                            onClick={handleFavorite}
                            startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            color={isFavorite ? 'secondary' : 'inherit'}
                            sx={{ color: isFavorite ? undefined : 'text.secondary' }}
                        >
                            {isFavorite ? 'במועדפים' : 'הוסף למועדפים'}
                        </Button>
                    </Stack>

                    {/* תגובות */}
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="comments-panel"
                            id="comments-panel-header"
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <ChatBubbleOutlineIcon fontSize="small" />
                                <Typography sx={{ fontWeight: 700 }}>תגובות ({comments.length})</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            {comments.length === 0 ? (
                                <Typography color="text.secondary" sx={{ py: 1 }}>
                                    אין עדיין תגובות - היי הראשונה/ון להגיב!
                                </Typography>
                            ) : (
                                <List disablePadding>
                                    {comments.map((comment, index) => (
                                        <ListItem key={index} alignItems="flex-start" disableGutters divider={index < comments.length - 1}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={`${USER_IMAGE_BASE_URL}/${comment.userId}`}
                                                    sx={{ width: 36, height: 36 }}
                                                >
                                                    <PersonIcon fontSize="small" />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={comment.content} />
                                        </ListItem>
                                    ))}
                                </List>
                            )}

                            <Divider sx={{ my: 2 }} />

                            {isAuthenticated ? (
                                <>
                                    <Stack direction="row" spacing={1} alignItems="flex-start">
                                        <TextField
                                            id="new-comment"
                                            label="הוסיפו תגובה"
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            value={newComment}
                                            onChange={handleCommentChange}
                                        />
                                        <IconButton
                                            color="primary"
                                            onClick={handleAddComment}
                                            disabled={!newComment.trim() || isLoading}
                                            sx={{ border: '1px solid rgba(255,106,0,0.4)' }}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </Stack>
                                    {isLoading && <Box mt={2} display="flex" justifyContent="center"><CircularProgress size={24} /></Box>}
                                </>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 1.5 }}>
                                    <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                                        יש להתחבר כדי להוסיף תגובה
                                    </Typography>
                                    <Button
                                        component={RouterLink}
                                        to="/login"
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<LoginIcon />}
                                    >
                                        התחברות
                                    </Button>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Paper>

            <Snackbar open={showSuccessMessage} autoHideDuration={6000} onClose={() => setShowSuccessMessage(false)}>
                <Alert onClose={() => setShowSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
                    התגובה נוספה בהצלחה!
                </Alert>
            </Snackbar>
            <Snackbar open={showFavoriteMessage} autoHideDuration={6000} onClose={() => setShowFavoriteMessage(false)}>
                <Alert onClose={() => setShowFavoriteMessage(false)} severity={isFavorite ? "success" : "info"} sx={{ width: '100%' }}>
                    {isFavorite ? "התרגיל נוסף למועדפים!" : "התרגיל הוסר מהמועדפים!"}
                </Alert>
            </Snackbar>
            <Snackbar open={showLoginMessage} autoHideDuration={5000} onClose={() => setShowLoginMessage(false)}>
                <Alert onClose={() => setShowLoginMessage(false)} severity="info" sx={{ width: '100%' }}>
                    יש להתחבר כדי לבצע פעולה זו
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default DisplayExercise;
