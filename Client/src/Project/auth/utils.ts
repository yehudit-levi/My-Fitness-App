import axios from '../axios'
import { PATHS } from '../PATHS';
import { AuthUserType, UserResponseType } from "../post.types";

export const setSession = (userResponse: AuthUserType) => {
    localStorage.setItem('user', JSON.stringify(userResponse));
    axios.defaults.headers.common.Authorization = `Bearer ${userResponse}`;
};

export const getSession = (): AuthUserType | null => {
    const userData = localStorage.getItem('user');
    if (userData) {
        return JSON.parse(userData);
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
