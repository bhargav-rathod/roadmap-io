'use client'

import { FiX } from 'react-icons/fi'
import TransactionHistory from '../../transaction-history/page'

interface TransactionHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TransactionHistoryModal({
  isOpen,
  onClose
}: TransactionHistoryModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      {/* Main container with rounded corners */}
      <div className="bg-white w-full max-w-2xl max-h-[80vh] flex flex-col rounded-lg shadow-xl overflow-hidden">
        {/* Header with border radius only on top */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        {/* Warning banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Recent transactions or updates may take some time to reflect here.
              </p>
            </div>
          </div>
        </div>
        <span>
          <br/>
        </span>
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="pb-6">
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  )
}