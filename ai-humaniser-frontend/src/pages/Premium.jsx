import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Crown, Check, Star, Zap, Shield, Users, ArrowRight, Sparkles, Award, Clock, Headphones } from 'lucide-react';

// Color Palette
const COLORS = {
  dark: '#11150d',
  darkGreen: '#314026', 
  mediumGreen: '#526a40',
  lightGreen: '#739559',
  accentGreen: '#94bf73',
  highlightGreen: '#b5ea8c'
};

const premiumFeatures = [
  {
    icon: <Sparkles className="w-8 h-8" style={{ color: COLORS.highlightGreen }} />,
    title: 'Unlimited AI Humanizer',
    description: 'Transform unlimited content with advanced AI algorithms'
  },
  {
    icon: <Shield className="w-8 h-8" style={{ color: COLORS.highlightGreen }} />,
    title: 'Advanced AI Detection',
    description: 'Get detailed analysis with confidence scores and explanations'
  },
  {
    icon: <Users className="w-8 h-8" style={{ color: COLORS.highlightGreen }} />,
    title: 'Team Collaboration',
    description: 'Share workspaces and collaborate with your team'
  },
  {
    icon: <Clock className="w-8 h-8" style={{ color: COLORS.highlightGreen }} />,
    title: 'Priority Processing',
    description: 'Skip the queue with priority processing for all requests'
  },
  {
    icon: <Headphones className="w-8 h-8" style={{ color: COLORS.highlightGreen }} />,
    title: 'Priority Support',
    description: 'Get help within 2 hours with dedicated support team'
  },
  {
    icon: <Award className="w-8 h-8" style={{ color: COLORS.highlightGreen }} />,
    title: 'Advanced Analytics',
    description: 'Track usage, performance, and insights with detailed reports'
  }
];

const comparisonData = {
  free: {
    title: 'Free Plan',
    price: '$0',
    features: [
      '5 AI Humanizer requests per day',
      'Basic AI detection',
      'Standard plagiarism checks',
      'Community support',
      'Basic analytics',
      '1 user'
    ],
    limitations: [
      'Limited word count',
      'Basic features only',
      'No priority support',
      'No team features'
    ]
  },
  premium: {
    title: 'Premium Plan',
    price: '$19/month',
    features: [
      'Unlimited AI Humanizer requests',
      'Advanced AI detection',
      'Comprehensive plagiarism checks',
      'Priority support',
      'Advanced analytics',
      'Team collaboration',
      'API access',
      'Custom templates'
    ],
    benefits: [
      'Unlimited processing',
      'Advanced algorithms',
      'Priority queue access',
      'Dedicated support'
    ]
  }
};

export default function Premium() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      alert('Payment processing... (Demo)');
    }, 2000);
  };

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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="w-16 h-16" style={{ color: COLORS.highlightGreen }} />
            <h1 className="text-5xl md:text-6xl font-extrabold text-white">Upgrade to Premium</h1>
          </div>
          <h2 className="text-2xl md:text-3xl mb-6 font-light opacity-90 text-white">
            Unlock the Full Power of AI Humaniser
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform unlimited content, get priority support, and access advanced features designed for professionals.
          </p>
        </div>

        {/* Hero CTA */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-2xl font-bold text-white">
              <span className="text-4xl">{comparisonData.premium.price}</span>
              <span className="text-gray-400 text-lg">/month</span>
            </div>
            <div className="bg-highlightGreen text-darkGreen px-3 py-1 rounded-full text-sm font-bold">
              Most Popular
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="inline-flex items-center font-bold px-12 py-6 rounded-2xl shadow-2xl bg-white text-2xl hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: COLORS.darkGreen }}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mr-3"></div>
                Processing...
              </>
            ) : (
              <>
                <Star className="w-6 h-6 mr-3" style={{ color: COLORS.lightGreen }} />
                Upgrade Now
                <ArrowRight className="w-6 h-6 ml-3" />
              </>
            )}
          </button>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: COLORS.highlightGreen }}>
            Premium Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: COLORS.darkGreen,
                  border: `2px solid ${COLORS.mediumGreen}`,
                  boxShadow: `0 20px 25px -5px ${COLORS.dark}50, 0 10px 10px -5px ${COLORS.dark}25`
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  {feature.icon}
                  <h4 className="text-xl font-bold text-white">{feature.title}</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: COLORS.highlightGreen }}>
            Plan Comparison
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div
              className="p-8 rounded-3xl shadow-2xl transition-all duration-300"
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${COLORS.mediumGreen}`,
                boxShadow: `0 20px 25px -5px ${COLORS.dark}50, 0 10px 10px -5px ${COLORS.dark}25`
              }}
            >
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold mb-2 text-white">{comparisonData.free.title}</h4>
                <div className="text-3xl font-bold text-white mb-2">{comparisonData.free.price}</div>
                <p className="text-gray-400">Perfect for getting started</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h5 className="font-semibold text-white mb-3">What's Included:</h5>
                  <ul className="space-y-2">
                    {comparisonData.free.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300">
                        <Check className="w-4 h-4" style={{ color: COLORS.accentGreen }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-white mb-3">Limitations:</h5>
                  <ul className="space-y-2">
                    {comparisonData.free.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-400">
                        <div className="w-4 h-4 border border-gray-600 rounded"></div>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div
              className="p-8 rounded-3xl shadow-2xl transition-all duration-300 relative"
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${COLORS.highlightGreen}`,
                boxShadow: `0 25px 50px -12px ${COLORS.highlightGreen}40`
              }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-highlightGreen text-darkGreen px-4 py-2 rounded-full font-bold text-sm">
                  Recommended
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold mb-2 text-white">{comparisonData.premium.title}</h4>
                <div className="text-3xl font-bold text-white mb-2">{comparisonData.premium.price}</div>
                <p className="text-gray-400">For professionals and teams</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h5 className="font-semibold text-white mb-3">Everything Included:</h5>
                  <ul className="space-y-2">
                    {comparisonData.premium.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300">
                        <Check className="w-4 h-4" style={{ color: COLORS.accentGreen }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-white mb-3">Premium Benefits:</h5>
                  <ul className="space-y-2">
                    {comparisonData.premium.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300">
                        <Star className="w-4 h-4" style={{ color: COLORS.highlightGreen }} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: COLORS.highlightGreen }}>
            What Our Premium Users Say
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${COLORS.mediumGreen}`
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ color: COLORS.highlightGreen }} />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"The unlimited processing and priority support have transformed our content workflow."</p>
              <p className="text-white font-semibold">- Sarah M., Content Manager</p>
            </div>
            
            <div
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${COLORS.mediumGreen}`
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ color: COLORS.highlightGreen }} />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"Advanced analytics help us track performance and optimize our content strategy."</p>
              <p className="text-white font-semibold">- David L., Marketing Director</p>
            </div>
            
            <div
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${COLORS.mediumGreen}`
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ color: COLORS.highlightGreen }} />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"Team collaboration features make it easy to work together on large projects."</p>
              <p className="text-white font-semibold">- Emma R., Team Lead</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">Ready to Upgrade?</h3>
          <p className="text-xl text-gray-300 mb-8">Join thousands of professionals who trust AI Humaniser Premium.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="inline-flex items-center font-bold px-8 py-4 rounded-2xl shadow-2xl bg-white text-xl hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: COLORS.darkGreen }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" style={{ color: COLORS.lightGreen }} />
                  Upgrade to Premium
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
            <Link
              to="/pricing"
              className="inline-flex items-center font-semibold px-8 py-4 rounded-2xl border-2 text-xl transition-all duration-300"
              style={{
                borderColor: COLORS.accentGreen,
                color: COLORS.accentGreen
              }}
            >
              View All Plans
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            to="/" 
            className="inline-flex items-center text-accentGreen hover:text-highlightGreen transition-colors duration-200 font-semibold"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 