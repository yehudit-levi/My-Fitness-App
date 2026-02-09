import { configureStore, combineReducers } from '@reduxjs/toolkit'
import teachersReducer from '../../Teacher/teacher.slice'
import userReducer from '../../User/user.slice'
import currentUserReducer from '../../User/currentUser.slice'
import exercisesReducer from '../../Exercise/Exercise.slice'
import authReducer from './auth.slice'
import currentTeacherReducer from '../../Teacher/currentTeacher.slice'
import currentExerciseReducer from '../../Exercise/currentExercise.slice'

import { useSelector, TypedUseSelectorHook } from 'react-redux'

// redux-persist imports
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // default to localStorage

const rootReducer = combineReducers({
  teacher: teachersReducer,
  users: userReducer,
  exercises: exercisesReducer,
  currentUser: currentUserReducer,
  auth: authReducer,
  currentTeacher: currentTeacherReducer,
  currentExercise: currentExerciseReducer
})

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        ignoredPaths: ['persistor'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector