'use client'

import React, { useEffect, useRef, useState } from 'react'
import mongoose from 'mongoose'
import Link from 'next/link'
import { Boxes, ClipboardCheck, LogOut, Menu, Package, PlusCircle, Search, ShoppingCartIcon, User, X } from 'lucide-react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
interface IUser{
    id?:mongoose.Types.ObjectId
    name:string
    email:string
    password?:string
    mobile:string
    role:"user" | "admin" | "deliveryboy"
    image?:string
}
function Nav({user}:{user:IUser}) {
    const [search,setSearch]=useState("")
    const [open,setOpen]=useState(false)
    const profileDropDown=useRef<HTMLDivElement>(null)
    const [searchBarOpen,setSearchBarOpen]=useState(false)
    const [menuOpen,setMenuOpen]=useState(false)

    const {cartData}=useSelector((state:RootState)=>state.cart)

    // createPortal is used to
    // show sidebar above all elements
    // siderBar ka koi bhi parent nhi hoga
    // ye expicitly aaegi or chli jaegi..
    // No intervention of any other Element in DOM
    const sideBar=createPortal(
        // animatepresent is used to give
        // good exit animation to the component
        <AnimatePresence>

          {menuOpen &&<motion.div
            initial={{x:-100,opacity:0}}
            animate={{x:0,opacity:1}}
            exit={{  x: "-100%",transition: { duration: .4, ease: "easeInOut" }}}
            transition={{  type: "spring",
                            stiffness: 120,
                            damping: 20}}
            className='fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-9999
              bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900/90
              backdrop-blur-xl border-r border-green-400/20
              shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)]
              flex flex-col p-6 text-white'
            >
                 <div className='flex justify-between items-center mb-2'>
                    <h1 className='font-extrabold text-2xl tracking-wide text-white/90'>Admin Panel</h1>
                    <button className='text-white/80 hover:text-red-400 text-2xl font-bold transition cursor-pointer'
                        onClick={() => setMenuOpen(false)}
                    ><X /></button>
                </div>
                <div className='flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner'>
                   <div className='relative w-12 h-12 rounded-full overflow-hidden border-2 border-green-400/60 shadow-lg'> {user.image ? <Image src={user.image} alt='user' fill className='object-cover rounded-full' /> : <User />}</div>
                     <div>
                        <h2 className='text-lg text-white font-semibold'>{user.name}</h2>
                        <p className='text-xs text-green-200 capitalize tracking-wide'>{user.role}</p>
                     </div>
                 </div>
                <div className='flex flex-col gap-3 font-medium mt-6'>
                    <Link href={"/admin/add-grocery"} className='flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all'><PlusCircle className='w-5 h-5' /> Add Grocery</Link>
                    <Link href={"/admin/view-grocery"} className='flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all'><Boxes className='w-5 h-5' /> view Grocery</Link>
                    <Link href={"/admin/manage-orders"} className='flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all'><ClipboardCheck className='w-5 h-5' /> Manage Orders</Link>
                </div>
                <div className='my-5 border-t border-white/20'></div>
                <div className='flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all cursor-pointer' onClick={async ()=>await signOut({callbackUrl:"/"})}>
                    <LogOut className='w-5 h-5 text-red-300'/>
                    Logout
                </div>
               

            </motion.div> }
        </AnimatePresence>,document.body
    );


    const handleSearch=()=>{
        console.log("Something Searched..")
    }


//     Component Mounts
//       ↓
// JSX Renders (Dropdown appears)
//       ↓
// useEffect runs (only once because [])
//       ↓
// Event Listener added to document (mousedown)
//       ↓
// User clicks anywhere on page
//       ↓
// handleClickOutside(event) is called
//       ↓
// Is profileDropDown.current NOT null?
//       ↓
// Is clicked element INSIDE dropdown?
//       ↓                    ↓
//     YES                  NO
//      ↓                    ↓
// Do nothing          setOpen(false)
// (dropdown stays)    (dropdown closes)
//       ↓
// Component Unmounts
//       ↓
// Cleanup runs
//       ↓
// Event Listener removed


    useEffect(()=>{



        const handleClickOutside=(e:MouseEvent)=>{
            if(profileDropDown.current && !profileDropDown.current.contains(e.target as Node)){
                setOpen(false)
            }
        }


        document.addEventListener('click',handleClickOutside)
        return () => document.removeEventListener('click',handleClickOutside)
    },[])


  return (
    <div className='w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-15 px-4 md:px-8 z-50'>
         <Link href={"/"} className='text-white font-extrabold text-2xl sm:text-2xl tracking-wide hover:scale-105 transition-transform'>
                Snapcart
            </Link>



            {/* // SEARCH BAR */}
            {/* // role has to be changed */}
            
             {user.role == "user" && <form className='  hidden md:flex items-center
      absolute left-1/2 -translate-x-1/2
      bg-white rounded-full px-4 py-2
      w-[320px] lg:w-105
      shadow-md'
       onSubmit={handleSearch}>
                <Search className='text-gray-500 w-5 h-5 mr-2' />
                <input type="text" placeholder='Search groceries...' className='w-full outline-none text-gray-700 placeholder-gray-400' 
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                
                />
            </form>}
            












        <div className='ml-auto flex items-center gap-6 md:gap-5 mr-3'>
{/* 
            need to change admin ->user */}
          {user.role == "user" && <> <div className='bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-105 transition md:hidden ' onClick={()=>setSearchBarOpen((prev)=>!prev)} >
                    <Search className='text-green-600 w-6 h-6' />
                </div>



                    <Link href={"/user/cart"} className='relative bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-105 transition'>
                        <ShoppingCartIcon className='text-green-600 w-6 h-6' />
                        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow'>{cartData.length}</span>
                    </Link></>}


                {user.role == "admin" && <>
                    <div className='hidden md:flex items-center gap-4'>
                        <Link href={"/admin/add-grocery"} className='flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'><PlusCircle className='w-5 h-5' /> Add Grocery</Link>
                        <Link href={"/admin/view-grocery"} className='flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'><Boxes className='w-5 h-5' /> view Grocery</Link>
                        <Link href={"/admin/manage-orders"} className='flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'><ClipboardCheck className='w-5 h-5' /> Manage Orders</Link>
                    </div>
                    <div className='md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md' onClick={() => setMenuOpen(prev => !prev)}>
                        <Menu className='text-green-600 w-6 h-6 cursor-pointer' />
                    </div>
                </>}


            </div>

            {/* profileDropDown */}

            <div className='relative'  ref={profileDropDown}>
                 <div className='bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer' onClick={()=>setOpen(prev=>!prev)}>
                        {user.image ? <Image src={user.image} alt='user' fill className='object-cover rounded-full'  /> : <User />}
                </div>
            <AnimatePresence>
                { open &&

                    <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}

                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}

                    className='absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999'
                    >
                        <div className='flex items-center gap-3 px-3 py-2 border-b border-gray-100'>
                                <div className='w-10 h-10 relative rounded-full bg-green-100 flex items-center justify-center overflow-hidden'>
                                 {user.image ? <Image src={user.image} alt='user' fill className='object-cover rounded-full' /> : <User />}
                                </div>
                                            <div>
                                             <div className='text-gray-800 font-semibold'>{user.name}</div>
                                                 <div className='text-xs text-gray-500 capitalize'>{user.role}</div>
                                            </div>
                        </div>


                            {/* // here need to change role to user from admin */}
                           {user.role == "user" && <Link href={"/user/my-orders"} className='flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium' onClick={() => setOpen(false)}>
                            <Package className='w-5 h-5 text-green-600' />
                                                My Orders
                            </Link>}

                            <button className='flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg text-gray-700 font-medium' onClick={() => {
                                                                setOpen(false)
                                                                signOut({ callbackUrl: "/login" })
                                                            }}>
                             <LogOut className='w-5 h-5 text-red-600' />
                                         Log Out
                            
                             </button>




                    </motion.div>
                }
            </AnimatePresence>
              </div>

                  <AnimatePresence>
                        {searchBarOpen
                            &&
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className='fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 flex items-center px-4 py-2'
                            >
                                <Search className='text-gray-500 w-5 h-5 mr-2' />
                                
                                <form className='grow' onSubmit={handleSearch}>
                                    <input type="text" className='w-full outline-none text-gray-700' placeholder='search groceries...'  value={search}
                                   onChange={(e)=>setSearch(e.target.value)}/>
                                </form>

                                <button onClick={() => setSearchBarOpen(false)}>
                                    <X className='text-gray-500 w-5 h-5' />
                                </button>
                            </motion.div>
                        }
                    </AnimatePresence>

                    {sideBar}          


        </div>
  )
}

export default Nav
