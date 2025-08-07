import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Brain, 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Star,
  Zap,
  Users,
  Crown
} from 'lucide-react';

// Color Palette
const COLORS = {
  dark: '#11150d',
  darkGreen: '#314026', 
  mediumGreen: '#526a40',
  lightGreen: '#739559',
  accentGreen: '#94bf73',
  highlightGreen: '#b5ea8c'
};

// Payment Methods Configuration
const PAYMENT_METHODS = [
  {
    id: 'stripe',
    name: 'Credit Card',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Visa, Mastercard, American Express',
    popular: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: <div className="w-6 h-6 text-blue-500 font-bold">P</div>,
    description: 'Pay with your PayPal account',
    popular: false
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    icon: <div className="w-6 h-6">🍎</div>,
    description: 'Quick and secure payment',
    popular: false
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    icon: <div className="w-6 h-6">🤖</div>,
    description: 'Fast and convenient',
    popular: false
  }
];

// Plan Details
const PLAN_DETAILS = {
  name: 'Premium Plan',
  price: 19.00,
  currency: 'USD',
  period: 'month',
  features: [
    'Unlimited AI Humanizer requests',
    'Advanced AI detection',
    'Comprehensive plagiarism checks',
    'Priority support',
    'Advanced analytics',
    'Team collaboration',
    'API access',
    'Custom templates'
  ]
};

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Payment State
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Form State
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  
  // Card State (for Stripe)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  // Security State
  const [isSecure, setIsSecure] = useState(true);
  const [encryptionStatus, setEncryptionStatus] = useState('SSL Encrypted');

  // Initialize security check
  useEffect(() => {
    // Check if we're on HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setIsSecure(false);
      setEncryptionStatus('Not Secure');
    }
  }, []);

  // Handle form changes
  const handleBillingChange = (field, value) => {
    setBillingDetails(prev => ({
      ...prev,
      [field]: value
    }));
    setPaymentError(null);
  };

  const handleCardChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
    setPaymentError(null);
  };

  // Validate form
  const validateForm = () => {
    const errors = [];
    
    if (!billingDetails.firstName || !billingDetails.lastName) {
      errors.push('Please enter your full name');
    }
    
    if (!billingDetails.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingDetails.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (selectedMethod === 'stripe') {
      if (!cardDetails.number || cardDetails.number.length < 13) {
        errors.push('Please enter a valid card number');
      }
      if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        errors.push('Please enter a valid expiry date (MM/YY)');
      }
      if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
        errors.push('Please enter a valid CVC');
      }
    }
    
    return errors;
  };

  // Process payment
  const handlePayment = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setPaymentError(errors[0]);
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment processing
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        setPaymentSuccess(true);
        // Track successful payment
        trackPaymentEvent('payment_successful', {
          method: selectedMethod,
          amount: PLAN_DETAILS.price,
          currency: PLAN_DETAILS.currency
        });
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentError(error.message);
      trackPaymentEvent('payment_failed', {
        method: selectedMethod,
        error: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Track payment events
  const trackPaymentEvent = (event, data) => {
    console.log('Payment Event:', event, data);
    // In production, send to analytics service
    // analytics.track(event, data);
  };

  // Format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (paymentSuccess) {
    return (
      <div 
        className="min-h-screen py-20 px-4 flex items-center justify-center"
        style={{ backgroundColor: COLORS.dark }}
      >
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.highlightGreen }} />
            <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-gray-300">Your Premium subscription has been activated.</p>
          </div>
          
          <div 
            className="p-6 rounded-2xl mb-8"
            style={{
              backgroundColor: COLORS.darkGreen,
              border: `2px solid ${COLORS.accentGreen}`
            }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Welcome to Premium!</h3>
            <ul className="space-y-2 text-left">
              {PLAN_DETAILS.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4" style={{ color: COLORS.accentGreen }} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center font-bold px-8 py-4 rounded-2xl shadow-2xl bg-white text-xl hover:scale-105 transition-all duration-300 transform"
            style={{ color: COLORS.darkGreen }}
          >
            <Crown className="w-5 h-5 mr-2" style={{ color: COLORS.lightGreen }} />
            Start Using Premium
            <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-20 px-4"
      style={{ backgroundColor: COLORS.dark }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-12 h-12" style={{ color: COLORS.highlightGreen }} />
            <h1 className="text-4xl font-extrabold text-white">Complete Your Purchase</h1>
          </div>
          <p className="text-xl text-gray-300">Secure payment powered by industry-leading encryption</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div 
            className="p-8 rounded-3xl shadow-2xl"
            style={{
              backgroundColor: COLORS.darkGreen,
              border: `2px solid ${COLORS.mediumGreen}`,
              boxShadow: `0 20px 25px -5px ${COLORS.dark}50, 0 10px 10px -5px ${COLORS.dark}25`
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>
            
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-lg font-semibold mb-4" style={{ color: COLORS.highlightGreen }}>
                  Choose Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedMethod === method.id 
                          ? 'border-accentGreen bg-accentGreen/10' 
                          : 'border-mediumGreen hover:border-accentGreen'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {method.icon}
                        <span className="font-semibold text-white">{method.name}</span>
                        {method.popular && (
                          <span className="bg-highlightGreen text-darkGreen px-2 py-1 rounded-full text-xs font-bold">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{method.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Billing Information */}
              <div>
                <label className="block text-lg font-semibold mb-4" style={{ color: COLORS.highlightGreen }}>
                  Billing Information
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={billingDetails.firstName}
                    onChange={(e) => handleBillingChange('firstName', e.target.value)}
                    className="p-3 rounded-lg border border-mediumGreen bg-darkGreen text-white placeholder-gray-400 focus:outline-none focus:border-accentGreen transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={billingDetails.lastName}
                    onChange={(e) => handleBillingChange('lastName', e.target.value)}
                    className="p-3 rounded-lg border border-mediumGreen bg-darkGreen text-white placeholder-gray-400 focus:outline-none focus:border-accentGreen transition-colors"
                  />
                </div>
                
                <input
                  type="email"
                  placeholder="Email Address"
                  value={billingDetails.email}
                  onChange={(e) => handleBillingChange('email', e.target.value)}
                  className="w-full p-3 rounded-lg border border-mediumGreen bg-darkGreen text-white placeholder-gray-400 focus:outline-none focus:border-accentGreen transition-colors mt-4"
                />
                
                <textarea
                  placeholder="Billing Address"
                  value={billingDetails.address}
                  onChange={(e) => handleBillingChange('address', e.target.value)}
                  className="w-full p-3 rounded-lg border border-mediumGreen bg-darkGreen text-white placeholder-gray-400 focus:outline-none focus:border-accentGreen transition-colors mt-4"
                  rows={3}
                />
              </div>

              {/* Credit Card Details (for Stripe) */}
              {selectedMethod === 'stripe' && (
                <div>
                  <label className="block text-lg font-semibold mb-4" style={{ color: COLORS.highlightGreen }}>
                    Card Details
                  </label>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardDetails.number}
                      onChange={(e) => handleCardChange('number', formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="w-full p-3 rounded-lg border border-mediumGreen bg-darkGreen text-white placeholder-gray-400 focus:outline-none focus:border-accentGreen transition-colors"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => handleCardChange('expiry', formatExpiry(e.target.value))}
                        maxLength={5}
                        className="p-3 rounded-lg border border-mediumGreen bg-darkGreen text-white placeholder-gray-400 focus:outline-none focus:border-accentGreen transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={cardDetails.cvc}
                        onChange={(e) => handleCardChange('cvc', e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                        className="p-3 rounded-lg border border-mediumGreen bg-darkGreen text-white placeholder-gray-400 focus:outline-none focus:border-accentGreen transition-colors"
                      />
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Name on Card"
                      value={cardDetails.name}
                      onChange={(e) => handleCardChange('name', e.target.value)}
                      className="w-full p-3 rounded-lg border border-mediumGreen bg-darkGreen text-white placeholder-gray-400 focus:outline-none focus:border-accentGreen transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {paymentError && (
                <div className="p-4 rounded-xl text-red-300 bg-red-900/20 border border-red-500/30 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {paymentError}
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Lock className="w-4 h-4" />
                <span>{encryptionStatus} • Your payment information is secure</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !isSecure}
                className="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ 
                  background: `linear-gradient(135deg, ${COLORS.lightGreen} 0%, ${COLORS.accentGreen} 100%)`,
                  color: COLORS.dark
                }}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Pay ${PLAN_DETAILS.price}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Plan Details */}
            <div 
              className="p-6 rounded-3xl shadow-2xl"
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${COLORS.highlightGreen}`,
                boxShadow: `0 25px 50px -12px ${COLORS.highlightGreen}40`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8" style={{ color: COLORS.highlightGreen }} />
                <h3 className="text-2xl font-bold text-white">{PLAN_DETAILS.name}</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">${PLAN_DETAILS.price}</span>
                  <span className="text-gray-400">/{PLAN_DETAILS.period}</span>
                </div>
                <p className="text-gray-300">Billed monthly • Cancel anytime</p>
              </div>
              
              <ul className="space-y-3">
                {PLAN_DETAILS.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.accentGreen }} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Features */}
            <div 
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${COLORS.mediumGreen}`
              }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Security Features</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Shield className="w-5 h-5" style={{ color: COLORS.accentGreen }} />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Lock className="w-5 h-5" style={{ color: COLORS.accentGreen }} />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Zap className="w-5 h-5" style={{ color: COLORS.accentGreen }} />
                  <span>Instant activation</span>
                </div>
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div 
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${COLORS.mediumGreen}`
              }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">30-Day Money Back Guarantee</h4>
              <p className="text-gray-300 text-sm">
                Not satisfied? Get a full refund within 30 days. No questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Pricing */}
        <div className="text-center mt-12">
          <Link 
            to="/pricing" 
            className="inline-flex items-center text-accentGreen hover:text-highlightGreen transition-colors duration-200 font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
        </div>
      </div>
    </div>
  );
} 