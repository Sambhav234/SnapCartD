import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user_model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {

    try{

     await connectDB()
    const{role,mobile}=await req.json()

    const session=await auth()
    const user=await User.findOneAndUpdate({email:session?.user?.email},{
        role,mobile
    },{new:true})

    if(!user){
        return NextResponse.json(
            // frontend error
            {message:"User not Found through session.It is frontend Error"},
            {status:400}
        )
    }

    return NextResponse.json({user},{status:200})

    }catch(err){
        return NextResponse.json({message:`error in api ..server error ${err}`},{status:500})
        console.log(err)
    }
   


}