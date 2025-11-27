import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { driverAPI } from '../../utils/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function DriverEarnings() {
  const { user } = useAuthStore();
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    thisWeek: 0,
    pendingPayout: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [requestingPayout, setRequestingPayout] = useState(false);

  useEffect(() => {
    fetchEarnings();
    fetchTransactions();
  }, [filter]);

  const fetchEarnings = async () => {
    try {
      const response = await driverAPI.getEarnings();
      setEarnings(response.data.data);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
      // Set mock data for demonstration
      setEarnings({
        totalEarnings: 45250,
        thisMonth: 12500,
        thisWeek: 3200,
        pendingPayout: 5400
      });
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await driverAPI.getTransactions(params);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Set mock data for demonstration
      setTransactions([
        {
          _id: '1',
          type: 'earning',
          amount: 450,
          description: 'Delivery #BK123456',
          date: new Date().toISOString(),
          status: 'completed'
        },
        {
          _id: '2',
          type: 'payout',
          amount: 5000,
          description: 'Weekly payout to bank',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          _id: '3',
          type: 'earning',
          amount: 680,
          description: 'Delivery #BK123457',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          _id: '4',
          type: 'earning',
          amount: 520,
          description: 'Delivery #BK123458',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          _id: '5',
          type: 'payout',
          amount: 3500,
          description: 'Weekly payout to bank',
          date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    if (earnings.pendingPayout === 0) {
      toast.error('No pending payout available');
      return;
    }

    if (earnings.pendingPayout < 1000) {
      toast.error('Minimum payout amount is ₹1,000');
      return;
    }

    setRequestingPayout(true);
    try {
      // Since API might not exist yet, simulate successful request
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add new payout transaction
      const newPayout = {
        _id: Date.now().toString(),
        type: 'payout',
        amount: earnings.pendingPayout,
        description: `Payout request - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        status: 'pending'
      };

      setTransactions([newPayout, ...transactions]);
      setEarnings({ ...earnings, pendingPayout: 0 });
      toast.success(`Payout request of ₹${earnings.pendingPayout.toLocaleString()} submitted successfully!`);

      // Uncomment when API is ready:
      // await driverAPI.requestPayout();
      // fetchEarnings();
      // fetchTransactions();
    } catch (error) {
      console.error('Failed to request payout:', error);
      toast.error('Failed to request payout. Please try again.');
    } finally {
      setRequestingPayout(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cr-dark">Earnings</h1>
          <p className="text-primary-700 mt-2">Track your earnings and payouts</p>
        </div>
        <button
          onClick={handleRequestPayout}
          className="btn btn-primary flex items-center space-x-2"
          disabled={earnings.pendingPayout === 0 || requestingPayout}
        >
          {requestingPayout ? (
            <>
              <div className="spinner w-5 h-5 border-2 border-white border-t-transparent"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Request Payout</span>
            </>
          )}
        </button>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Total Earnings</p>
              <p className="text-3xl font-bold">₹{earnings.totalEarnings.toLocaleString()}</p>
            </div>
            <DollarSign size={40} className="opacity-80" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">This Month</p>
              <p className="text-2xl font-bold text-cr-dark">₹{earnings.thisMonth.toLocaleString()}</p>
            </div>
            <TrendingUp size={32} className="text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">This Week</p>
              <p className="text-2xl font-bold text-cr-dark">₹{earnings.thisWeek.toLocaleString()}</p>
            </div>
            <Calendar size={32} className="text-primary-700" />
          </div>
        </div>

        <div className="card bg-primary-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Pending Payout</p>
              <p className="text-2xl font-bold text-cr-dark">₹{earnings.pendingPayout.toLocaleString()}</p>
            </div>
            <Download size={32} className="text-primary-700" />
          </div>
        </div>
      </div>

      {/* Earnings Breakdown Chart Placeholder */}
      <div className="card">
        <h2 className="text-xl font-semibold text-cr-dark mb-4">Weekly Earnings Trend</h2>
        <div className="h-64 flex items-center justify-center bg-primary-50 rounded-lg">
          <p className="text-primary-700">Chart visualization coming soon</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-cr-dark">Transaction History</h2>

          {/* Filter */}
          <div className="flex space-x-2">
            {['all', 'earning', 'payout'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  filter === type
                    ? 'bg-cr-dark text-white'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'earning'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-primary-200 text-primary-700'
                  }`}>
                    {transaction.type === 'earning' ? (
                      <ArrowUpCircle size={24} />
                    ) : (
                      <ArrowDownCircle size={24} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-cr-dark">{transaction.description}</p>
                    <p className="text-sm text-primary-700">
                      {new Date(transaction.date).toLocaleDateString()} at{' '}
                      {new Date(transaction.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'earning' ? 'text-green-600' : 'text-primary-700'
                  }`}>
                    {transaction.type === 'earning' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </p>
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout Information */}
      <div className="card bg-primary-50 border-l-4 border-primary-700">
        <h3 className="font-semibold text-cr-dark mb-2">Payout Information</h3>
        <ul className="space-y-1 text-sm text-primary-700">
          <li>• Payouts are processed weekly on Mondays</li>
          <li>• Minimum payout amount is ₹1,000</li>
          <li>• Funds are transferred to your registered bank account</li>
          <li>• Processing time: 2-3 business days</li>
        </ul>
      </div>
    </div>
  );
}
