import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { CoachResponseType, UserType } from '../post.types'

type CurrentTeacherStateType={
    currentTeacher:CoachResponseType|null
}
const initialState:CurrentTeacherStateType={currentTeacher:null
//     id: 0,
//     fullName: '',
//     email: '',
//     password: '',
//     certificationPath: '',
//     profilePicturePath: '',
//     Token: '',
//     certification:'',
//     profilePicture:'',
//    certificationData: {
//     fileContents:''
//    },
//    profilePictureData: {
//     fileContents:''
//    }
}
const currentTeacherSlice = createSlice({
    name: 'currentTeacher',
    initialState,
    reducers: {
        
        setTeacherSlice:(state, action: PayloadAction<CoachResponseType>)=>{
            state.currentTeacher = action.payload;
        } 
        // getUserSlice: (state) => {
        //     return state.user;
        //   }
            
    }
})

export const { setTeacherSlice} = currentTeacherSlice.actions

export default currentTeacherSlice.reducer