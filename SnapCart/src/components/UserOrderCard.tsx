"use client";
import { CreditCard, MapPin, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IUser } from "@/models/user_model";
import ExpandedCard from "./ExpandedCard";
import { getSocket } from "@/lib/socket";
import InfoBtn from "./InfoBtn";

export interface IOrder {
  _id?: string;
  user: string;
  items: [
    {
      grocery: string;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: string;
  assignedDeliveryBoy?: IUser;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

function UserOrderCard({ order }: { order: IOrder }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "out of delivery":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  useEffect(() => {
    const socket = getSocket();
    socket?.on("order-status-update", (data) => {
      if (String(data.orderId) === String(order._id)) {
        setStatus(data.status);
      }
    });
    return () => {
      socket.off("order-status-update");
    };
  }, [order]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 px-5 py-4 bg-linear-to-r from-green-50 to-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            order{" "}
            <span className="text-green-700 font-bold">
              #{order?._id?.toString()?.slice(-6)}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {status !== "delivered" && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                order.isPaid
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
            >
              {order.isPaid ? "Paid" : "Unpaid"}
            </span>
          )}

          <span
            className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(
              status,
            )}`}
          >
            {status}
          </span>
        </div>
      </div>

      {order.paymentMethod == "cod" ? (
        <div className="flex items-center gap-2 text-gray-700 text-sm mx-4 py-3">
          <Truck size={16} className="text-green-600" />
          Cash On Delivery
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-700 text-sm py-3">
          <CreditCard size={16} className="text-green-600 mx-4" />
          Online Payment
        </div>
      )}

      {
        order.assignedDeliveryBoy &&
        <>
        <InfoBtn order={order} />
         <button className='w-full cursor-pointer flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow hover:bg-green-700 transition mt-3 mb-3' onClick={()=>router.push(`/user/track-order/${order._id?.toString()}`)}><Truck size={18}/> Track Your Order</button>
        </>
      }

      <div className="flex items-center gap-2 text-gray-700 text-sm mx-4 mb-3">
        <MapPin size={16} className="text-green-600" />
        <span className="truncate">{order.address.fullAddress}</span>
      </div>

      <ExpandedCard order={order} />

      <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800 mx-4 py-3">
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <Truck size={16} className="text-green-600" />
          <span>
            Delivery:{" "}
            <span className="text-green-700 font-semibold">{status}</span>
          </span>
        </div>
        <div>
          Total:{" "}
          <span className="text-green-700 font-bold">₹{order.totalAmount}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default UserOrderCard;
