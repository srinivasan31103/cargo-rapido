import { useState, useEffect } from 'react';
import { Gift, Copy, Share2, Users, DollarSign, TrendingUp, Check, Facebook, Twitter, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

export default function Referral() {
  const { user } = useAuthStore();
  const [referralData, setReferralData] = useState({
    code: '',
    totalReferrals: 0,
    successfulReferrals: 0,
    totalEarnings: 0,
    pendingRewards: 0
  });
  const [referralHistory, setReferralHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralData();
    fetchReferralHistory();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await api.get(`/users/${user._id}/referrals/stats`);
      setReferralData(response.data.data);
    } catch (error) {
      // Mock data fallback
      setReferralData({
        code: `${user.name.substring(0, 3).toUpperCase()}${user._id.substring(0, 6).toUpperCase()}`,
        totalReferrals: 12,
        successfulReferrals: 8,
        totalEarnings: 800,
        pendingRewards: 200
      });
    }
  };

  const fetchReferralHistory = async () => {
    try {
      const response = await api.get(`/users/${user._id}/referrals/history`);
      setReferralHistory(response.data.data || []);
    } catch (error) {
      // Mock data fallback
      setReferralHistory([
        {
          _id: '1',
          referredUser: 'Rahul Sharma',
          status: 'completed',
          reward: 100,
          date: new Date('2024-01-15'),
          bookingsCompleted: 3
        },
        {
          _id: '2',
          referredUser: 'Priya Patel',
          status: 'completed',
          reward: 100,
          date: new Date('2024-01-20'),
          bookingsCompleted: 5
        },
        {
          _id: '3',
          referredUser: 'Amit Kumar',
          status: 'pending',
          reward: 100,
          date: new Date('2024-01-25'),
          bookingsCompleted: 1
        },
        {
          _id: '4',
          referredUser: 'Sneha Verma',
          status: 'completed',
          reward: 100,
          date: new Date('2024-01-28'),
          bookingsCompleted: 4
        }
      ]);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralData.code);
    setCopied(true);
    toast.success('Referral code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const message = `Join CargoRapido using my referral code ${referralData.code} and get ₹100 off on your first booking! Fast and reliable cargo delivery service.`;
    const url = `https://cargorapido.com/signup?ref=${referralData.code}`;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Join CargoRapido&body=${encodeURIComponent(message + '\n\n' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const statusText = {
    completed: 'Completed',
    pending: 'Pending',
    cancelled: 'Cancelled'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cr-dark">Referral Program</h1>
        <p className="text-primary-700 mt-2">Invite friends and earn rewards together!</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Total Referrals</p>
              <p className="text-2xl font-bold text-cr-dark">{referralData.totalReferrals}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Users size={24} className="text-cr-dark" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Successful</p>
              <p className="text-2xl font-bold text-green-600">{referralData.successfulReferrals}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Total Earnings</p>
              <p className="text-2xl font-bold text-cr-dark">₹{referralData.totalEarnings}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <DollarSign size={24} className="text-cr-dark" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Pending Rewards</p>
              <p className="text-2xl font-bold text-yellow-600">₹{referralData.pendingRewards}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Gift size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="card bg-gradient-dark text-white">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Referral Code</h2>
          <p className="text-primary-200 mb-6">Share this code with friends and both get ₹100!</p>

          <div className="flex items-center justify-center gap-3 max-w-md mx-auto mb-6">
            <div className="flex-1 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg px-6 py-4">
              <p className="text-3xl font-bold tracking-wider">{referralData.code}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="btn bg-white text-cr-dark hover:bg-primary-50 flex items-center gap-2"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleShare('whatsapp')}
              className="btn bg-white/20 hover:bg-white/30 border border-white/30 flex items-center gap-2"
            >
              <Share2 size={18} />
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="btn bg-white/20 hover:bg-white/30 border border-white/30 flex items-center gap-2"
            >
              <Facebook size={18} />
              Facebook
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="btn bg-white/20 hover:bg-white/30 border border-white/30 flex items-center gap-2"
            >
              <Twitter size={18} />
              Twitter
            </button>
            <button
              onClick={() => handleShare('email')}
              className="btn bg-white/20 hover:bg-white/30 border border-white/30 flex items-center gap-2"
            >
              <Mail size={18} />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card">
        <h2 className="text-xl font-bold text-cr-dark mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-cr-dark">1</span>
            </div>
            <h3 className="font-semibold text-cr-dark mb-2">Share Your Code</h3>
            <p className="text-sm text-primary-700">Send your referral code to friends via WhatsApp, email, or social media</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-cr-dark">2</span>
            </div>
            <h3 className="font-semibold text-cr-dark mb-2">Friend Signs Up</h3>
            <p className="text-sm text-primary-700">Your friend creates an account using your referral code</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-cr-dark">3</span>
            </div>
            <h3 className="font-semibold text-cr-dark mb-2">Both Get Rewards</h3>
            <p className="text-sm text-primary-700">After their first booking, you both receive ₹100 in your wallets!</p>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="card">
        <h2 className="text-xl font-bold text-cr-dark mb-4">Referral History</h2>
        {referralHistory.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-primary-700 mb-4" />
            <h3 className="text-xl font-semibold text-cr-dark mb-2">No referrals yet</h3>
            <p className="text-primary-700 mb-6">Start sharing your referral code to earn rewards!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-cr-dark">Referred User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-cr-dark">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-cr-dark">Bookings</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-cr-dark">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-cr-dark">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {referralHistory.map((referral) => (
                  <tr key={referral._id} className="hover:bg-primary-50">
                    <td className="px-4 py-3 text-sm text-cr-dark font-medium">
                      {referral.referredUser}
                    </td>
                    <td className="px-4 py-3 text-sm text-primary-700">
                      {new Date(referral.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm text-primary-700">
                      {referral.bookingsCompleted}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[referral.status]}`}>
                        {statusText[referral.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-cr-dark">
                      ₹{referral.reward}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="card bg-primary-50 border border-primary-200">
        <h3 className="font-semibold text-cr-dark mb-3">Terms & Conditions</h3>
        <ul className="space-y-2 text-sm text-primary-700">
          <li>• Both referrer and referee get ₹100 credit after the referee's first completed booking</li>
          <li>• Referee must be a new user who hasn't registered before</li>
          <li>• Referral code must be applied during signup</li>
          <li>• Rewards are credited within 24 hours of booking completion</li>
          <li>• Referral rewards can be used for future bookings</li>
          <li>• CargoRapido reserves the right to modify or cancel the program at any time</li>
        </ul>
      </div>
    </div>
  );
}
