import { CoachRequestResponseType, MyCoachRequestType } from "../post.types"
import axios from '../axios'

// רשימת כל בקשות השדרוג הממתינות (עמוד ניהול - PendingCoachesList), כולל פרטי המשתמש המבקש.
export const getAllCoachRequestsApi = async (): Promise<CoachRequestResponseType[]> => {
    const response = await axios.get(`/CoachRequest`)
    const posts = await response.data
    return posts
}

// בדיקה האם למשתמש נתון יש כרגע בקשת שדרוג ממתינה - מחזיר null אם אין (404).
export const getMyCoachRequestApi = async (userId: number): Promise<MyCoachRequestType | null> => {
    try {
        const response = await axios.get(`/CoachRequest/mine/${userId}`)
        return response.data
    } catch (error: any) {
        if (error?.response?.status === 404) return null
        throw error
    }
}

// שליחת בקשת שדרוג למאמן עבור משתמש קיים ומחובר (userId + תעודת הסמכה בתוך ה-FormData).
export const addCoachUpgradeRequestApi = async (formData: FormData): Promise<number> => {
    const response = await axios.post(`/CoachRequest`, formData)
    const post = await response.data
    return post
}

// אישור בקשת שדרוג ע"י המנהל - הופך את המשתמש למאמן.
export const approveCoachRequestApi = async (id: number): Promise<void> => {
    await axios.post(`/CoachRequest/approve/${id}`)
}

// דחיית בקשת שדרוג ע"י המנהל.
export const rejectCoachRequestApi = async (id: number) => {
    await axios.delete(`/CoachRequest/${id}`)
}
