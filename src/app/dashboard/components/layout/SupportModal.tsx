// dashboard/components/Layout/SupportModal.tsx
'use client'

import { FiX, FiMail } from 'react-icons/fi'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Support</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
              <FiMail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-700 mb-4">
                We're happy to assist you. Kindly share all your queries, issues 
                with snapshots or any relevant information by emailing us at:
              </p>
              <a 
                href="mailto:support@roadmap.io" 
                className="text-blue-600 hover:text-blue-800 font-medium break-all"
              >
                support@roadmap.io
              </a>
              <p className="text-gray-700 mt-4">
                We'll investigate and resolve your issue as soon as possible.
              </p>
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