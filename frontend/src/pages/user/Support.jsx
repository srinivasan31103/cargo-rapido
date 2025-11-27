import { useState } from 'react';
import { HelpCircle, MessageSquare, Phone, Mail, Search, ChevronDown, ChevronUp, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      id: 1,
      question: 'How do I book a delivery?',
      answer: 'Click on "New Booking" from your dashboard, fill in the pickup and delivery details, select cargo size, and confirm. You can track your delivery in real-time once a driver is assigned.'
    },
    {
      id: 2,
      question: 'What are the charges for delivery?',
      answer: 'Charges are calculated based on distance, cargo size, and any additional services like express delivery or insurance. You can see the exact price before confirming your booking.'
    },
    {
      id: 3,
      question: 'How do I add money to my wallet?',
      answer: 'Go to the Wallet section and click "Add Money". Enter the amount (minimum ₹100) and complete the payment through our secure payment gateway.'
    },
    {
      id: 4,
      question: 'Can I cancel a booking?',
      answer: 'Yes, you can cancel a booking before the driver picks up your cargo. Cancellation charges may apply based on the booking status. Check "My Deliveries" to cancel.'
    },
    {
      id: 5,
      question: 'How do I track my delivery?',
      answer: 'Go to "My Deliveries", select your active booking, and click "Track". You can see real-time location of your driver and estimated delivery time.'
    },
    {
      id: 6,
      question: 'What if my cargo gets damaged?',
      answer: 'If you purchased insurance during booking, you can file a claim within 24 hours of delivery. Contact support with proof of damage and your booking ID.'
    },
    {
      id: 7,
      question: 'How do I contact my driver?',
      answer: 'Once a driver is assigned, you can call them directly from the booking details page. The contact information will be visible in your active delivery.'
    },
    {
      id: 8,
      question: 'What payment methods are accepted?',
      answer: 'We accept wallet payments, credit/debit cards, UPI, and net banking. All payments are processed securely through our payment gateway.'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'booking', label: 'Booking Issue' },
    { value: 'payment', label: 'Payment Problem' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'feedback', label: 'Feedback' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/support/tickets', ticketData);
      toast.success('Support ticket created successfully! We\'ll respond within 24 hours.');
      setShowTicketForm(false);
      setTicketData({ subject: '', category: 'general', priority: 'medium', message: '' });
    } catch (error) {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cr-dark">Support & Help Center</h1>
        <p className="text-primary-700 mt-2">Find answers or contact our support team</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowTicketForm(true)}
          className="card hover:shadow-lg transition-shadow bg-gradient-dark text-white"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold">Create Ticket</h3>
              <p className="text-sm text-primary-200">Get help from support team</p>
            </div>
          </div>
        </button>

        <a href="tel:+911234567890" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Phone size={24} className="text-cr-dark" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cr-dark">Call Us</h3>
              <p className="text-sm text-primary-700">+91 123 456 7890</p>
            </div>
          </div>
        </a>

        <a href="mailto:support@cargorapido.com" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Mail size={24} className="text-cr-dark" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cr-dark">Email Us</h3>
              <p className="text-sm text-primary-700">support@cargorapido.com</p>
            </div>
          </div>
        </a>
      </div>

      {/* FAQs Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cr-dark flex items-center gap-2">
            <HelpCircle className="text-primary-700" />
            Frequently Asked Questions
          </h2>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-700" size={20} />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-primary-50 transition-colors"
              >
                <span className="font-semibold text-left text-cr-dark">{faq.question}</span>
                {expandedFaq === faq.id ? (
                  <ChevronUp className="text-primary-700 flex-shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-primary-700 flex-shrink-0" size={20} />
                )}
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4 pt-2 bg-primary-50 text-primary-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <p className="text-center text-primary-700 py-8">No FAQs found matching your search.</p>
          )}
        </div>
      </div>

      {/* Support Ticket Form Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl font-bold text-cr-dark">Create Support Ticket</h2>
            </div>

            <form onSubmit={handleSubmitTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketData.subject}
                  onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                  className="input-field"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Category *</label>
                  <select
                    value={ticketData.category}
                    onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                    className="input-field"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Priority *</label>
                  <select
                    value={ticketData.priority}
                    onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
                    className="input-field"
                  >
                    {priorities.map(pri => (
                      <option key={pri.value} value={pri.value}>{pri.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Message *</label>
                <textarea
                  required
                  value={ticketData.message}
                  onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                  className="input-field"
                  rows={6}
                  placeholder="Describe your issue in detail..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTicketForm(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
