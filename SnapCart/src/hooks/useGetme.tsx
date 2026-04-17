'use client'
import {useDispatch} from 'react-redux'
import { AppDispatch } from '@/redux/store'
import axios from 'axios'
import { setUserData } from '@/redux/userSlice'
import { useEffect } from 'react'

function useGetme(enabled:boolean){
    const dispatch=useDispatch<AppDispatch>()

useEffect(()=>{
    if(!enabled) return //SAFE

    let cancelled=false;
        // to ensure that no api call when component is unmounted

    const Getme=async ()=>{
        try{
            const result=await axios.get("/api/me")
            if(!cancelled){
                dispatch(setUserData(result.data))
            }
        }catch(error){
            console.log('GET ME FAILED ',error)
        }
    }

    Getme()

    return ()=>{
        cancelled=true
    }
},[enabled,dispatch])

}

export default useGetme

// Component Mount
//        │
//        ▼
// useEffect runs
//        │
//        ▼
// enabled true ?
//        │
//        ▼
// API call start
//        │
//        │───────────────┐
//        ▼               │
// User leaves page       │
//        │               │
//        ▼               │
// Cleanup runs           │
// cancelled = true       │
//                        │
//               API response arrives
//                        │
//                        ▼
//               if (!cancelled) ❌
//               So no dispatch