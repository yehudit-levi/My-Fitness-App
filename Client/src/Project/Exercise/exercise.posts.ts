import { ExerciseResponseType, ExerciseType, MiniExerciseType} from "../post.types"
import axios from '../axios'

export const getAllExerciseApi = async (): Promise<MiniExerciseType[]> => {
    // לקריאת get & delete אין body
    const response = await axios.get(`/Exercise`)
    const posts = await response.data
    return posts
}
export const getAllByCoachIdExerciseApi = async (coachId: number, num: number): Promise<ExerciseResponseType[]> => {
    const response = await axios.get(`/Exercise/byCoach/${coachId}/${num}`);
    const posts = await response.data
    return posts
};
export const getLastExerciseApi = async (num:number): Promise<ExerciseResponseType[]> => {
    const response = await axios.get(`/Exercise/Last`)
    const posts = await response.data
    return posts
}
export const getExerciseByIdApi = async (id:number): Promise<ExerciseResponseType> => {
    // לקריאת get & delete אין body
    const response = await axios.get(`/Exercise/${id}`)
    const posts = await response.data
    return posts
}
export const getExerciseByCategoryApi = async (id:number,category:string): Promise<ExerciseResponseType[]> => {
    // לקריאת get & delete אין body
    const response = await axios.get(`/Exercise/Category${category}`)
    const posts = await response.data
    return posts
}

export const addExerciseApi = async (newExercise: FormData) => {
     await axios.post(`/Exercise`, newExercise)
    //await response.data
    //return post.id
}
export const addToFavoritesApi = async (userId: number,exerciseId:number) => {
    
    await axios.post(`/Exercise/${exerciseId}/favorite/${userId}`,userId)
   //await response.data
   //return post.id
}
export const removeFromFavoritesApi = async (userId: number,exerciseId:number) => {
    await axios.post(`/Exercise/AddFavorite`,userId)
   //await response.data
   //return post.id
}
export const updateExerciseApi = async (ExerciseToUpdate: ExerciseType, id: number): Promise<ExerciseType> => {
    const response = await axios.put(`/Exercise/${id}`, ExerciseToUpdate)
    const updatedExercise = response.data
    return updatedExercise
}

export const deleteExerciseApi = async (id: string) => {
    await axios.delete(`/Exercise/${id}`)
}
export const addFavoritedUserApi = async (id: string,userId:string) => {
    await axios.put(`/Exercise/${id}`)
}