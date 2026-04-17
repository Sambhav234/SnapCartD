"use client";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { error } from "console";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LiveMap from "@/components/LiveMap";
import DeliveryChat from "./DeliveryChat";

interface ILocation {
  latitude: number;
  longitude: number;
}

function DeliveryBoyDashboard() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const {userData} = useSelector((state: RootState) => state.user);

  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(
        `/api/delivery/assignment/${id}/accept-assignment`,
      );
      console.log(result.data);
    } catch (err) {
      console.log(
        "Error while sending axios req through DeliveryBoyDashboard..",
        err,
      );
    }
  };

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments");
      setAssignments(result.data.assignments);
      console.log(result.data.assignments);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      if (result.data.active) {
        console.log(result.data);
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };


//fetching Location of DeliveryBoy through emit event from 
//socketServer

useEffect(():any=>{
const socket=getSocket()
socket.on("update-deliveryBoy-location",({userId,location})=>{
  console.log("Location : ",location)
  setDeliveryBoyLocation({
    latitude:location.coordinates[1],
    longitude:location.coordinates[0]    
  })
})
return ()=>socket.off("update-deliveryBoy-location")
},[])



  useEffect(() => {
    fetchCurrentOrder();
    fetchAssignments();
  }, [userData]);

  useEffect((): any => {
    const socket = getSocket();
    socket?.on("new-assignment", (deliveryassignment) => {
      setAssignments((prev) => [deliveryassignment, ...prev]);
    });
    return () => socket.off("new-assignment");
  }, []);



  if (activeOrder && userLocation) {
    return (
      <div className="p-4 pt-30 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto md:w-xl sm:w-xl">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Active Delivery
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            order#{activeOrder.order._id.slice(-6)}
          </p>
          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
          <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id?.toString()!}/>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4  flex justify-center flex-col items-center">
      <h2 className="text-2xl font-bold mt-60 pt-10 mb-7.5">
        Delivery Assigments
      </h2>
      <div className="w-full max-w-3xl h-screen overflow-y-auto">
        {assignments?.map((a, index) => (
          <div
            key={index}
            className="p-5 bg-white rounded-xl shadow mb-4  border"
          >
            <p>
              <b>Order Id </b> #{a?.order._id.slice(-6)}
            </p>
            <p className="text-gray-600">{a.order.address.fullAddress}</p>
            <p className="text-gray-600">
              <strong>Order Reciepent :-</strong>
              {a.order.address.fullName}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-green-600 text-white py-2 rounded-lg cursor-pointer"
                onClick={() => handleAccept(a._id)}
              >
                Accept
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryBoyDashboard;
