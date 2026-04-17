import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryassignment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        await connectDB()
        const session=await auth()
        const assignments=await DeliveryAssignment.find({
            brodcastedTo:session?.user?.id,
            status:"brodcasted"
        }).populate("order")

        return NextResponse.json({assignments},{status:200})
    }catch(error){
        return NextResponse.json({message:`get assignment Error : ${error}`},{status:200})
    }
}