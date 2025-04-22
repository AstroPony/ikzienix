'use client'

import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: ''
  })
  const [isEditing, setIsEditing] = useState(false)

  if (status === 'loading') {
    return <div className="container py-12">Loading...</div>
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the address to your database
    setIsEditing(false)
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {session.user?.name}</p>
            <p><span className="font-medium">Email:</span> {session.user?.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Delivery Address</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-black hover:text-gray-600"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
              >
                Save Address
              </button>
            </form>
          ) : (
            <div className="space-y-2">
              {address.street ? (
                <>
                  <p>{address.street}</p>
                  <p>{address.city}, {address.postalCode}</p>
                  <p>{address.country}</p>
                </>
              ) : (
                <p className="text-gray-500">No delivery address saved yet.</p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
} 