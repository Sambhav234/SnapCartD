import connectDB from "@/lib/db";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        await connectDB();
        const {roomId}=await req.json()
        // each orders id is considered as roomId
        // so check if order exists with particular
        // id , if order exists then room will auto exist
        const room=await Order.findById(roomId)
        if(!room){
            return NextResponse.json({
                message:`Room Not Found...`
            },{status:400})
        }
        const messages=await Message.find({roomId:room?._id})

        return NextResponse.json({messages},{status:200})
    }catch(error){
        return NextResponse.json(
            {message:`get messages  error ${error}` },{status:500}
        )
    }
}