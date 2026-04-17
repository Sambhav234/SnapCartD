"use client"
import React from 'react'
import {motion} from "motion/react"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
function BackButton() {
    const router=useRouter()
  return (
            <motion.button
                whileTap={{ scale: 0.97 }}
                className='absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold mt-10 cursor-pointer'
                onClick={() => router.push("/user/cart")}
            >
                <ArrowLeft size={16} />
                <span>Back to cart</span>
            </motion.button>

            
  )
}

export default BackButton
