import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast Delivery',
      description: 'Get your packages delivered within hours, not days. Our AI-powered routing ensures the fastest delivery times.'
    },
    {
      icon: '📍',
      title: 'Real-Time Tracking',
      description: 'Track your delivery in real-time with live GPS updates. Know exactly where your package is, every second.'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No hidden fees. Get instant price estimates before booking. What you see is what you pay.'
    },
    {
      icon: '🔒',
      title: 'Secure & Safe',
      description: 'End-to-end encryption, verified drivers, and comprehensive insurance for your peace of mind.'
    },
    {
      icon: '📱',
      title: 'Easy to Use',
      description: 'Book a delivery in under 60 seconds. Simple, intuitive interface designed for everyone.'
    },
    {
      icon: '🎯',
      title: '24/7 Support',
      description: 'Round-the-clock customer support. We\'re always here to help, anytime, anywhere.'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Book Your Delivery',
      description: 'Enter pickup and drop locations, add cargo details, and get instant pricing.',
      icon: '📦'
    },
    {
      step: '2',
      title: 'Get Matched with Driver',
      description: 'Our smart algorithm finds the nearest available driver for you instantly.',
      icon: '🚗'
    },
    {
      step: '3',
      title: 'Track in Real-Time',
      description: 'Watch your delivery move on the map with live updates and driver details.',
      icon: '📍'
    },
    {
      step: '4',
      title: 'Receive & Verify',
      description: 'Driver delivers with photo proof, signature, and OTP verification.',
      icon: '✅'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Deliveries Completed' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '2K+', label: 'Verified Drivers' },
    { number: '4.8/5', label: 'Average Rating' }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      image: '👨‍💼',
      rating: 5,
      text: 'CargoRapido transformed our delivery operations. Fast, reliable, and cost-effective. Highly recommended!'
    },
    {
      name: 'Priya Sharma',
      role: 'E-commerce Seller',
      image: '👩‍💻',
      rating: 5,
      text: 'The real-time tracking and professional drivers make this the best logistics solution I\'ve used.'
    },
    {
      name: 'Amit Patel',
      role: 'Restaurant Owner',
      image: '👨‍🍳',
      rating: 5,
      text: 'Same-day delivery at affordable prices. Our customers love the speed and reliability!'
    }
  ];

  const pricingPlans = [
    {
      name: 'Pay Per Delivery',
      price: '₹50',
      period: 'Base Fare',
      description: 'Perfect for occasional deliveries',
      features: [
        'Real-time tracking',
        'Standard support',
        'Secure payments',
        'OTP verification',
        'Photo proof of delivery'
      ],
      popular: false,
      cta: 'Get Started'
    },
    {
      name: 'Business',
      price: '₹2,999',
      period: '/month',
      description: 'Best for growing businesses',
      features: [
        'Everything in Pay Per Delivery',
        'Priority support',
        'Bulk booking discount',
        'Dedicated account manager',
        'API access',
        'Advanced analytics',
        'Custom invoicing'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact Us',
      description: 'For large scale operations',
      features: [
        'Everything in Business',
        'Custom integrations',
        'White-label solution',
        'SLA guarantees',
        'Dedicated fleet option',
        'Custom pricing models',
        '24/7 phone support'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  return (
    <div className="min-h-screen bg-cr-white">
      {/* Navigation - Elegant grayscale */}
      <nav className="fixed top-0 w-full bg-cr-white/95 backdrop-blur-sm shadow-elegant z-50 border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🚚</span>
              <span className="text-2xl font-bold text-cr-dark">
                CargoRapido
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-primary-700 hover:text-cr-dark transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-primary-700 hover:text-cr-dark transition-colors font-medium">How It Works</a>
              <a href="#pricing" className="text-primary-700 hover:text-cr-dark transition-colors font-medium">Pricing</a>
              <a href="#testimonials" className="text-primary-700 hover:text-cr-dark transition-colors font-medium">Testimonials</a>
              <button
                onClick={() => navigate('/login')}
                className="text-primary-700 hover:text-cr-dark transition-colors font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-cr-dark text-cr-white px-6 py-2 rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-elegant"
              >
                Sign Up Free
              </button>
            </div>
            <button className="md:hidden text-cr-dark">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Elegant gradient */}
      <section className="pt-32 pb-20 px-4 bg-gradient-elegant">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-cr-dark leading-tight mb-6">
                On-Demand
                <span className="block mt-2 text-primary-700">
                  Micro-Logistics
                </span>
                Made Simple
              </h1>
              <p className="text-xl text-primary-700 mb-8 leading-relaxed">
                Lightning-fast deliveries with real-time tracking. From local parcels to business logistics, we've got you covered.
              </p>

              {/* Tab Selector */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab('user')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === 'user'
                      ? 'bg-cr-dark text-cr-white shadow-elegant-lg'
                      : 'bg-cr-white text-cr-dark hover:bg-primary-100 border border-primary-300'
                  }`}
                >
                  Send Package
                </button>
                <button
                  onClick={() => setActiveTab('driver')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === 'driver'
                      ? 'bg-cr-dark text-cr-white shadow-elegant-lg'
                      : 'bg-cr-white text-cr-dark hover:bg-primary-100 border border-primary-300'
                  }`}
                >
                  Become Driver
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {activeTab === 'user' ? (
                  <>
                    <button
                      onClick={() => navigate('/register')}
                      className="bg-cr-dark text-cr-white px-8 py-4 rounded-lg hover:bg-accent-hover transition-all font-medium text-lg shadow-elegant-lg hover:shadow-elegant-xl transform hover:-translate-y-0.5"
                    >
                      Book a Delivery Now →
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="bg-cr-white text-cr-dark px-8 py-4 rounded-lg hover:bg-primary-100 transition-all font-medium text-lg border-2 border-primary-300 shadow-elegant"
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/driver/register')}
                      className="bg-cr-dark text-cr-white px-8 py-4 rounded-lg hover:bg-accent-hover transition-all font-medium text-lg shadow-elegant-lg hover:shadow-elegant-xl transform hover:-translate-y-0.5"
                    >
                      Join as Driver →
                    </button>
                    <button
                      onClick={() => navigate('/driver/login')}
                      className="bg-cr-white text-cr-dark px-8 py-4 rounded-lg hover:bg-primary-100 transition-all font-medium text-lg border-2 border-primary-300 shadow-elegant"
                    >
                      Driver Login
                    </button>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-primary-700">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-cr-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">No hidden fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-cr-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Verified drivers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-cr-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">24/7 support</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image/Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-cr-white rounded-2xl shadow-elegant-xl p-8 border border-primary-200">
                <div className="absolute -top-4 -right-4 bg-cr-dark text-cr-white px-6 py-2 rounded-full font-semibold shadow-elegant-lg">
                  50K+ Deliveries
                </div>
                <div className="text-center">
                  <div className="text-8xl mb-6">📦</div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-primary-100 p-4 rounded-lg border border-primary-200">
                      <span className="text-cr-dark font-medium">From: Your Location</span>
                      <span className="text-primary-700">📍</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="border-l-2 border-dashed border-primary-300 h-8"></div>
                    </div>
                    <div className="flex items-center justify-between bg-primary-100 p-4 rounded-lg border border-primary-200">
                      <span className="text-cr-dark font-medium">To: Destination</span>
                      <span className="text-primary-700">🎯</span>
                    </div>
                    <div className="bg-cr-dark text-cr-white p-4 rounded-lg font-semibold shadow-elegant">
                      Delivered in 45 mins avg ⚡
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-cr-white border-y border-primary-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-lg bg-primary-50 border border-primary-200"
              >
                <div className="text-4xl md:text-5xl font-bold text-cr-dark mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-cr-dark mb-4">
              Why Choose CargoRapido?
            </h2>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto">
              Experience the future of logistics with cutting-edge technology and unmatched reliability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-cr-white rounded-xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all transform hover:-translate-y-1 border border-primary-200"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-cr-dark mb-3">{feature.title}</h3>
                <p className="text-primary-700 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-cr-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-cr-dark mb-4">
              How It Works
            </h2>
            <p className="text-xl text-primary-700">
              Get started in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-center bg-primary-50 rounded-xl p-8 border border-primary-200 hover:shadow-elegant transition-all">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cr-dark text-cr-white rounded-full font-bold text-2xl mb-4 shadow-elegant">
                    {step.step}
                  </div>
                  <div className="text-6xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-cr-dark mb-3">{step.title}</h3>
                  <p className="text-primary-700">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary-300 -translate-x-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-cr-dark mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-primary-700">
              Join thousands of satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-cr-white rounded-xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all border border-primary-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-cr-dark text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-primary-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-cr-dark">{testimonial.name}</div>
                    <div className="text-primary-700 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-cr-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-cr-dark mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-primary-700">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-cr-dark text-cr-white shadow-elegant-xl transform scale-105 border-2 border-cr-dark'
                    : 'bg-cr-white border-2 border-primary-300 shadow-elegant'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-500 text-cr-dark px-6 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-cr-white' : 'text-cr-dark'}`}>
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold mb-2">
                    {plan.price}
                  </div>
                  <div className={`text-sm ${plan.popular ? 'text-primary-300' : 'text-primary-700'}`}>
                    {plan.period}
                  </div>
                  <p className={`mt-4 ${plan.popular ? 'text-primary-300' : 'text-primary-700'}`}>
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.popular ? 'text-cr-white' : 'text-cr-dark'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className={plan.popular ? 'text-cr-white' : 'text-primary-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-cr-white text-cr-dark hover:bg-primary-100'
                      : 'bg-cr-dark text-cr-white hover:bg-accent-hover'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-dark text-cr-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-300">
            Join thousands of businesses and individuals who trust CargoRapido for their delivery needs
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-cr-white text-cr-dark px-10 py-4 rounded-lg hover:bg-primary-100 transition-colors font-semibold text-lg shadow-elegant-xl"
            >
              Start Free Today →
            </button>
            <button
              onClick={() => navigate('/driver/register')}
              className="bg-transparent border-2 border-cr-white text-cr-white px-10 py-4 rounded-lg hover:bg-cr-white hover:text-cr-dark transition-colors font-semibold text-lg"
            >
              Become a Driver
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cr-dark text-primary-300 py-12 border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl">🚚</span>
                <span className="text-xl font-bold text-cr-white">CargoRapido</span>
              </div>
              <p className="text-sm text-primary-500">
                On-demand micro-logistics platform connecting businesses and individuals with verified drivers for fast, reliable deliveries.
              </p>
            </div>
            <div>
              <h4 className="text-cr-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-cr-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-cr-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-cr-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-cr-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-cr-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-cr-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-cr-white transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-cr-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cr-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-cr-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>📧 support@cargorapido.com</li>
                <li>📞 +91 1800-123-4567</li>
                <li>📍 Mumbai, Maharashtra, India</li>
                <li className="flex space-x-4 pt-4">
                  <a href="#" className="text-2xl hover:text-cr-white transition-colors">📘</a>
                  <a href="#" className="text-2xl hover:text-cr-white transition-colors">🐦</a>
                  <a href="#" className="text-2xl hover:text-cr-white transition-colors">📷</a>
                  <a href="#" className="text-2xl hover:text-cr-white transition-colors">💼</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-800 pt-8 text-center text-sm">
            <p>&copy; 2025 CargoRapido. All rights reserved. Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
