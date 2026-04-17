'use client'
import React from 'react'
import {motion} from 'motion/react'
import { SmileIcon } from 'lucide-react'
function viewGrocery() {
  return (
    <div className=' w-full min-h-screen flex flex-col items-center justify-center '>
         <h2 className='text-green-600'>This Page is Under Development !!!</h2>
         <motion.div
       initial={{y:40,opacity:0}}
       animate={{y:[0,-10,0],opacity:1}}
       transition={{delay:1,duration:2,repeat:Infinity,ease:"easeInOut"}}
       className='mt-8'
       >
       
        <SmileIcon className="w-16 h-16 mt-4 md:w-20 md:h-20 text-green-600"></SmileIcon>
       </motion.div>
    </div>
  )
}

export default viewGrocery
