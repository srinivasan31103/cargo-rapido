import { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { paymentAPI } from '../../utils/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Wallet() {
  const { user, updateUser } = useAuthStore();
  const [balance, setBalance] = useState(user?.wallet?.balance || 0);
  const [transactions, setTransactions] = useState([]);
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await paymentAPI.getBalance();
      setBalance(response.data.data.balance);
      updateUser({ wallet: response.data.data });
    } catch (error) {
      console.error('Failed to fetch balance');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await paymentAPI.getTransactions();
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch transactions');
    }
  };

  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount);
    if (amount < 100) {
      toast.error('Minimum recharge amount is ₹100');
      return;
    }

    setLoading(true);
    try {
      // Create Razorpay order
      const orderResponse = await paymentAPI.rechargeWallet({ amount });
      const { orderId, keyId } = orderResponse.data.data;

      // Razorpay payment integration
      const options = {
        key: keyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'CargoRapido',
        description: 'Wallet Recharge',
        order_id: orderId,
        handler: async (response) => {
          try {
            await paymentAPI.verifyRecharge({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount
            });
            toast.success('Wallet recharged successfully!');
            setShowRecharge(false);
            setRechargeAmount('');
            fetchBalance();
            fetchTransactions();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        }
      };

      // Note: In production, load Razorpay script dynamically
      // const rzp = new window.Razorpay(options);
      // rzp.open();

      // For demo, just show success
      toast.info('Razorpay integration - Add Razorpay script in production');
      setShowRecharge(false);
    } catch (error) {
      toast.error('Failed to initiate recharge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-cr-dark">Wallet</h1>

      {/* Balance Card */}
      <div className="card bg-gradient-dark text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-200">Available Balance</p>
            <p className="text-4xl font-bold mt-2">₹{balance.toFixed(2)}</p>
            <p className="text-sm text-primary-200 mt-2">
              Cashback: ₹{user?.wallet?.cashback || 0}
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <WalletIcon size={32} />
          </div>
        </div>
        <button
          onClick={() => setShowRecharge(true)}
          className="mt-6 w-full bg-white text-cr-dark py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
        >
          <Plus size={20} className="inline mr-2" />
          Add Money
        </button>
      </div>

      {/* Recharge Modal */}
      {showRecharge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-[61]">
            <h3 className="text-xl font-semibold text-cr-dark mb-4">Recharge Wallet</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Enter Amount
                </label>
                <input
                  type="number"
                  min="100"
                  className="input"
                  placeholder="Minimum ₹100"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRecharge(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecharge}
                  disabled={loading || !rechargeAmount}
                  className="btn btn-primary flex-1"
                >
                  {loading ? 'Processing...' : 'Proceed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-cr-dark mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-center text-primary-700 py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div
                key={txn._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {txn.type.includes('recharge') || txn.type.includes('refund') ? (
                    <ArrowUpCircle className="text-green-600" size={24} />
                  ) : (
                    <ArrowDownCircle className="text-red-600" size={24} />
                  )}
                  <div>
                    <p className="font-medium">{txn.type.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-sm text-primary-700">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      txn.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
                  </p>
                  <span className={`text-xs badge badge-${txn.status === 'completed' ? 'success' : 'warning'}`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
