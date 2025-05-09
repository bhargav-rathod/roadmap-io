'use client'

import { useState, useEffect } from 'react';
import { 
  FiCreditCard, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiHash,
  FiPackage,
  FiCreditCard as FiPayment,
  FiCalendar,
  FiRefreshCw
} from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  amount: number;
  credits: number;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  razorpayOrderId?: string;
  paymentPlan?: {
    name: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  currency: string;
}

export default function TransactionHistory() {
  const { data: session, update } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session?.user?.id) return;
      
      setLoading(true);
      try {
        const res = await fetch(`/api/transactions?page=${page}`);
        if (!res.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await res.json();
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        console.error('Failed to fetch transactions:', error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [session?.user?.id, page]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'failed':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-yellow-500" />;
    }
  };

  const toggleExpand = (txId: string) => {
    setExpandedTxId(expandedTxId === txId ? null : txId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500 py-4 text-center">No transactions yet.</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="border rounded-lg overflow-hidden transition-all duration-200 bg-white"
            >
              <div 
                className="flex justify-between items-start p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(tx.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <FiCreditCard className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{tx.paymentPlan?.name || 'Credit Purchase'}</h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(tx.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="font-medium">₹{tx.amount.toLocaleString('en-IN')}</span>
                      {getStatusIcon(tx.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      +{tx.credits} credits
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    {expandedTxId === tx.id ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
              </div>

              {expandedTxId === tx.id && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FiHash className="text-gray-400" />
                      <span className="font-medium">Transaction ID:</span>
                      <span className="text-gray-600">{tx.transactionId || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiPayment className="text-gray-400" />
                      <span className="font-medium">Payment Method:</span>
                      <span className="text-gray-600 capitalize">{tx.paymentMethod || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiPackage className="text-gray-400" />
                      <span className="font-medium">Plan:</span>
                      <span className="text-gray-600">{tx.paymentPlan?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiDollarSign className="text-gray-400" />
                      <span className="font-medium">Currency:</span>
                      <span className="text-gray-600">{tx.currency || 'INR'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-gray-400" />
                      <span className="font-medium">Initiated:</span>
                      <span className="text-gray-600">{formatDate(tx.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiRefreshCw className="text-gray-400" />
                      <span className="font-medium">Status:</span>
                      <span className="text-gray-600 capitalize">{tx.status}</span>
                    </div>
                    {tx.razorpayOrderId && (
                      <div className="flex items-center space-x-2">
                        <FiHash className="text-gray-400" />
                        <span className="font-medium">Razorpay ID:</span>
                        <span className="text-gray-600">{tx.razorpayOrderId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2 pb-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded text-sm ${page === p ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}