
import connectDB from "@/lib/db";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        console.log("Entered Save API")
        await connectDB()
        const {senderId,time,roomId,text}=await req.json()
        const room=await Order.findById(roomId)
        if(!room){
            return NextResponse.json({message:`Room Not Found..`},{status:400})
        }

        const message=await Message.create({
            senderId,text,roomId,time
        }) 
        return NextResponse.json(
            message,{status:200}
        )

    }catch(error){
        return NextResponse.json({message:`Error while Saving And Creating Msg : ${error}`},{status:500})
    }
}