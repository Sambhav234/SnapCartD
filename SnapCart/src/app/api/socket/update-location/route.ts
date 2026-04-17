import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user_model";

export async function POST(req:NextRequest){
    try{
        await connectDB
        const {userId,location}=await req.json()
        if(!userId || !location){
            return NextResponse.json({message:"missing UserId or location"},{status:400})
        }

        const user=await User.findByIdAndUpdate(userId,{location})
        if(!user){
            return NextResponse.json({message:"User Not Found"},{status:400})
        }
        return NextResponse.json({message:"location updated"},{status:200})

    }catch(error){
        return NextResponse.json({message:`update location error : ${error}`},{status:500})
    }
}