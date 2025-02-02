"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

export default function Login() {
  const [loginType, setLoginType] = useState<"user" | "admin" | null>(null)
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: ""
  })
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      localStorage.setItem("userType", "user")
      localStorage.setItem("user", JSON.stringify(result.user))
      
      router.push("/profile")
    } catch (error) {
      console.error("Google login error:", error)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Strict validation for admin credentials
    if (
      adminCredentials.username.trim() === "rootp1" &&
      adminCredentials.password === "iitr"
    ) {
      localStorage.setItem("userType", "admin")
      router.push("/admin")
    } else {
      alert("Invalid admin credentials")
      setAdminCredentials({ username: "", password: "" })
    }
  }

  if (!loginType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[350px] bg-black text-white">
          <CardHeader>
            <CardTitle>Choose Login Type</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={() => setLoginType("user")} className="bg-white text-black">
              Login as User
            </Button>
            <Button onClick={() => setLoginType("admin")} className="bg-white text-black">
              Login as Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px] bg-black text-white">
        <CardHeader>
          <CardTitle>{loginType === "user" ? "User Login" : "Admin Login"}</CardTitle>
        </CardHeader>
        <CardContent>
          {loginType === "user" ? (
            <div className="space-y-4">
              <Button onClick={handleGoogleLogin} className="w-full bg-white text-black">
                Login with Google
              </Button>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Input 
                type="text" 
                placeholder="Username" 
                required 
                value={adminCredentials.username}
                onChange={(e) => setAdminCredentials(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
              />
              <Input 
                type="password" 
                placeholder="Password" 
                required 
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
              />
              <Button type="submit" className="w-full bg-white text-black">
                Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
