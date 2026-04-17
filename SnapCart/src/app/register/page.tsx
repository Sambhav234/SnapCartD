
"use client"
import RegisterForm from '@/components/RegisterForm'
import Welcome from '@/components/Welcome'
import React from 'react'
import { useState } from 'react'
function page() {
  const [step,setStep]=useState(1)
  return (
    <div>

      {step==1 ? <Welcome nextStep={setStep}/> : <RegisterForm PrevStep={setStep}/>}

    </div>
  )
}

export default page
