import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryassignment";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    try{
        await connectDB()
        const session=await auth()
        const deliveryBoyId=session?.user?.id
        const activeassignment=await DeliveryAssignment.findOne({
            assignedTo:deliveryBoyId,
            status:"assigned"
        }).populate({
            path:"order",
            populate:{path:"address"}
        }).lean()

        if(!activeassignment){
            return NextResponse.json({
                active:false
            },{status:200})
        }

        return NextResponse.json({
            active:true,assignment:activeassignment
        },{status:200})


    }catch(err){
        return NextResponse.json({
            message:`Current order Error : ${err}`
        },{status:200})
    }
}