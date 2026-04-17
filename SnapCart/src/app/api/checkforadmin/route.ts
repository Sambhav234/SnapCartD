import connectDB from "@/lib/db";
import User from "@/models/user_model";
import { connect } from "http2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        await connectDB()
        const admins=await User.find({role:"admin"})
        if(admins.length>0){
            return NextResponse.json({adminExist:true},{status:200})
        }

        return NextResponse.json({adminExist:false},{status:400})

    }catch(error){
        return NextResponse.json({message:`Admin Check Error : ${error}`},{status:500})
    }
}