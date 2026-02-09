import { AuthUserType, UserResponseType, UserType} from "../post.types"
import axios from '../axios'

export const getAllUserApi = async (): Promise<UserType[]> => {
    const response = await axios.get(`/User`)
    const posts = await response.data
    return posts
}

export const addUserApi = async (newUser: FormData): Promise<UserType> => {
    const response = await axios.post(`/User/Post`, newUser)
    const post = await response.data
    return post
}

export const updateUserApi = async (UserToUpdate: UserType, id: number): Promise<UserType> => {
    const response = await axios.put(`/User/${id}`, UserToUpdate)
    const updatedUser = response.data
    return updatedUser
}

export const deleteUserApi = async (id: string) => {
    await axios.delete(`/User/${id}`)
}
export const getUserByIdApi = async (id: number): Promise<UserResponseType> => {
  const response=  await axios.get(`/User/${id}`)
  return response.data
}
export const loginUserApi = async (email: string,password:string): Promise<AuthUserType>  => {
   const response= await axios.post(`/User/logIn/${email}/${password}`)
    return response.data
}
