import React, { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, CreditCardIcon, Truck } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";




function Checkout2() {

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const {userData}=useSelector((state:RootState)=>state.user)
  const {position,address}=useSelector((state:RootState)=>state.checkout)
  const router=useRouter()
  const { subTotal, deliveryFee, finalTotal, cartData } = useSelector(
    (state: RootState) => state.cart,
  );

  const handleCod=async ()=>{
    if(!position){
      return null
    }
    try{
      console.log(position)
      console.log(userData?._id)
      console.log(address)

      const result=await axios.post('/api/user/order',{
        userId:userData?._id,
        items:cartData.map(item=>({
          grocery:item._id, 
          name:item.name,
          price:item.price,
          unit:item.unit,
          quantity:item.quantity,
          image:item.image

        })),
        totalAmount:finalTotal,
        address:{
          fullName:address.fullName,
          mobile:address.mobile,
          city:address.city,
          state:address.city,
          pincode:address.pincode,
          fullAddress:address.fullAddress,
          latitude:position[0],
          longitude:position[1]
        },
        paymentMethod

      })
      console.log(result.data)
      router.push("/user/order-success")
    }catch(err){
      console.log("Error sending details thorugh cod API",err)
    }
  }

  const handleOnlinePayment=async()=>{
      if(!position){
        return null
    }
    try {
        const result=await axios.post("/api/user/payment",{
        userId:userData?._id,
        items:cartData.map(item=>(
            {
                grocery:item._id,
                name:item.name,
                price:item.price,
                unit:item.unit,
                quantity:item.quantity,
                image:item.image
            }
        )),
        totalAmount:finalTotal,
        address:{
            fullName:address.fullName,
            mobile:address.mobile,
            city:address.city,
            state:address.state,
            fullAddress:address.fullAddress,
            pincode:address.pincode,
            latitude:position[0],
            longitude:position[1]
        },
        paymentMethod
       })
       console.log(result.data)
       window.location.href=result.data.url
    } catch (error) {
        console.log("Payment API error :",error)
    }

  }





  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <CreditCard className="text-green-600" /> Payment Method
      </h2>
      <div className="space-y-4 mb-6">
        <button
          onClick={() => setPaymentMethod("online")}
          className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all cursor-pointer ${paymentMethod === "online" ? "border-green-600 bg-green-50 shadow-sm" : "hover:bg-gray-50"}`}
        >
          <CreditCardIcon className="text-green-600" />
          <span className="font-medium text-gray-700">Pay Online (stripe)</span>
        </button>
        <button
          onClick={() => setPaymentMethod("cod")}
          className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all cursor-pointer ${paymentMethod === "cod" ? "border-green-600 bg-green-50 shadow-sm" : "hover:bg-gray-50"}`}
        >
          <Truck className="text-green-600" />
          <span className="font-medium text-gray-700">Cash on Delivery</span>
        </button>
      </div>
      <div className="border-t pt-4 text-gray-700 space-y-3 text-sm sm:text-base" >
        <div className="flex justify-between"> 
          <span className="font-semibold">Subtotal</span>
          <span className="font-semibold text-green-600"> ₹{subTotal}</span>
        </div>
        <div className="flex justify-between">
             <span className='font-semibold'>Delivery Fee</span>
            <span className='font-semibold text-green-600'>₹{deliveryFee}</span>
        </div>
        <div className='flex justify-between font-bold text-lg border-t pt-3'>
                            <span>Final Total</span>
                            <span className='font-semibold text-green-600'>₹{finalTotal}</span>
        </div>
      </div>
      <motion.button
      
      className="w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 cursor-pointer font-semibold"
      onClick={() =>
        paymentMethod === "cod" ? handleCod() : handleOnlinePayment()
      }
      >
        {paymentMethod=="cod"?"Place Order":"Pay & Place Order "}
      </motion.button>
    </motion.div>
  );
}

export default Checkout2;
