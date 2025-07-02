import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersSlice'
import loadersReducer from './loadersSlice'
import { api } from '@/state/api'


const store = configureStore({
  reducer: {
    users: usersReducer,
    loaders: loadersReducer,
    [api.reducerPath]: api.reducer,  // ajoute reducer RTK Query
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), 
})

export default store

