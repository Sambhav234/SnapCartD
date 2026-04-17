import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe"
import Order from "@/models/order.model";

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req:NextRequest){
    const sig=req.headers.get("stripe-signature")
    const rawBody=await req.text()
    let event
    try{
        event=stripe.webhooks.constructEvent(
            rawBody,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
        console.log("Verified Event :",event.type)

    }catch(error){
        console.log("Signature Verification failed ",error)
        return NextResponse.json({message:"invalid signature"},{status:400})
    }

    if(event?.type==="checkout.session.completed"){
        const session=event.data.object
        console.log("Metadata :",session.metadata)

        await connectDB()
        const updated =await Order.findByIdAndUpdate(session?.metadata?.orderId,{
            isPaid:true
        },{new:true})

        console.log("Updated Order :",updated)
    }


    return NextResponse.json({received:true},{status:200})
}