import axios from '../axios'
import { PATHS } from '../PATHS';
import { AuthUserType, UserResponseType } from "../post.types";

export const setSession = (userResponse: AuthUserType) => {
    // תיקון שורש: מחרוזת ה-base64 של תמונת הפרופיל (profilePictureData.fileContents) יכולה
    // בקלות להגיע למגה-בייטים בודדים, וזה בדיוק מה שגורם ל-QuotaExceededError בכל התחברות
    // (מכסת localStorage היא בד"כ כ-5-10MB לכל האתר, ביחד). אין סיבה לשמור את זה ב-localStorage:
    // ה-state המלא (כולל התמונה) כבר נשמר ב-Redux (ר' dispatch(setUser(...)) לפני הקריאה לכאן)
    // וזה מה שכל הקומפוננטות בפועל קוראות מהן. ב-localStorage שומרים רק גרסה "קלה" של הסשן,
    // שמספיקה כדי לשחזר את המשתמש אחרי רענון דף (ר' initializedAuth.tsx).
    const lightUserResponse: AuthUserType = {
        ...userResponse,
        user: {
            ...userResponse.user,
            profilePictureData: undefined as any,
        },
    };
    try {
        localStorage.setItem('user', JSON.stringify(lightUserResponse));
    } catch (error) {
        // הגנת-על נוספת: אם עדיין נתקלים במכסה מלאה (למשל שאריות ישנות מלפני התיקון הזה),
        // מנקים את כל המפתחות הישנים של redux-persist ומנסים שוב פעם אחת.
        console.warn('Could not persist session to localStorage (it may be full) - clearing old persisted data and retrying:', error);
        try {
            Object.keys(localStorage)
                .filter((key) => key.startsWith('persist:'))
                .forEach((key) => localStorage.removeItem(key));
            localStorage.setItem('user', JSON.stringify(lightUserResponse));
        } catch (retryError) {
            console.warn('Still could not persist session to localStorage after cleanup:', retryError);
        }
    }
    // תיקון: קודם הוכנס לכאן כל האובייקט (הופך ל-"Bearer [object Object]"), במקום הטוקן עצמו.
    axios.defaults.headers.common.Authorization = `Bearer ${userResponse.token}`;
};

export const getSession = (): AuthUserType | null => {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const parsed = JSON.parse(userData);
            // הגנה מפני סשן ישן/פגום שנשמר לפני התיקון בשרת (למשל עם מפתח "userResponse" ישן
            // במקום "user", או בלי טוקן תקין) - כדי שהניווט לא יישאר תקוע במצב "חצי מחובר"
            // (שבו יש טוקן אבל אין פרטי משתמש, והתמונה/הניווט המורחב לא מוצגים).
            if (parsed && parsed.token && parsed.user && parsed.user.id) {
                return parsed;
            }
            localStorage.removeItem('user');
            return null;
        } catch (error) {
            localStorage.removeItem('user');
            return null;
        }
    }
    return null;
};

export const removeSession = () => {
    localStorage.removeItem('user');
    axios.defaults.headers.common.Authorization = undefined;
    window.location.replace(PATHS.login);
};

// export const setSession = (authUser: UserResponseType) => {
//     localStorage.setItem('user', JSON.stringify(authUser))
//     axios.defaults.headers.common.Authorization = `Bearer ${authUser}`
// }

// export const getSession = (): UserResponseType => {
//     const user: UserResponseType = JSON.parse(localStorage.getItem('user') || 'null')
//     return user
// }


// export const removeSession = () => {
//     localStorage.removeItem('user')
//     axios.defaults.headers.common.Authorization = undefined;
//     window.location.href = PATHS.login;
// }

export function jwtDecode(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join('')
    );

    return JSON.parse(jsonPayload);
}

export const isValidToken = (token: string) => {
    if (!token) {
        return false;
    }

    const decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
};
