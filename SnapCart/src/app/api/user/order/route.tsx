import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import Order from "@/models/order.model";
import User from "@/models/user_model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        await connectDB()
    const {userId,items,totalAmount,address,paymentMethod }=await req.json()
    if(!userId || !items || !totalAmount || !address || !paymentMethod){
        return NextResponse.json({
            message:"Send full Credentials",
        },{status:400})
    }
    const user=await User.findById(userId)
    if(!user){
        return NextResponse.json({message:"User Not FOund"},{status:400})
    }

    const newOrder=await Order.create({
        user:userId,
        items,
        paymentMethod,
        totalAmount,
        address
    }
    )
    console.log("sending event Handler....")
    await emitEventHandler("new-order",newOrder)
    console.log("Event Handler Sent...")


    return NextResponse.json(
        newOrder,
        {status:201}
    )

    }catch(error){
        return NextResponse.json({message:`Place Order Error ${error}`},{status:500})
    }
}