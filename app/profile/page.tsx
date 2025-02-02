"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AccessControl from "../components/AccessControl"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, updateProfile } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    hostel: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get Firestore user data
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()
        
        setProfile({
          name: user.displayName || "",
          email: user.email || "",
          username: userData?.username || "",
          hostel: userData?.hostel || "",
        })
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (auth.currentUser) {
        // Update Firebase auth profile
        await updateProfile(auth.currentUser, {
          displayName: profile.name,
        })

        // Update Firestore user document
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          username: profile.username,
          hostel: profile.hostel,
          email: profile.email,
          lastUpdated: new Date(),
        }, { merge: true })

        // Refresh data
        const updatedUser = auth.currentUser
        setProfile({
          name: updatedUser.displayName || "",
          email: updatedUser.email || "",
          username: profile.username,
          hostel: profile.hostel,
        })
        
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <AccessControl allowedUserTypes={["user"]}>
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-white">User Profile</h1>
          <Card className="bg-black text-white">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-white">Name</label>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    required
                    className="bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-white">Email</label>
                  <Input 
                    name="email" 
                    value={profile.email} 
                    readOnly 
                    className="bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-white">Username</label>
                  <Input
                    name="username"
                    value={profile.username}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    required
                    className="bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-white">Hostel</label>
                  <Input
                    name="hostel"
                    value={profile.hostel}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    required
                    className="bg-gray-800 text-white"
                  />
                </div>
                {isEditing ? (
                  <Button type="submit" disabled={loading} className="bg-white text-black">
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)} className="bg-white text-black">
                    Edit Profile
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </AccessControl>
  )
}
