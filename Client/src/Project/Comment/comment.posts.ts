import { CommentType, ExerciseResponseType, ExerciseType} from "../post.types"
import axios from '../axios'

export const addCommentApi = async (newComment: CommentType) => {
     await axios.post(`/Comment`, newComment)
    //await response.data
    //return post.id
}
