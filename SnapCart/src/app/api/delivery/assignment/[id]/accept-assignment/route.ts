import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryassignment";
import Order from "@/models/order.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,context:{params: Promise<{id:string;}>;}){    
    try{
        await connectDB()
        const {id}=await context.params
        const session=await auth()
        const deliveryBoyId=session?.user?.id
        console.log("Searching DeliveryBoy id......")
        if(!deliveryBoyId){
            return NextResponse.json({message:"Unauthorise"},{status:400}) 
        }

        console.log("Finding assignment...")
        const assignment=await DeliveryAssignment.findById(id)
        if(!assignment){
            return NextResponse.json({
                message:"Assignment not found"
            },{status:400})
        }

         if(assignment.status!=="brodcasted"){
             return NextResponse.json({message:"assignment expired"},{status:400})
        }

        //  deliveryBoy ko koi aur assignment assig ho gya hai
        console.log("Finding if already assigned.....")
        const alreadyAssigned=await DeliveryAssignment.findOne({
            assignedTo:deliveryBoyId,
            status:{$nin :["brodcasted","completed"]}
        })

        if(alreadyAssigned){
            return NextResponse.json({message:"already assigned to other order"},{status:400})
        }

        console.log("Assigning to deliveryBoy...")

        assignment.assignedTo=deliveryBoyId
        assignment.status="assigned"
        assignment.acceptedAt=new Date()
        await assignment.save()

        console.log("Finding order...")

        const order=await Order.findById(assignment.order)
        if(!order){
             return NextResponse.json({message:"order not found"},{status:400})
        }


        console.log("Saving order...")


        order.assignedDeliveryBoy=deliveryBoyId
        await order.save()

        console.log("order saved..")

        await order.populate("assignedDeliveryBoy")

        // remove other assignments brodcasted to the 
        // deliveryBoy after accepting one 
        // assignment

        console.log("updating assignment queue....")
         await DeliveryAssignment.updateMany(
            {_id:{$ne:assignment._id},
            brodcastedTo:deliveryBoyId,
            status:"brodcasted"
        },
        {
            $pull:{ brodcastedTo:deliveryBoyId}
        }
        )

        console.log("At last....")

         return NextResponse.json({message:"order accepted successfully"},{status:200})


    }catch(err){
        console.log("ERROR IS :",err)
        return NextResponse.json({message:`Internal Server error while accepting assignment..: ${err}`},{status:500})
    }
}