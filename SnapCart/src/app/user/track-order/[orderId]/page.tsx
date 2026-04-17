'use client'
import LiveMap from "@/components/LiveMap";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/user_model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft, Send } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {motion} from 'motion/react'
import { useSelector } from "react-redux";
import { IMessage } from "@/models/message.model";
interface IOrder {
    _id?: string
    user: string
    items: [
        {
            grocery: string,
            name: string,
            price: string,
            unit: string,
            image: string
            quantity: number
        }
    ]
    ,
    isPaid: boolean
    totalAmount: number,
    paymentMethod: "cod" | "online"
    address: {
        fullName: string,
        mobile: string,
        city: string,
        state: string,
        pincode: string,
        fullAddress: string,
        latitude: number,
        longitude: number
    }
    assignment?: string
    assignedDeliveryBoy?: IUser
    status: "pending" | "out of delivery" | "delivered",
    createdAt?: Date
    updatedAt?: Date
}

interface ILocation {
  latitude: number,
  longitude: number
}


function TrackOrder({ params }: { params: { orderId: string } }) {
    const router=useRouter()
    const [order,setOrder]=useState<IOrder>()
    const {orderId}=useParams()
    const [messages,SetMessages]=useState<IMessage[]>([])
    const [newMessage,setNewMessage]=useState("")
    const [userLocation, setUserLocation] = useState<ILocation>(

    {
      latitude: 0,
      longitude: 0
    }
  )
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0
  })
  const {userData}=useSelector((state:RootState)=>state.user)
  const chatBoxRef=useRef<HTMLDivElement>(null)

    useEffect(()=>{
        const getOrder=async ()=>{
            try{
                const result=await axios.get(`/api/user/get-order/${orderId}`)
                // console.log(result.data.order)
                setOrder(result.data.order)
                 setUserLocation({
      latitude:result.data.order.address.latitude,
      longitude:result.data.order.address.longitude
    })
      setDeliveryBoyLocation({
      latitude:result.data.order.assignedDeliveryBoy.location.coordinates[1],
      longitude:result.data.order.assignedDeliveryBoy.location.coordinates[0]
    })
            }catch(error){
                console.log("Error in Axios Api from track order page",error)
            }
        }
        getOrder()
    },[userData?._id])


    // update delivery location instantly in real time
    // using socket.io

    useEffect(():any=>{
const socket=getSocket()
socket.on("update-deliveryBoy-location",(data)=>{
//   console.log(location)
 setDeliveryBoyLocation({
  latitude: data.location.coordinates?.[1] ?? data.location.latitude,
        longitude: data.location.coordinates?.[0] ?? data.location.longitude,

 })
  }
)
return ()=>socket.off("update-deliveryBoy-location")
},[order])


 useEffect(() => {
    const socket = getSocket()
    socket.emit("join-room", orderId)
     socket.on("send-message",(message)=>{
      if(message.roomId===orderId){
 SetMessages((prev)=>[...prev!,message])
      }
    })

    return ()=>{
      socket.off("send-message")
    }})

useEffect(()=>{
    const getallMsgs=async ()=>{
        try{
                 const result= await axios.post("/api/chat/messages",{roomId:orderId})
                 console.log("Received Msgs :",result.data.messages)
                 SetMessages(result.data.messages)
        }catch(error){
            console.log("Error getting all the Msgs :- ",error)
        }
    }
    getallMsgs()
},[])

const sendMsg=()=>{
    const socket=getSocket()

    const message={
        roomId:orderId,
        senderId:userData?._id,
        text:newMessage,
        time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }

    socket.emit("send-message",message)
    setNewMessage("")
}


useEffect(()=>{
    chatBoxRef.current?.scrollTo({
      top:chatBoxRef.current.scrollHeight,
      behavior:"smooth"
    })
  },[messages])



 return (
  <div className='w-full min-h-screen bg-gradient-to-b from-green-50 to-white'>
    <div className='max-w-2xl mx-auto pb-24'>

      {/* Header */}
      <div className='sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow-sm flex gap-3 items-center z-50'>
        <button
          className='p-2 bg-green-100 rounded-full hover:bg-green-200 transition'
          onClick={() => router.back()}
        >
          <ArrowLeft className="text-green-700" size={20} />
        </button>
        <div>
          <h2 className='text-xl font-bold text-gray-800'>Track Order</h2>
          <p className='text-sm text-gray-500'>
            order#{order?._id?.toString().slice(-6)}{' '}
            <span className='text-green-600 font-semibold capitalize'>{order?.status}</span>
          </p>
        </div>
      </div>

      <div className='px-4 mt-6 space-y-4'>

        {/* Live Map */}
        <div className='rounded-3xl overflow-hidden border shadow-md'>
          <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
        </div>

        {/* Chat Box */}
        <div className='bg-white rounded-3xl shadow-lg border border-gray-100 p-4 flex flex-col h-[430px]'>

          {/* Chat Header */}
          <div className='flex items-center gap-2 mb-3 pb-3 border-b border-gray-100'>
            <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
            <span className='text-sm font-semibold text-gray-700'>
              Chat with Delivery Partner
            </span>
          </div>

          {/* ✅ Quick Replies — kept exactly as original */}
          {/* <div className='flex justify-between items-center mb-3'>
            <span className='font-semibold text-gray-700 text-sm'>Quick Replies</span>
            <motion.button
              disabled={loading}
              whileTap={{ scale: 0.9 }}
              className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer"
              onClick={getSuggestion}
            >
              <Sparkle size={14} />
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : "AI suggest"}
            </motion.button>
          </div> */}
{/* 
          <div className='flex gap-2 flex-wrap mb-3'>
            {suggestions.map((s) => (
              <motion.div
                key={s}
                whileTap={{ scale: 0.92 }}
                className="px-3 py-1 text-xs bg-green-50 border border-green-200 cursor-pointer text-green-700 rounded-full"
                onClick={() => setNewMessage(s)}
              >
                {s}
              </motion.div>
            ))}
          </div> */}

          {/* Messages */}
          <div
            className='flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent'
            ref={chatBoxRef}
          >
            <AnimatePresence>
              {messages && messages.length > 0 ? (
                messages.map((msg,index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.senderId.toString() === userData?._id?.toString()
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`px-4 py-2 max-w-[75%] rounded-2xl shadow-sm text-sm
                        ${
                          msg.senderId.toString() === userData?._id?.toString()
                            ? 'bg-green-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                    >
                      <p>{msg.text}</p>
                      <p className='text-[10px] opacity-60 mt-1 text-right'>{msg.time}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className='flex flex-col items-center justify-center h-full text-gray-400 gap-2'>
                  <span className='text-3xl'>💬</span>
                  <p className='text-sm'>No messages yet. Say hi!</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className='flex gap-2 mt-3 border-t border-gray-100 pt-3'>
            <input
              type='text'
              placeholder='Type a message...'
              className='flex-1 bg-gray-100 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-400 transition'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && newMessage.trim() && sendMsg()}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={!newMessage.trim()}
              className='bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl text-white transition'
              onClick={sendMsg}
            >
              <Send size={18} />
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  </div>
);
}

export default TrackOrder;
