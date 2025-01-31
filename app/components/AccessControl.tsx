"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"

interface AccessControlProps {
  children: React.ReactNode
  allowedUserTypes: string[]
}

const AccessControl: React.FC<AccessControlProps> = ({ children, allowedUserTypes }) => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (!userType || !allowedUserTypes.includes(userType)) {
      router.push("/login")
    } else {
      setIsAuthorized(true)
    }
  }, [allowedUserTypes, router])

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

export default AccessControl

