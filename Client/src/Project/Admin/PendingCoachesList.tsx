import { CoachResponseType } from '../post.types'; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addFinalyTeacherApi, deleteTeacherApi, getAllTeacherRequestsApi, getByIdTeacherRequestApi } from '../Teacher/service.posts';

const PendingCoachesList: React.FC = () => {
    const [requests, setRequests] = useState<CoachResponseType[]>([]);
        const [selectedcoach, setSelectedcoach] = useState<CoachResponseType>();

    const [loading, setLoading] = useState<boolean>(true);

    const fetchRequests = async () => {
        try {
            const response = await getAllTeacherRequestsApi();
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
    

    const handleAction = async (coach: CoachResponseType, action: 'Approve' | 'Reject') => {
    if (action === 'Reject') {
        try {
            await axios.delete(`https://localhost:7225/api/CoachRequest/${coach.id}`);
            alert("הבקשה נדחתה ונמחקה.");
            fetchRequests();
        } catch (error) {
            console.error("Error rejecting coach:", error);
        }
        return;
    }
 if (action === 'Approve'){    
    setLoading(true);
    
    try {
       
       const res= await addFinalyTeacherApi(coach.id);

        alert(`המורה ${coach.fullName , res}  אושר בהצלחה ונוסף למערכת!`);
        
        fetchRequests();
    } catch (error) {
        console.error('Error adding coach from admin panel:', error);
        alert('חלה שגיאה באישור המורה.');
    } finally {
        setLoading(false);
    }
    }
};
    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>טוען בקשות ממתינות...</div>;

    return (
    <div style={{ padding: '40px', direction: 'rtl', fontFamily: 'Segoe UI, Tahoma, Geneva, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ color: '#2c3e50', borderBottom: '3px solid #3498db', paddingBottom: '10px', marginBottom: '30px' }}>
            ניהול בקשות הצטרפות מורים
        </h2>
        
        {requests.length === 0 ? (
            <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '15px', 
                border: '1px dashed #dee2e6',
                marginTop: '50px'
            }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
                <h3 style={{ color: '#2ecc71', marginBottom: '10px' }}>הכול מעודכן!</h3>
                <p style={{ color: '#6c757d', fontSize: '18px' }}>
                    אין כרגע בקשות חדשות הממתינות לאישור. 
                    <br />
                    המערכת מסונכרנת לחלוטין.
                </p>
                <button 
                    onClick={fetchRequests} 
                    style={{ 
                        marginTop: '20px', 
                        padding: '10px 25px', 
                        backgroundColor: '#3498db', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    רענן רשימה
                </button>
            </div>
        ) : (
            <div style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#34495e', color: 'white', textAlign: 'right' }}>
                            <th style={cellStyle}>שם מלא</th>
                            <th style={cellStyle}>אימייל</th>
                            <th style={cellStyle}>תעודה</th>
                            <th style={cellStyle}>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={cellStyle}>{req.fullName}</td>
                                <td style={cellStyle}>{req.email}</td>
                                <td style={cellStyle}>
                                    <button onClick={() => window.open(`data:image;base64,${req.certificationData.fileContents}`)} style={linkBtnStyle}>
                                        📄 צפה בתעודה
                                    </button>
                                </td>
                                <td style={cellStyle}>
                                    <button 
                                        onClick={() => handleAction(req, 'Approve')}
                                        style={{ ...actionBtnStyle, backgroundColor: '#2ecc71' }}
                                    >
                                        אשר
                                    </button>
                                    <button 
                                        onClick={() => handleAction(req, 'Reject')}
                                        style={{ ...actionBtnStyle, backgroundColor: '#e74c3c', marginRight: '10px' }}
                                    >
                                        דחה
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);
};

const cellStyle: React.CSSProperties = { padding: '12px', border: '1px solid #ddd' };
const actionBtnStyle: React.CSSProperties = { color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' };
const linkBtnStyle: React.CSSProperties = { background: 'none', color: 'blue', border: 'none', textDecoration: 'underline', cursor: 'pointer' };

export default PendingCoachesList;