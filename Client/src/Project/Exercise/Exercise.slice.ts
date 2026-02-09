import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ExerciseType, MiniExerciseType } from '../post.types'
//import Chocolates from '../Garbage/details'

type ExerciseStateType={
    exercises:MiniExerciseType[]
}
const initialState:ExerciseStateType={exercises:[]}
const exerciseSlice = createSlice({
    name: 'exercises',
    initialState,
    reducers: {
        addExerciseSlice: (state, action: PayloadAction<MiniExerciseType>) => {
            state.exercises.push(action.payload)
        },
        setExerciseSlice:(state, action: PayloadAction<MiniExerciseType[]>)=>{
            state.exercises = action.payload;
        },
        deleteExerciseSlice: (state, action: PayloadAction<number>) => {
            state.exercises = state.exercises.filter(c=> c.id != action.payload);
        },
        updateExerciseSlice:(state, action: PayloadAction<MiniExerciseType[]>)=>{
            state.exercises = action.payload;
        },
    }
})

export const { updateExerciseSlice,addExerciseSlice, deleteExerciseSlice ,setExerciseSlice} = exerciseSlice.actions

export default exerciseSlice.reducer