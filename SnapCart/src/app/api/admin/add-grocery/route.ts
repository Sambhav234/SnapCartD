import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
    try{

        await connectDB()
        const session=await auth()
// Auth.js karta kya hai:
// Request ke cookies padhta hai
// Token verify karta hai
// User fetch karta hai
// Session object bana deta hai

        if(session?.user?.role!=="admin"){
            return NextResponse.json(
                {message:"You are not an Admin."},
                {
                    status:400
                }
            )
        }

        const formData=await req.formData()
        const name=formData.get("name") as string
        const category=formData.get("category") as string
        const unit=formData.get("unit") as string
        const price=formData.get("price") as string
        const file=formData.get("image") as Blob | null
        let imageUrl
        if(file){
            imageUrl=await uploadOnCloudinary(file)
            // here we will get the result of resolve( ) in uploadCloudinary
        }
        const grocery=await Grocery.create({
            name,price,category,unit,image:imageUrl
        })

        return NextResponse.json(
            grocery,
            {status :200}
        )
        // NextResponse represents the HTTP response sent back to the client and can be inspected 
        // in the browser’s Network tab or frontend fetch handlers.


    }catch(error){
        return NextResponse.json(
            {message:`add grocery error : ${error}`},
            {status:500}
        )
    }
}

// Browser
//  ↓ (cookies + formData)
// POST /api/grocery
//  ↓
// auth() → session mila
//  ↓
// formData() → name + image mile
//  ↓
// image → Cloudinary → URL
//  ↓
// DB me grocery save
//  ↓
// NextResponse.json()
//  ↓
// Browser / frontend / Network tab