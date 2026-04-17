"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import {motion, number} from "motion/react"
import BackButton from '@/components/BackButton';
import CheckoutForm from '@/components/CheckoutForm';
import Checkout2 from '@/components/Checkout2';
import { useState } from 'react';

function Checkout() {
    const router=useRouter()

   return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
     <BackButton/>
     <motion.h1
     initial={{opacity:0,y:10}}
     animate={{opacity:1,y:0}}
     transition={{duration:0.3}}
     className='text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'
     >
        Checkout
     </motion.h1>

    <div className='grid md:grid-cols-2 gap-8 border-4'>
        <motion.div
        initial={{opacity:0,x:-20}}
        animate={{opacity:1,x:0}}
        transition={{duration:0.3}}
        className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100'
        >
         <CheckoutForm/>

        </motion.div>

        <Checkout2/>
    </div>

    </div>
  );
}

export default Checkout
