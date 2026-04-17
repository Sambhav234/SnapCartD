import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryassignment";
import User from "@/models/user_model";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order.model";
import emitEventHandler from "@/lib/emitEventHandler";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ orderId: string; }>; }
) {
  try {
    await connectDB();

    const { orderId } = await context.params;
    const { status } = await req.json();

    console.log(
      "The status and orderId which i got from manageOrder are :",
      status,
      orderId,
    );

    console.log("FInding order...")
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order Not Found" }, { status: 400 });
    }
    console.log("FInding order...finished")


    console.log("checking Status......")
    order.status = status;
    let deliveryBoysPayload: any = [];
    if (status === "out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryboy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000,
          },
        },
      });
      console.log("Status checked......deliveryboysPayload fetched..")


      console.log("Fetching Nearby Ids")
      
      let nearbyIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearbyIds },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      console.log("Builidng set....")

      const busyIdSet = new Set(busyIds.map((b) => String(b)));
      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id)),
      );

      const candidates = availableDeliveryBoys.map((b) => b._id);


      console.log("checking for candidates....")

      if (candidates.length == 0) {
        await order.save();

        await emitEventHandler("order-status-update",{orderId:order._id,status:order.status})

        return NextResponse.json(
          {
            message: "there is no available Delivery Boys",
          },
          { status: 200 },
        );
      }

      console.log("candidates check done")

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });


      console.log("Delivery assignment Done")

      await deliveryAssignment.populate("order");

      for(const boyid of candidates){
        const boy=await User.findById(boyid)
        if(boy.socketId){
          await emitEventHandler("new-assignment",deliveryAssignment,boy.socketId)
        }
      }

      order.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));
      await deliveryAssignment.populate("order");

      
    }

      console.log("Delivery Payload Created , ready to send")


    await order.save();
    await order.populate("user");
    await emitEventHandler("order-status-update",{orderId:order._id,status:order.status})
    return NextResponse.json(
      {
        assignment: order.assignment?._id,
        availableBoys: deliveryBoysPayload,
      },
      { status: 200 },
    );

      console.log("Reached Try End....")

  } catch (error) {

    return NextResponse.json(
      {
        message: `update status error ${error}`,
      },
      { status: 500 },
    );

  }
}
