import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { CoachResponseType, CoachType } from '../post.types'

type TeacherStateType={
    teachers:CoachResponseType[]
}
const initialState:TeacherStateType={teachers:[]}
const teacherSlice = createSlice({
    name: 'teachers',
    initialState,
    reducers: {
        addTeacherSlice: (state, action: PayloadAction<CoachResponseType>) => {
            state.teachers.push(action.payload)
        },
        setTeachersSlice:(state, action: PayloadAction<CoachResponseType[]>)=>{
            state.teachers = action.payload;
        },
        deleteTeacherSlice: (state, action: PayloadAction<number>) => {
            state.teachers = state.teachers.filter(c=> c.id != action.payload);
        },
        updateTeacherSlice:(state, action: PayloadAction<CoachResponseType[]>)=>{
            state.teachers = action.payload;
        },
        
    }
})

export const { updateTeacherSlice,addTeacherSlice, deleteTeacherSlice ,setTeachersSlice: setTeacherSlice} = teacherSlice.actions

export default teacherSlice.reducer