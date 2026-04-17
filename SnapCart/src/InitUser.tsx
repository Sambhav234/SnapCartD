'use client'
import { useSession } from 'next-auth/react'
import React from 'react'
import useGetme from './hooks/useGetme'

function InitUser() {
  const {status}=useSession()
  // hook always called

  useGetme(status==='authenticated')

  return null
}

export default InitUser
