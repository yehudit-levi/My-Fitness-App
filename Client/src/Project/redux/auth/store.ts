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
  storage,
  // חשוב: לא לשמור ב-localStorage מצבים שעלולים להכיל מדיה בבסיס 64 (וידאו/תמונות של תרגילים ומאמנים) -
  // אלו יכולים בקלות לחרוג ממכסת האחסון של הדפדפן (בד"כ כ-5-10MB לאתר), ואז כל כתיבה נוספת ל-localStorage
  // בכל מקום באתר (כולל login) נכשלת עם QuotaExceededError. הנתונים האלה ממילא נטענים מחדש מהשרת בכל טעינת עמוד.
  blacklist: ['teacher', 'currentTeacher', 'currentExercise', 'users', 'auth']
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