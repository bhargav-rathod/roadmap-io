// dashboard/transaction-history/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { FiCreditCard, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function TransactionHistory() {
  const { data: session, update } = useSession();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500 py-4 text-center">No transactions yet.</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <FiCreditCard className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{tx.paymentPlan?.name || 'Credit Purchase'}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span className="font-medium">₹{tx.amount.toLocaleString('en-IN')}</span>
                    {getStatusIcon(tx.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    +{tx.credits} credits
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded text-sm ${page === p ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}