// dashboard/components/Layout/HelpModal.tsx
'use client'

import { useEffect, useState } from 'react'
import { FiX, FiChevronRight, FiChevronLeft, FiCheck } from 'react-icons/fi'

const helpSteps = [
  {
    title: "Open Side Panel",
    content: "Click the menu icon (☰) in the top-left to open the side panel where you can view and manage your roadmaps.",
    selector: ".sidebar-toggle" // Add this class to your menu button
  },
  {
    title: "Create New Roadmap",
    content: "Click 'Create New Roadmap' button in the side panel to start the creation process.",
    selector: ".create-roadmap-btn"
  },
  {
    title: "Fill Roadmap Details",
    content: "Complete the form with your roadmap title, description, and target audience.",
    selector: ".roadmap-form"
  },
  {
    title: "Generate Roadmap",
    content: "Click 'Generate Roadmap' button after filling the form to create your customized roadmap.",
    selector: ".generate-roadmap-btn"
  },
  {
    title: "Manage Credits",
    content: "Click the credits counter in the top-right to purchase more credits when needed.",
    selector: ".credits-counter"
  },
  {
    title: "Buy Credits",
    content: "Select a payment plan and complete the payment to add credits to your account.",
    selector: ".payment-plans"
  }
]

export default function HelpModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  
    // Clean up highlights when modal closes or changes step
    useEffect(() => {
      return () => {
        removeHighlight()
      }
    }, [])
  
    useEffect(() => {
      // Remove highlight when step changes
      removeHighlight()
    }, [currentStep])
  
    const removeHighlight = () => {
      if (highlightedElement) {
        highlightedElement.classList.remove(
          'relative',
          'z-[99999]',
          'ring-4',
          'ring-yellow-400',
          'transform',
          'scale-105',
          'transition-all',
          'duration-300',
          'shadow-xl'
        )
        highlightedElement.style.animation = ''
        setHighlightedElement(null)
      }
    }
  
    const highlightElement = () => {
      // Remove previous highlight first
      removeHighlight()
  
      const element = document.querySelector(helpSteps[currentStep].selector) as HTMLElement
      if (element) {
        setHighlightedElement(element)
        // Scroll to element smoothly
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Add highlight classes
        element.classList.add(
          'relative',
          'z-[99999]',
          'ring-4',
          'ring-yellow-400',
          'transform',
          'scale-105',
          'transition-all',
          'duration-300',
          'shadow-xl'
        )
        
        // Add pulsing animation
        element.style.animation = 'pulse 2s infinite'
      }
    }
  
    const nextStep = () => {
      if (currentStep < helpSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  
    const prevStep = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1)
      }
    }
  
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[9999]">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Help Guide</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-blue-600">{helpSteps[currentStep].title}</h3>
              <p className="text-gray-700 mt-2">{helpSteps[currentStep].content}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-md ${currentStep === 0 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <FiChevronLeft className="inline mr-1" /> Previous
              </button>
              
              {/* <button
                onClick={highlightElement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Show Me
              </button> */}
              
              <button
                onClick={nextStep}
                disabled={currentStep === helpSteps.length - 1}
                className={`px-4 py-2 rounded-md ${currentStep === helpSteps.length - 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                Next <FiChevronRight className="inline ml-1" />
              </button>
            </div>
          </div>
          
          <div className="border-t px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {helpSteps.length}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FiCheck className="mr-2" /> Got It
            </button>
          </div>
        </div>
      </div>
    )
  }