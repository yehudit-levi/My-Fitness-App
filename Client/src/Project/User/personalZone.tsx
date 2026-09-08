import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ExerciseResponseType, MiniExerciseType, UserType } from "../post.types";
import { getUserByIdApi, updateUserApi } from "./user.posts";
import { selectUsers } from "./User.selectors";
import { updateUserSlice } from "./user.slice";
import { selectAuth } from "../redux/auth/auth.selectors";
import { setUser } from "../redux/auth/auth.slice";
import { setCurrentExercise } from "../Exercise/currentExercise.slice";
import { getExerciseByIdApi, getFavoriteExercisesApi, removeFromFavoritesApi } from "../Exercise/exercise.posts";
import { getMyCoachRequestApi } from "../Teacher/service.posts";
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import {
    Box, Card, CardActionArea, CardContent, Chip, IconButton, Grid, Container, Paper,
    Stack, TextField, MenuItem, Button, FormControl, InputLabel, Select,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import { getSession } from "../auth/utils";

export default function PersonalZone() {
    const currentUser = useSelector(selectAuth);
    const usersArr = useSelector(selectUsers);
    const authuser=getSession();
    const dispatch = useDispatch();
    const [email, setEmail] = useState<string>(authuser?.user?.email || "");
    const [password, setPassword] = useState<string>(authuser?.user?.password || "");
    const [userFullName, setUserFullName] = useState<string>(authuser?.user?.username || "");
    const [userMin, setMin] = useState<string>(authuser?.user?.min || "");
    const navigate = useNavigate();

    // רשימת התרגילים המועדפים על המשתמש המחובר (מוצגת באקורדיון "רשימת מועדפים" למטה)
    const [favoriteExercises, setFavoriteExercises] = useState<MiniExerciseType[]>([]);
    const [favoritesLoading, setFavoritesLoading] = useState(false);

    // סטטוס בקשת השדרוג ל"מאמן" - קובע האם להציג את כרטיס ההזמנה להצטרפות, הודעת
    // "ממתין לאישור", או קישור לאזור המאמנים (אם המשתמש כבר מאמן).
    const [hasPendingCoachRequest, setHasPendingCoachRequest] = useState(false);

    useEffect(() => {
        const checkCoachRequestStatus = async () => {
            if (!currentUser?.user?.id || currentUser.user.isCoach) return;
            try {
                const mine = await getMyCoachRequestApi(currentUser.user.id);
                setHasPendingCoachRequest(!!mine);
            } catch (error) {
                console.error('Failed to check pending coach request:', error);
            }
        };
        checkCoachRequestStatus();
    }, [currentUser?.user?.id, currentUser?.user?.isCoach]);

    useEffect(() => {
        const loadFavorites = async () => {
            if (!currentUser?.user?.id) return;
            setFavoritesLoading(true);
            try {
                const data = await getFavoriteExercisesApi(currentUser.user.id);
                setFavoriteExercises(data);
            } catch (error) {
                console.error('Failed to load favorite exercises:', error);
            } finally {
                setFavoritesLoading(false);
            }
        };
        loadFavorites();
    }, [currentUser?.user?.id]);

    const handleOpenFavorite = async (id: number) => {
        try {
            const exercise: ExerciseResponseType = await getExerciseByIdApi(id);
            dispatch(setCurrentExercise(exercise));
            navigate('/displayExercise');
        } catch (error) {
            console.error('Failed to fetch exercise by ID:', error);
        }
    };

    const handleRemoveFavorite = async (id: number) => {
        if (!currentUser?.user?.id) return;
        try {
            await removeFromFavoritesApi(currentUser.user.id, id);
            setFavoriteExercises((prev) => prev.filter((ex) => ex.id !== id));
        } catch (error) {
            console.error('Failed to remove favorite exercise:', error);
        }
    };

    const update = async (fullName: string, min: string, email: string, password: string) => {
        try {
            const user: UserType = {
                id: currentUser.user!.id,
                username: fullName,
                min: min,
                email: email,
                password: password,
                profilePicturePath: currentUser.user!.profilePicturePath,
                token: currentUser.user!.token,
                profilePicture: undefined,
            };
            await updateUserApi(user, currentUser.user!.id);
            const index = usersArr.users.findIndex(item => item.id === user.id);
            const res = [...usersArr.users];
            const newUser = await getUserByIdApi(user.id);
            res[index] = newUser;
            dispatch(updateUserSlice([...res]));
            dispatch(setUser(newUser));
        } catch (error) {
            console.error(error);
            alert('Sorry, we encountered a problem. Please try again.');
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
            {/* כרטיס פרופיל */}
            <Paper
                sx={{
                    p: { xs: 3, md: 5 },
                    mb: 3,
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(180deg, rgba(255,106,0,0.06), transparent 60%)',
                }}
            >
                <Avatar
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2, fontSize: '2.5rem' }}
                    src={currentUser?.user?.profilePicturePath || undefined}
                >
                    {/* אם אין תמונה, יוצגו האותיות הראשונות של השם */}
                    {currentUser.user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {currentUser.user?.username}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {currentUser.user?.email}
                </Typography>
            </Paper>

            {/* הזמנה להצטרף כמאמן / סטטוס בקשת שדרוג - מוצג רק דבר אחד בכל פעם, לפי מצב המשתמש */}
            <Paper
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 4,
                    backgroundImage: 'linear-gradient(135deg, rgba(255,106,0,0.10), rgba(23,195,178,0.06))',
                    border: '1px solid rgba(255,106,0,0.25)',
                }}
            >
                {currentUser?.user?.isCoach ? (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            <SportsGymnasticsIcon color="primary" sx={{ fontSize: 36, mt: 0.5 }} />
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    את/ה רשום/ה כמאמן/ת באתר
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 480 }}>
                                    מכאן ניתן לעבור לאזור המאמנים ולנהל את התרגילים שפרסמת.
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            component={RouterLink}
                            to="/coachPersonalZone"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                            לאזור המאמנים
                        </Button>
                    </Stack>
                ) : hasPendingCoachRequest ? (
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <HourglassEmptyIcon color="primary" sx={{ fontSize: 36, mt: 0.5 }} />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                בקשת השדרוג שלך למאמן/ת ממתינה לאישור
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 480 }}>
                                נעדכן אותך במייל לכשתתקבל החלטה.
                            </Typography>
                        </Box>
                    </Stack>
                ) : (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            <GroupsIcon color="primary" sx={{ fontSize: 36, mt: 0.5 }} />
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    יש לך ידע וניסיון בכושר?
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 480 }}>
                                    הצטרפו אלינו כמאמנים - העלו תרגילים, שתפו טיפים ומדריכים, וסייעו למתאמנים
                                    להשיג את המטרות שלהם ולבנות את המוניטין שלכם.
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            component={RouterLink}
                            to="/coachSignup"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                            הצטרפו כמאמנים
                        </Button>
                    </Stack>
                )}
            </Paper>

            {/* אקורדיונים */}
            <Stack spacing={2}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <EditIcon fontSize="small" />
                            <Typography sx={{ fontWeight: 700 }}>עדכון פרופיל</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2} sx={{ maxWidth: 480 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="שם מלא"
                                    value={userFullName}
                                    onChange={(e) => setUserFullName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="user-min-label">מגדר</InputLabel>
                                    <Select
                                        labelId="user-min-label"
                                        label="מגדר"
                                        value={userMin}
                                        onChange={(e) => setMin(e.target.value)}
                                    >
                                        <MenuItem value="נקבה">נקבה</MenuItem>
                                        <MenuItem value="זכר">זכר</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="אימייל"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => update(userFullName, userMin, email, password)}
                                >
                                    שמירת שינויים
                                </Button>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <FavoriteIcon fontSize="small" color="secondary" />
                            <Typography sx={{ fontWeight: 700 }}>רשימת מועדפים ({favoriteExercises.length})</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        {favoritesLoading ? (
                            <Typography color="text.secondary">טוען...</Typography>
                        ) : favoriteExercises.length === 0 ? (
                            <Typography color="text.secondary">
                                עדיין לא סימנת תרגילים כמועדפים. סמני תרגיל בלב כדי שיופיע כאן.
                            </Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {favoriteExercises.map((ex) => (
                                    <Grid item xs={12} sm={6} md={4} key={ex.id}>
                                        <Card sx={{ position: 'relative' }}>
                                            <CardActionArea onClick={() => handleOpenFavorite(ex.id)}>
                                                <CardContent>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, pr: 4 }}>
                                                        {ex.description}
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                        <Chip label={ex.category} size="small" color="secondary" variant="outlined" />
                                                        <Chip label={ex.difficulty} size="small" color="primary" variant="outlined" />
                                                    </Stack>
                                                </CardContent>
                                            </CardActionArea>
                                            <IconButton
                                                aria-label="הסר ממועדפים"
                                                onClick={() => handleRemoveFavorite(ex.id)}
                                                size="small"
                                                sx={{ position: 'absolute', top: 8, left: 8 }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </AccordionDetails>
                </Accordion>
            </Stack>
        </Container>
    );
}
