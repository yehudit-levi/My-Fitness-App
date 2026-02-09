import {CoachResponseType, CoachType} from "../post.types"
import axios from '../axios'

export const getAllTeacherApi = async (): Promise<CoachResponseType[]> => {
    // לקריאת get & delete אין body
    const response = await axios.get(`/Coach`)
    const posts = await response.data
    return posts
}
export const getAllTeacherRequestsApi = async (): Promise<CoachResponseType[]> => {
    // לקריאת get & delete אין body
    const response = await axios.get(`/CoachRequest`)
    const posts = await response.data
    return posts
}
export const getByIdTeacherApi = async (id: number): Promise<CoachResponseType[]> => {
    // לקריאת get & delete אין body
    const response = await axios.get(`/Coach/${id}`)
    const posts = await response.data
    return posts
}
export const getByIdTeacherRequestApi = async (id: number): Promise<CoachResponseType> => {
    // לקריאת get & delete אין body
    const response = await axios.get(`/CoachRequest/${id}`)
    const posts = await response.data
    return posts
}

export const addTeacherApi = async (newTeacher: FormData): Promise<number> => {
    const response = await axios.post(`/CoachRequest`, newTeacher)
    const post = await response.data
    return post.id
}
export const addFinalyTeacherApi = async (id: number): Promise<number> => {
    const response = await axios.post(`/Coach/AdminPost/${id}`)
    const post = await response.data
    return post.id
}

export const updateTeacherApi = async (teacherToUpdate: CoachType): Promise<CoachType> => {
    const response = await axios.put(`/Coach/${teacherToUpdate.id}`, teacherToUpdate)
    const updatedteacher = response.data
    return updatedteacher
}

export const deleteTeacherApi = async (id: number) => {
    await axios.delete(`/CoachRequest/${id}`)
}
export const loginCoachApi = async (email: string,password:string): Promise<any>  => {
    const response= await axios.post(`/Coach/coacLogIn/${email}/${password}`)
     return response
 }
 