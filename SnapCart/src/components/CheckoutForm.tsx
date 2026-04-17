"use client"
import { Building, Home, Loader2, LocateFixed, MapPin, Navigation, Phone, Search, User } from "lucide-react";
import React, { useDebugValue, useEffect, useState } from "react";
import {motion, number} from "motion/react"
import { useSelector,useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { setReduxPosition,setReduxAddress } from "@/redux/checkoutSlice";
import dynamic from "next/dynamic";

const CheckoutMap = dynamic(() => import("./CheckoutMap"), {
  ssr: false,
});



function CheckoutForm() {

  const {userData}=useSelector((state:RootState)=>state.user)
  const [searchLoading,setSearchLoading]=useState(false)
  const dispatch=useDispatch()

  const [searchQuery,setSearchQuery]=useState("")

  const [address,setAddress]=useState({
        fullName: "",
        mobile: "",
        city: "",
        state: "",
        pincode: "",
        fullAddress: ""
  })
  const [position,setPosition]=useState<[number,number] | null>(null)

  useEffect(()=>{
    dispatch(setReduxPosition(position))
  },[position])
  
  useEffect(()=>{
    dispatch(setReduxAddress(address))
  })


  useEffect(()=>{
    if(navigator.geolocation){
      // getCurrentPosition(successCallback, errorCallback, options)
      navigator.geolocation.getCurrentPosition((pos)=>{
          const {latitude,longitude}=pos.coords
          setPosition([latitude,longitude])
      },(err)=>{console.log('location error',err)},{enableHighAccuracy:true,maximumAge:0,timeout:10000})
    }
  },[])

  // reverse geocoding using nominatim APi
  useEffect(()=>{
    const fetchAddress=async ()=>{
      if(!position)return
      try{
        const result=await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`)
        console.log(result.data)
        setAddress(prev=>({...prev,
          city:result.data.address.city,
          state:result.data.address.state,
          pincode:result.data.address.postcode,
          fullAddress:result.data.display_name
        }))
      }catch(err){
        console.log("Reverse Geocoding Error : ",err)
      }
    }
    fetchAddress()
  },[position])



  useEffect(()=>{
    if(userData){
      setAddress((prev)=>({...prev,fullName:userData?.name || ""}))
       setAddress((prev)=>({...prev,mobile:userData?.mobile || ""}))
    }
  },[userData])

  const handleCurrentLocation=()=>{
  if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords
                setPosition([latitude, longitude])
            }, (err) => { console.log('location error', err) }, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 })
        }
 }



//handling location by searching it through
// input ..making use of leaflet geosearch plugin
 const handleSearchQuery=async ()=>{
    setSearchLoading(true)
    const {OpenStreetMapProvider}=await import("leaflet-geosearch")
    const provider=new OpenStreetMapProvider()
    const results=await provider.search({query:searchQuery});
    if(results){
      setSearchLoading(false)
      console.log("Handle Query Results :",results)
      setPosition([results[0].y,results[0].x])
    }
 }





//   Component mounts
//       ↓
// useEffect runs
//       ↓
// Check navigator.geolocation
//       ↓
// getCurrentPosition called
//       ↓
// Browser asks permission
//       ↓
// User clicks Allow
//       ↓
// Browser fetches GPS location
//       ↓
// success callback runs
//       ↓
// latitude & longitude extracted
//       ↓
// setPosition updates state
//       ↓
// Map marker moves to user's location

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin className="text-green-700" /> Delivery Address
      </h2>
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 text-green-600" size={18}/>
          <input
            type="text"
            className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
            value={address.fullName}
            onChange={(e)=>{
              setAddress((prev)=>({
                ...prev,
                fullName:e.target.value
              }))
            }}
          ></input>
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-3 text-green-600" size={18} />
          <input
            type="text"
            className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
             value={address.mobile}
            onChange={(e)=>{
              setAddress((prev)=>({
                ...prev,
                mobile:e.target.value
              }))
            }}
          />
        </div>
        <div className="relative">
          <Home className="absolute left-3 top-3 text-green-600" size={18} />
          <input
            type="text"
            value={address.fullAddress}
            placeholder="Full Address"
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, fullAddress: e.target.value }))
            }
            className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="relative">
            <Building
              className="absolute left-3 top-3 text-green-600"
              size={18}
            />
            
            <input
              type="text"
              value={address.city}
              placeholder="city"
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, city: e.target.value }))
              }
              className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
            />
          </div>
          <div className="relative">
            <Navigation
              className="absolute left-3 top-3 text-green-600"
              size={18}
            />
            <input
              type="text"
              value={address.state}
              placeholder="state"
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, state: e.target.value }))
              }
              className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
            />
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-green-600"
              size={18}
            />
            <input
              type="text"
              value={address.pincode}
              placeholder="pincode"
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, pincode: e.target.value }))
              }
              className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="search city or area..."
            className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium cursor-pointer"
            onClick={handleSearchQuery}
          >
            {0 ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Search"
            )}

          </button>
        </div>

        <div className="relative mt-6 h-82.5 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
          {position && (
            <CheckoutMap position={position} setPosition={setPosition} />
          )}
          <motion.button
            whileTap={{ scale: 0.93 }}
            className="absolute bottom-4 right-4 bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-999"
            onClick={handleCurrentLocation}
          >
            
            <LocateFixed size={22} />
          </motion.button>
        </div>
      </div>
    </>
  );
}

export default CheckoutForm;
