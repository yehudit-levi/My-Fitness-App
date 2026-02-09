import { ReactNode } from "react"
import { selectAuth } from "../redux/auth/auth.selectors"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { PATHS } from "../PATHS"
import React from "react"

type Props = {
    children: ReactNode
}

export default function AuthGuard({ children }: Props) {
    const { isAuthenticated, isInitialized, user } = useSelector(selectAuth);

    if (!isInitialized) {
        return <h1>Loading...</h1>
    }

    if (!isAuthenticated) {
        return <Navigate to={PATHS.login} />
    }

    return (<>{children}</>)
}