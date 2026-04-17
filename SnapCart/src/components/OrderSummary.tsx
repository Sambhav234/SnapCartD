import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'

function OrderSummary() {
    const {finalTotal,deliveryFee,subTotal}=useSelector((state:RootState)=>state.cart)
  return (
    <div>
      <div className='space-y-3 text-gray-700 text-sm sm:text-base mt-2'>
    <div className='flex justify-between mt-5'>
        <span>Subtotal</span>
        <span className='text-green-700 font-semibold mt-2'>₹{subTotal}</span>
    </div>
    <div className='flex justify-between'>
        <span>Delivery Fee</span>
        <span className='text-green-700 font-semibold mt-2'>₹{deliveryFee}</span>
    </div>
    <hr className='my-3'/>
<div className='flex justify-between font-bold text-lg sm:text-xl mt-5'>
        <span>Final Total</span>
        <span className='text-green-700 font-semibold mt-2'>₹{finalTotal}</span>
    </div>
</div>
    </div>
  )
}

export default OrderSummary
