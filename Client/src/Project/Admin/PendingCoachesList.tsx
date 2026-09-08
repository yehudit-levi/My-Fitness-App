import { CoachRequestResponseType } from '../post.types';
import React, { useEffect, useState } from 'react';
import { approveCoachRequestApi, getAllCoachRequestsApi, rejectCoachRequestApi } from '../Teacher/service.posts';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const PendingCoachesList: React.FC = () => {
    const [requests, setRequests] = useState<CoachRequestResponseType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRequests = async () => {
        try {
            const response = await getAllCoachRequestsApi();
            setRequests(response);
        } catch (error) {
            console.error("שגיאה בטעינת הרשימה", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (request: CoachRequestResponseType, action: 'Approve' | 'Reject') => {
        if (action === 'Reject') {
            try {
                await rejectCoachRequestApi(request.id);
                alert("הבקשה נדחתה ונמחקה.");
                fetchRequests();
            } catch (error) {
                console.error("Error rejecting coach request:", error);
                alert('חלה שגיאה בדחיית הבקשה.');
            }
            return;
        }
        if (action === 'Approve') {
            setLoading(true);
            try {
                await approveCoachRequestApi(request.id);
                alert(`המשתמש ${request.username} אושר בהצלחה כמאמן/ת!`);
                fetchRequests();
            } catch (error) {
                console.error('Error approving coach request:', error);
                alert('חלה שגיאה באישור הבקשה.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12 }}>
                <CircularProgress color="primary" />
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                    טוען בקשות ממתינות...
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    <VerifiedUserIcon />
                </Avatar>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        ניהול בקשות שדרוג למאמן
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        אישור או דחייה של בקשות שדרוג של משתמשים קיימים לחשבון מאמן
                    </Typography>
                </Box>
            </Stack>

            {requests.length === 0 ? (
                <Paper
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 3,
                        border: '1px dashed rgba(255,255,255,0.12)',
                    }}
                >
                    <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        הכול מעודכן!
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        אין כרגע בקשות חדשות הממתינות לאישור. המערכת מסונכרנת לחלוטין.
                    </Typography>
                    <Button variant="contained" color="primary" startIcon={<RefreshIcon />} onClick={fetchRequests}>
                        רענן רשימה
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>שם מלא</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>אימייל</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>תעודה</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>סטטוס</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="center">פעולות</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14 }}>
                                                {(req.username || '?').trim().charAt(0)}
                                            </Avatar>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {req.username}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {req.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<DescriptionIcon />}
                                            onClick={() => window.open(`data:image;base64,${req.certificationData?.fileContents || ""}`)}
                                        >
                                            צפה בתעודה
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            icon={<HourglassEmptyIcon />}
                                            label="ממתין לאישור"
                                            color="warning"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleAction(req, 'Approve')}
                                            >
                                                אשר
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleAction(req, 'Reject')}
                                            >
                                                דחה
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default PendingCoachesList;
