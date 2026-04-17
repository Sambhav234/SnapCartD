import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,context:{params:{orderId:string}}){
    try{
        await connectDB()
        const {orderId}=await context.params
        console.log(orderId)
        const order=await Order.findById(orderId).populate("assignedDeliveryBoy")
        if(!order){
            return NextResponse.json({
                message:"Order Not Found"
            },{status:400})
        }

        return NextResponse.json({order},{status:200})

    }catch(error){
        return NextResponse.json({
            message:`Error getting order for track order Page : ${error}`
        },{status:500})
    }
}