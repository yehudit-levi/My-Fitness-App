import { Navigate, createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import React from 'react'
import UserLogin from './User/userLogin'
import PersonalZone from './User/personalZone'
import UserForm from './User/userSignup'
import CoachForm from './Teacher/coachSignup'
import CoachLogin from './Teacher/coachLogin'
import AppLayout from './AppLayout'
import Try from './try'
import DisplayExercise from './Exercise/displayExercise'
import Home from './Home'
import PendingCoachesList from './Admin/PendingCoachesList'

export const router = createBrowserRouter([
    {
        path: '',
        element: <Layout />,
        children: [
            {
                path:'',
                element:<Navigate to={'/home'}/>
            },
            {
                path: 'home',
                element: <Home/>
            },
            {
                path: 'signup2',
                element: < UserForm/>
            },
            {
                path: 'login',
                element: <UserLogin />
            },
            {
                path: 'personalZone',
                element: <PersonalZone/>
            },
            {
                path: 'exercise',
                element: <Try/>,

            },
            {
                path: 'coachSignup',
                element: <CoachForm/>,
            },
            {
                path: 'coachPersonalZone',
                element: <AppLayout/>,
            },
            {
                path: 'coachLogin',
                element: <CoachLogin/>,
            },
            {
                path: 'displayExercise',
                element: <DisplayExercise/>,
            },
            {
                path: 'admin/pendingCoaches',
                element: <PendingCoachesList />,
            },
            // {
            //     path: 'product/:id/:name',
            //     element: <Product />,
            //     errorElement: <h1>Error</h1>,
            //     loader: async (options) => {
            //         console.log(options)
            //         // throw new Error("error");
            //         return { name: options.params.name, id: options.params.id, price: 50 }
            //     }
            // },
            {
                path: '*',
                element: <Navigate to='/home' />,
            },
        ]
    },
])
