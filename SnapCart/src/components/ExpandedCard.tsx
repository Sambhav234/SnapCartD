'use client'
import { ChevronDown, ChevronUp, Package } from 'lucide-react'
import React, { useState } from 'react'
import {motion} from "motion/react"
import { IOrder } from './UserOrderCard'
import Image from 'next/image'

function ExpandedCard({order}:{order:IOrder}) {
    const [expanded, setExpanded] = useState(false)
  return (
    <div className='border-t border-gray-200 pt-3'>
                    <button
                        onClick={() => setExpanded(prev => !prev)}
                        className='w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition'
                    >

                        <span className='flex items-center gap-2 mx-4 py-3'>
                            <Package size={16} className="text-green-600" />
                            {expanded ? "Hide Order Items" : `view ${order.items.length} Items`}
                        </span>

                        {expanded ? <ChevronUp size={16} className="text-green-600 mr-2" /> : <ChevronDown size={16} className="text-green-600 mr-2" />}

                    </button>

                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: expanded ? "auto" : 0,
                            opacity: expanded ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className='mt-3 space-y-3'>
                           {order.items.map((item,index)=>(
                            <div 
                            key={index}
                            className='flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition'>
                               <div className='flex items-center gap-3'>
                                     <Image src={item.image} alt={item.name} width={48} height={48} className=" rounded-lg object-cover border border-gray-200"/>
                                     <div>
                                        <p className='text-sm font-medium text-gray-800'>{item.name}</p>
                                        <p className='text-xs text-gray-500'>{item.quantity} x {item.unit}</p>
                                     </div>
                               </div>
                               <p className='text-sm font-semibold text-gray-800'>₹{Number(item.price)*item.quantity}</p>
                               
                            </div>
                           ))}
                        </div>

                    </motion.div>

                </div>
  )
}

export default ExpandedCard
