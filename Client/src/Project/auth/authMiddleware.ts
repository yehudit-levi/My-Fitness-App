import { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getSession, isValidToken, removeSession } from './utils'

// בדיקת הרשאות לפני קריאת שרת
export const authRequestMiddleware = (request: InternalAxiosRequestConfig) => {
    debugger
    if (request.url === '/Login') {
        return request;

    }
    const authUser = getSession()
    if (!authUser || !isValidToken(authUser.token)) {
        removeSession();
        Promise.reject('Unauthorized');
    }
    return request;
};

// -אחרי שחזרה תגובה בדיקת הרשאות אחרי קריאת שרת
export const authResponseMiddleware = (response: AxiosResponse) => {
    if (response.status === 401) {
        removeSession();
        Promise.reject('Unauthorized');
    }
    return response;
};