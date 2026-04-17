import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user_model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe"

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req:NextRequest){
    try{
        await connectDB()
        const { userId, items, paymentMethod, totalAmount, address } = await req.json()
        if (!items || !userId || !paymentMethod || !totalAmount || !address) {
            return NextResponse.json(
                { message: "please send all credentials" },
                { status: 400 }
            )
        }
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json(
                { message: "user not found" },
                { status: 400 }
            )
        }

        const newOrder = await Order.create({
            user: userId,
            items,
            paymentMethod,
            totalAmount,
            address
        })

        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            success_url:`${process.env.NEXT_BASE_URL}/user/order-success/${newOrder._id}`,
            cancel_url:`${process.env.NEXT_BASE_URL}/user/order-cancel`,
            line_items:[
                {   
                    price_data:{
                        currency:"inr",
                        product_data:{
                            name:"SnapCart Order Payment",
                        },
                        unit_amount:totalAmount*100,
                    },
                    quantity:1

                }
            ],
            metadata:{orderId:newOrder._id.toString()}
        })


        return NextResponse.json({url:session.url},{status:200})


    }catch(error:any){
    console.log("🔥 FULL ERROR:", error);
    console.log("🔥 MESSAGE:", error.message);
    console.log("🔥 TYPE:", error.type);
        return NextResponse.json({message:`order payment error : ${error}`},{status:500})
    }
}