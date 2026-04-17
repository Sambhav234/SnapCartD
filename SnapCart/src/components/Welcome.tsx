"use client"


import React from 'react'
import {motion} from "motion/react"
import {ShoppingBasket,Motorbike, ArrowRight, SunMoon} from 'lucide-react'
type Proptype={
    nextStep:(s:number)=>void
}
function Welcome({nextStep}:Proptype) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6'>
            <motion.div 
                initial={{
                    opacity:0,
                    y:-20
                }}
                animate={{
                    opacity:1,
                    y:0
                }}
                transition={{
                    duration:0.6
                }}
                className='flex gap-2.5 items-center'
            >
                <ShoppingBasket className="mt-1.5 h-8 w-9 text-green-600"/>
                <h1 className='text-4xl md:text-5xl font-extrabold text-green-700'>
                    SnapCart
                </h1>
            </motion.div>

            <motion.p

                initial={{
                    opacity:0,
                    y:10
                }}
                animate={{
                    opacity:1,
                    y:0
                }}
                transition={{
                    duration:0.6,
                    delay:0.2
                }}
            
            className='mt-4 text-gray-700 text-lg md:text-xl max-w-lg'>
                Groceries should fill your home, not your schedule — let <span className='text-orange-700'>SnapCart </span>deliver the rest.
            </motion.p>

            <motion.div
                initial={{
                    opacity:0,
                    scale:0.7
                }}
                animate={{
                    opacity:1,
                    scale:1
                }}
                transition={{
                    duration:0.6,
                    delay:0.2
                }}

             className='flex gap-10 mt-10 items-center justify-center'>
                <Motorbike  className="h-24 w-24 md:h-32 md:w-32 text-orange-500"/>
                <ShoppingBasket className="h-24 w-24 md:h-32 md:w-32 text-green-500"/>
            </motion.div>

            <motion.button
                initial={{
                    opacity:0,
                    y:20
                }}
                animate={{
                    opacity:1,
                    y:0
                }}
                transition={{
                    duration:0.5,
                    delay:0.8,
                }}
                className='inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 mt-10 cursor-pointer'
                onClick={()=>{nextStep(2)}}
            >
                Next
                <ArrowRight></ArrowRight>
            </motion.button>


    </div>
  )
}

export default Welcome
