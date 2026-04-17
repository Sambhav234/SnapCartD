import { configureStore } from "@reduxjs/toolkit";
import userSlice from './userSlice'
import cartSlice from './cartSlice'
import checkoutSlice from './checkoutSlice'

export const store=configureStore({
    reducer:{
        user:userSlice,
        cart:cartSlice,
        checkout:checkoutSlice
    }
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch