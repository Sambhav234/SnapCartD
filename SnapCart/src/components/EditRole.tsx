'use client'

import React, { useEffect, useState } from 'react'
import {motion} from 'motion/react'
import { Bike, User, UserCog } from 'lucide-react'
import axios from 'axios'
import { redirect } from 'next/navigation'

function EditRole() {
    const [selectedrole,setselectedrole]=useState("")
    const [mobile,setmobile]=useState("")
    const [role,setrole]=useState([
        {id:"admin",label:"Admin",icon:UserCog},
        {id:"user",label:"User",icon:User},
        {id:"deliveryboy",label:"Delivery Boy",icon:Bike}
    ])
    const handle=async ()=>{
        const result=await axios.post("/api/user/editrole",{
            role:selectedrole,
            mobile
        })
        console.log(result.data)
        redirect("/")
    }


    useEffect(()=>{
        const handleadmin=async ()=>{
            const res=await axios.get("/api/checkforadmin");
            if(res.data.adminExist){
                const roles=role.filter(r=>!(r.id=="admin"))
                setrole(roles)
            }
        }
        handleadmin()
    },[])
  return (

    <div className="flex flex-col 
        min-h-screen px-6 py-10 relative
        items-center
    ">

       <motion.h1
       className="text-3xl md:text-4xl font-extrabold text-green-600 max-[300px]:text-lg flex justify-center"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
       
       >Select your role</motion.h1>

        <div className='flex flex-col md:flex-row justify-center items-center gap-6 mt-10'>
            {role.map((role)=>{
                const Icon=role.icon
                const isSelected=selectedrole==role.id
                return(
                    <motion.div
                     initial={{
                    opacity: 0,
                    y: 10,
                    }}
                    animate={{
                    opacity: 1,
                    y: 0,
                    }}
                    transition={{
                    duration: 0.6,
                    delay: 0.2,
                    }}
                    key={role.id}
                    whileTap={{scale:0.9}}
                    whileHover={{scale:1.02}}
                    onClick={() =>
                     setselectedrole(prev => (prev === role.id ? "" : role.id))
                            }
                        className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2
                                transition-all cursor-pointer
                                ${
                                    isSelected
                                    ? "border-green-600 bg-green-200 shadow-lg"
                                    :"border-gray-300 bg-white hover:border-green-600 hover:bg-green-100"
                                }
                            `}
                    >
                        <Icon/>
                        <span>{role.label}</span>
                    </motion.div>
                )
            })}
        </div>
            <motion.div className='flex flex-col mt-10'
                 initial={{
                    opacity: 0,
                    y: 10,
                    }}
                    animate={{
                    opacity: 1,
                    y: 0,
                    }}
                    transition={{
                    duration: 0.6,
                    delay: 0.4,
                    }}
            
            >
                <label htmlFor="mobile" className='text-lg font-semibold text-gray-600' >Enter your Mobile Number : </label>
                <input type='tel' id='mobile' placeholder='eg. 7379XXXXXX '
                 className='w-full border
                  border-gray-300
                   pl-10 pr-4 py-3 mt-2
                   rounded-xl text-gray-800
                    focus:ring-2 focus:ring-green-600 focus:outline-none'
                    onChange={(e)=>setmobile(e.target.value)}
                    ></input>
            </motion.div>
            <motion.button 
            onClick={handle}
             initial={{
                    opacity: 0,
                    y: 10,
                    }}
                    animate={{
                    opacity: 1,
                    y: 0,
                    }}
                    transition={{
                    duration: 0.6,
                    delay: 0.7,
                    }}
            disabled={mobile.length!==10 || !selectedrole}
            className={ `inline-flex items-center gap-2 font-semibold py-3 px-8 mt-10 rounded-2xl transition-all shadow-md duration-200 
                    ${
                        selectedrole && mobile.length==10
                        ?"bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        :"bg-gray-300 text-gray-500 cursor-not-allowed"
                    }
                  `

                  }>
                  
                Go to Home
            </motion.button>

    </div>
  )
}

export default EditRole
