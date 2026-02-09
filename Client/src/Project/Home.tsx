import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, CircularProgress, Card, CardContent, CardMedia } from '@mui/material';
import Slider from "react-slick";
import { getLastExerciseApi } from './Exercise/exercise.posts';
import { ExerciseResponseType } from './post.types';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PersonalZone() {  
    const [exercises, setExercises] = useState<ExerciseResponseType[]>([]);
    const [loading, setLoading] = useState(true);
    const imageUrl = './Images/lovepik-sports-mens-running-movements-picture_500595968.jpg';

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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid container justifyContent="center">
                <Grid item xs={8} md={4}>
                    <Slider {...sliderSettings}>
                        
                            <Box key={1}>
                                <img src={require('./public/Images/sport_1635393782-1024x682.jpg')} alt={`sports-${1}`} style={{ width: '100%', height: 'auto' }} />
                            </Box>
                            <Box key={2}>
                            <img src={require('./public/Images/lovepik-sports-mens-running-movements-picture_500595968.jpg')} alt={`sports-${2}`} style={{ width: '100%', height: 'auto' }} />
                        </Box>
                        <Box key={3}>
                        <img src={require('./public/Images/1636360815-1715848678895798.jpeg')} alt={`sports-${3}`} style={{ width: '100%', height: 'auto' }} />
                    </Box>
                        
                    </Slider>
                    <Box textAlign="center" mb={4} mt={4}>
                        <Typography variant="h5" paragraph>
                            ברוכים הבאים לאתר הספורט המוביל בישראל!
                        </Typography>
                        <Typography variant="h5" paragraph>
                            כאן תוכלו למצוא מגוון רחב של תרגילים, טיפים לאימון נכון, ומאמרים מקצועיים
                        </Typography>
                        <Typography variant="h5" paragraph>
                            שיעזרו לכם לשפר את הכושר הגופני שלכם ולהגיע לתוצאות המיטביות.
                        </Typography>
                        <Typography variant="h5" paragraph style={{ fontWeight: 'bold', fontSize: '2.5rem', color: '#2e7d32', marginBottom: '1rem' }}>
                            התרגילים החדשים ביותר
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
           
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {exercises.map((exercise) => (
                        <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                            <Card>
                                <CardMedia
                                    component="video"
                                    controls
                                    src={`data:video/mp4;base64,${exercise.videoData.fileContents || ""}`}
                                    title={exercise.description}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {exercise.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        קטגוריה: {exercise.category}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
