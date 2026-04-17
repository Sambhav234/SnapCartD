import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user_model";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest) {
    
    try{
        await connectDB()
        const {name,email,password}=await req.json()
        console.log(name,email,password)

        const existUser=await User.findOne({email})
        if(existUser){
            console.log("User Exists")
           return NextResponse.json(
            {
                message:"User with this email already exists"
            },
            {
                status:400
            }
           )
        }

        if(password.length<6){
            
            return NextResponse.json({message:"Password must be 6 digits long"},{status:400})
        }
        const hashedPassword=await bcrypt.hash(password,10)

        const user=await User.create({
            name,email,password:hashedPassword
        })

        return NextResponse.json({
            user
        },{status:200})


    }catch(err){
        console.log(err)
        return NextResponse.json({message:`Error : ${err}`},{status:500})
    }
}
