import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ExerciseResponseType } from '../post.types'
import { blob } from 'stream/consumers'

type CurrentExerciseStateType={
    currentExercise:ExerciseResponseType
}
const initialState:CurrentExerciseStateType={currentExercise:{
    id: 0,
    description: '',
    min: '',
    category: '',
    difficulty: '',
    publishDate: '',
    coachId: 0,
    imageOrVideo: '',
    videoUrl: undefined,
    videoData: {
        contentType: '',
        fileContents: '',
        //fileName: 0,
    },
    comments: []
}}
const currentExerciseSlice = createSlice({
    name: 'currentExercise',
    initialState,
    reducers: {
        
        setCurrentExercise:(state, action: PayloadAction<ExerciseResponseType>)=>{
            state.currentExercise = action.payload;
        } 
        // getUserSlice: (state) => {
        //     return state.user;
        //   }
            
    }
})

export const { setCurrentExercise} = currentExerciseSlice.actions

export default currentExerciseSlice.reducer