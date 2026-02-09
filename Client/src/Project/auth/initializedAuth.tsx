import { ReactNode, useEffect } from "react"
import { getSession, isValidToken, setSession } from "./utils"
import { useDispatch } from "react-redux"
import { setInitialized, setUser } from "../redux/auth/auth.slice"
import { AuthUserType } from "../post.types"
import React from "react"

type Props = {
    children: ReactNode
}

export default function InitializedAuth({ children }: Props) {

    const dispatch = useDispatch()

    useEffect(() => {
        const authUser: AuthUserType | null = getSession()
        if (authUser && isValidToken(authUser.token)) {
            dispatch(setUser(authUser.user))// שמירת הנתונים ברידקס
            setSession(authUser)
        }
        dispatch(setInitialized())
    }, [])

    return <>{children}</>
}
