import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserResponseType, UserType } from "../post.types";

type AuthStateType = {
    user: UserResponseType | null,
    isAuthenticated: boolean,
    isInitialized: boolean

}

const initialState: AuthStateType = {
    user: null,
    isAuthenticated: false,
    isInitialized: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state: AuthStateType, action: PayloadAction<UserResponseType>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isInitialized = false;
        },
        setInitialized: (state: AuthStateType) => {
            state.isInitialized = true
        }
    }
})

export const { setUser, setInitialized } = authSlice.actions

export default authSlice.reducer