import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order.model";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET(req:NextRequest){
    try{
        await connectDB()
        const orders=await Order.find({}).populate("user").populate("assignedDeliveryBoy").sort({createdAt:-1})
        return NextResponse.json(
            orders,
            {status:200}
        )

    }catch(error){
         return NextResponse.json(
            {message:`get orders error : ${error}`},
            {status:500}
        )
    }
}