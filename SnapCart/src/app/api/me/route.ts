import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import User from "@/models/user_model";
export async function GET(req:NextRequest){
    try{
        await connectDB()
        const session=await auth()
        if(!session){
            return NextResponse.json({
                mesaage:"user is not authenticated"
            },{
                status:400
            })
        }
        const user=await User.findOne({email:session.user?.email}).select("-password")
        if(!user){
            return NextResponse.json({
                message:"User with this Email does'nt Exist"
            },{status:400})
        }
        return NextResponse.json(
            user,{status:200}
        )
    }catch(error){
            return NextResponse.json({
                message:`get me Error : ${error} `
            },{status:500})
    }
}