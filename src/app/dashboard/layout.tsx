// dashboard/layout.tsx

'use client'

import { SessionProvider, useSession } from 'next-auth/react';
import UserMenu from "@/components/ui/UserMenu";
import RoadmapSidebar from "@/components/roadmap/RoadmapSidebar";
import { useState, useEffect } from 'react';
import { FiZap, FiMenu, FiChevronRight, FiHome, FiX, FiCheck } from 'react-icons/fi';
import { maintenanceBannerConfig } from '../data/maintenanceBanner';
import CreatingRoadmapLoader from '@/components/roadmap/CreatingRoadmapLoader';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { paymentPlans } from '../data/paymentConfig';
import toast, { Toaster } from 'react-hot-toast';
import ClassicLoader from '@/components/ui/ClassicLoader';
import TransactionHistory from './transaction-history/page';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showRoadmapLoader, setShowRoadmapLoader] = useState(false);
  const [showClassicLoader, setShowClassicLoader] = useState(false);
  const [roadmapTitle, setRoadmapTitle] = useState('');
  const { data: session, update } = useSession();
  const credits = session?.user?.credits ?? 0;
  const pathname = usePathname();

  const [showTransactions, setShowTransactions] = useState(false);


  // Add polling to check for credit updates
  useEffect(() => {
    const interval = setInterval(() => {
      update(); // Refresh session every 900 seconds (15 Minutes)
    }, 900000);

    return () => clearInterval(interval);
  }, [update]);

  /* SECTION: PAYMENT */
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(paymentPlans[0]);

  const handlePayment = async (planId: string) => {
    const plan = paymentPlans.find(p => p.id === planId);
    if (!plan || !session?.user) return;

    setShowClassicLoader(true);

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
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const options = await response.json();

      // Check if Razorpay is already loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => initializeRazorpay(options);
        document.body.appendChild(script);
      } else {
        initializeRazorpay(options);
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setShowClassicLoader(false);
    }
  };

  const initializeRazorpay = (options: any) => {
    try {
      const rzp = new (window as any).Razorpay({
        ...options,
        handler: async function (response: any) {
          await update();
          toast.success('Payment successful! Credits added or will be added shortly.');
          setShowPaymentModal(false);
          setShowClassicLoader(false);
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment was canceled.');
            setShowPaymentModal(false);
            setShowClassicLoader(false);
          }
        }
      });
      rzp.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      toast.error('Failed to initialize payment gateway.');
      setShowClassicLoader(false);
    }
  };

  // Check for successful payments
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment') === 'success') {
      toast.success('Payment successful! Credits added to your account.');
      update(); // Refresh session to update credits
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (query.get('payment') === 'canceled') {
      toast.error('Payment was canceled.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [update]);

  // Fetch roadmap title when on a roadmap page
  useEffect(() => {
    const fetchRoadmapTitle = async () => {
      const paths = pathname.split('/').filter(path => path);
      const isRoadmapPage = paths.length >= 2;
      if (isRoadmapPage) {
        const roadmapId = paths[paths.indexOf('roadmaps') + 2];
        try {
          const response = await fetch(`/api/roadmaps/title?id=${roadmapId}`);
          if (response.ok) {
            const data = await response.json();
            setRoadmapTitle(data.title);
          } else {
            console.error('Failed to fetch roadmap title');
            setRoadmapTitle('');
          }
        } catch (error) {
          console.error('Error fetching roadmap title:', error);
          setRoadmapTitle('');
        }
      } else {
        setRoadmapTitle('');
      }
    };

    fetchRoadmapTitle();
  }, [pathname]);

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(path => path);
    const breadcrumbs = [];

    // Always add Dashboard as the first breadcrumb
    breadcrumbs.push({
      href: '/dashboard',
      name: 'Dashboard',
      icon: <FiHome className="mr-1" />
    });

    // Check if we're on a roadmap page
    const isRoadmapPage = paths.length >= 2;

    if (isRoadmapPage) {
      // Add current roadmap breadcrumb if title exists
      if (roadmapTitle) {
        breadcrumbs.push({
          href: '', // Empty href means it's not clickable
          name: roadmapTitle
        });
      }
    } else {
      // For other pages, add their path segments (skip dashboard)
      paths.slice(1).forEach((path, index) => {
        const href = `/dashboard/${paths.slice(1, index + 2).join('/')}`;
        const name = path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        breadcrumbs.push({ href, name });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleTransactionHistoryClick = () => {
    setShowTransactions(true);
  };

  return (
    <div className="min-h-screen h-screen flex relative">

      {/* Toaster for success/ failure payment message */}
      <Toaster position="top-center" />

      {/* Full-page Loader */}
      {showRoadmapLoader && <CreatingRoadmapLoader />}
      {showClassicLoader && <ClassicLoader />}

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-md">
            <RoadmapSidebar
              onClose={() => setSidebarOpen(false)}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <div className={`hidden lg:block ${sidebarOpen ? 'lg:w-[576px]' : 'lg:w-0'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out`}>
        <div className="h-full overflow-y-auto no-scrollbar">
          <RoadmapSidebar
            onClose={() => setSidebarOpen(false)}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <nav className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 mr-2"
                  >
                    <FiMenu className="h-6 w-6" />
                  </button>
                )}
                {/* Breadcrumb Navigation */}
                <div className="hidden sm:flex items-center text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                          {crumb.icon && crumb.icon}
                          {crumb.name}
                        </Link>
                      ) : (
                        <span className="text-gray-800 font-medium">
                          {crumb.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-auto">
                <div
                  className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium text-yellow-800 cursor-pointer hover:bg-yellow-200 transition-colors"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <FiZap className="mr-1" />
                  Credits: <span className="font-bold ml-1">{credits}</span>
                </div>
                <UserMenu onTransactionHistoryClick={handleTransactionHistoryClick}/>
              </div>
            </div>
          </div>
        </nav>

        {maintenanceBannerConfig.isEnabled && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {maintenanceBannerConfig.content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Section */}
        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Buy Credits</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {paymentPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPlan.id === plan.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    onClick={() => setSelectedPlan(plan)}
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
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePayment(selectedPlan.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FiCheck className="mr-2" />
                  Pay ₹{selectedPlan.price.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History Modal */}
        {showTransactions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Transaction History</h2>
                <button
                  onClick={() => setShowTransactions(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Recent transactions may take some time to reflect here.
                      </p>
                    </div>
                  </div>
                </div>
                <TransactionHistory />
              </div>
            </div>
          </div>
        )}


        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="w-full max-w-full xl:max-w-[1600px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
}