// dashboard/components/Layout/ProfileModal.tsx
'use client'

import { FiX } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { useEmulation } from '@/components/EmulationProvider'


interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: session } = useSession();
  const { emulatedUser } = useEmulation();
  const user = emulatedUser || session?.user;
  
  // Generate avatar initials
  const firstLetter = user?.name?.charAt(0).toUpperCase() || ''
  const nameParts = user?.name?.split(' ') || []
  const secondLetter = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : ''
  const avatarUrl = `https://ui-avatars.com/api/?name=${firstLetter}+${secondLetter}&background=818cf8&color=fff&size=128`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg w-full max-w-md flex flex-col shadow-xl overflow-hidden">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          {/* Large Avatar using UI Avatars API */}
          <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center mb-6 overflow-hidden">
            <img
              src={avatarUrl}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Details */}
          <div className="w-full space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg font-semibold">{user?.name || 'Not provided'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg">{user?.email || 'Not provided'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Account Status</p>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-lg">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}