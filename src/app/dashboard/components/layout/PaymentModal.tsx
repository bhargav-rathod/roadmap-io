'use client'

import { PaymentPlan } from '@prisma/client'
import { FiX, FiCheck, FiZap } from 'react-icons/fi'

interface PaymentModalProps {
  isOpen: boolean
  selectedPlan: PaymentPlan
  paymentPlans: PaymentPlan[]
  onClose: () => void
  onPlanSelect: (plan: PaymentPlan) => void
  onPayment: (planId: string) => void
}

export default function PaymentModal({
  isOpen,
  selectedPlan,
  paymentPlans,
  onClose,
  onPlanSelect,
  onPayment
}: PaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Buy Credits</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {paymentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPlan.id === plan.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onPlanSelect(plan)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{plan.name}</h4>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{plan.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    ₹{(plan.price / plan.credits).toFixed(0)} per credit
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-blue-800 mb-2">You'll get:</h4>
          <div className="flex items-center space-x-2">
            <FiZap className="text-yellow-500" />
            <span className="font-bold">{selectedPlan.credits} Credits</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onPayment(selectedPlan.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FiCheck className="mr-2" />
            Pay ₹{selectedPlan.price.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  )
}