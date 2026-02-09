import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { UserType } from '../post.types'

type CurrentUserStateType={
    currentUser:string
}
const initialState:CurrentUserStateType={currentUser:""}
const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState,
    reducers: {
        
        setUserSlice:(state, action: PayloadAction<string>)=>{
            state.currentUser = action.payload;
        } 
        // getUserSlice: (state) => {
        //     return state.user;
        //   }
            
    }
})

export const { setUserSlice} = currentUserSlice.actions

export default currentUserSlice.reducer