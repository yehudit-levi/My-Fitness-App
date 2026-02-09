import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { UserResponseType, UserType } from '../post.types'
//import Chocolates from '../Garbage/details'

type UserStateType={
    [x: string]: any
    users:UserResponseType[]
}
const initialState:UserStateType={users:[]}
const userSlice = createSlice({
    name: 'currentUser',
    initialState,
    reducers: {
        addUserSlice: (state, action: PayloadAction<UserResponseType>) => {
            state.users.push(action.payload)
        },
        // setUserSlice:(state, action: PayloadAction<UserType[]>)=>{
        //     state.users = action.payload;
        // },
        deleteUserSlice: (state, action: PayloadAction<number>) => {
            state.users = state.users.filter(c=> c.id != action.payload);
        },
        updateUserSlice:(state, action: PayloadAction<UserResponseType[]>)=>{
            state.users = action.payload;
        },
    }
})

export const { updateUserSlice,addUserSlice, deleteUserSlice } = userSlice.actions

export default userSlice.reducer