'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Sidebar from './components/layout/Sidebar'
import PaymentModal from './components/layout/PaymentModal'
import TransactionHistoryModal from './components/layout/TransactionHistoryModal'
import Loaders from './components/layout/Loaders'
import MaintenanceBanner from './components/layout/MaintenanceBanner'
import Header from './components/layout/Header'
import { paymentPlans } from '../data/paymentConfig'
import SupportModal from './components/layout/SupportModal'
import HelpModal from './components/layout/HelpModal'
import ProfileModal from './components/layout/ProfileModal'
import AboutModal from './components/layout/AboutModal'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showRoadmapLoader, setShowRoadmapLoader] = useState(false)
  const [showClassicLoader, setShowClassicLoader] = useState(false)
  const [roadmapTitle, setRoadmapTitle] = useState('')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(paymentPlans[0])
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false)

  const { data: session, update } = useSession()
  const credits = session?.user?.credits ?? 0
  const pathname = usePathname()

  // Polling for credit updates
  useEffect(() => {
    const interval = setInterval(() => {
      update()
    }, 900000)
    return () => clearInterval(interval)
  }, [update])

  // Payment handler
  const handlePayment = async (planId: string) => {
    const plan = paymentPlans.find(p => p.id === planId)
    if (!plan || !session?.user) return

    setShowClassicLoader(true)

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          userId: session.user.id
        })
      })

      if (!response.ok) throw new Error(await response.text())
      const options = await response.json()

      if (!(window as any).Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => initializeRazorpay(options)
        document.body.appendChild(script)
      } else {
        initializeRazorpay(options)
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
      setShowClassicLoader(false)
    }
  }

  const initializeRazorpay = (options: any) => {
    try {
      const rzp = new (window as any).Razorpay({
        ...options,
        handler: async function (response: any) {
          await update()
          toast.success('Payment successful! Credits added or will be added shortly.')
          setShowPaymentModal(false)
          setShowClassicLoader(false)
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment was canceled.')
            setShowPaymentModal(false)
            setShowClassicLoader(false)
          }
        }
      })
      rzp.open()
    } catch (error) {
      console.error('Razorpay initialization error:', error)
      toast.error('Failed to initialize payment gateway.')
      setShowClassicLoader(false)
    }
  }

  // Check for successful payments
  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    if (query.get('payment') === 'success') {
      toast.success('Payment successful! Credits added to your account.')
      update()
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (query.get('payment') === 'canceled') {
      toast.error('Payment was canceled.')
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [update])

  // Fetch roadmap title
  useEffect(() => {
    const fetchRoadmapTitle = async () => {
      const paths = pathname.split('/').filter(path => path)
      const isRoadmapPage = paths.length >= 2
      if (isRoadmapPage) {
        const roadmapId = paths[paths.indexOf('roadmaps') + 2]
        try {
          const response = await fetch(`/api/roadmaps/title?id=${roadmapId}`)
          if (response.ok) {
            const data = await response.json()
            setRoadmapTitle(data.title)
          } else {
            setRoadmapTitle('')
          }
        } catch (error) {
          setRoadmapTitle('')
        }
      } else {
        setRoadmapTitle('')
      }
    }

    fetchRoadmapTitle()
  }, [pathname])

  return (
    <div className="min-h-screen h-screen flex relative">
      <Toaster position="top-center" />

      <Loaders
        showRoadmapLoader={showRoadmapLoader}
        showClassicLoader={showClassicLoader}
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          credits={credits}
          onPaymentClick={() => setShowPaymentModal(true)}
          onTransactionHistoryClick={() => setShowTransactions(true)}
          onBuyCreditsClick={() => setShowPaymentModal(true)}
          onSupportClick={() => setShowSupportModal(true)}
          onHelpClick={() => setShowHelpModal(true)}
          onProfileClick={() => setShowProfileModal(true)}
          onAboutClick={() => setShowAboutModal(true)}
          roadmapTitle={roadmapTitle}
        />

        <MaintenanceBanner />

        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />

        <PaymentModal
          isOpen={showPaymentModal}
          selectedPlan={selectedPlan as any}
          paymentPlans={paymentPlans as any}
          onClose={() => setShowPaymentModal(false)}
          onPlanSelect={setSelectedPlan as any}
          onPayment={handlePayment}
        />

        <TransactionHistoryModal
          isOpen={showTransactions}
          onClose={() => setShowTransactions(false)}
        />

        <SupportModal
          isOpen={showSupportModal}
          onClose={() => setShowSupportModal(false)}
        />

        <HelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />

        <AboutModal
          isOpen={showAboutModal}
          onClose={() => setShowAboutModal(false)}
        />

        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="w-full max-w-full xl:max-w-[1600px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  )
}