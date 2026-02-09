import { ReactNode } from "react"
import { selectAuth } from "../redux/auth/auth.selectors"
import { Navigate } from "react-router-dom"
import React from "react"
import { PATHS } from "../PATHS"
import { useAppSelector } from "../redux/auth/store"

type Props = {
    children: ReactNode
}

export default function GuestGuard({ children }: Props) {
    const { isAuthenticated, isInitialized } = useAppSelector(selectAuth);

    if (isAuthenticated) {
        return <Navigate to={PATHS.home} />
    }

    if (!isInitialized) {
        return <h1>Loading...</h1>
    }

    return <>{children}</>
}