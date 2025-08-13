import { useState } from 'react';
import { Check, Star, Zap, Shield, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

// Color palette
const COLORS = {
  dark: '#11150d',
  darkGreen: '#314026',
  mediumGreen: '#526a40',
  lightGreen: '#739559',
  accentGreen: '#94bf73',
  highlightGreen: '#b5ea8c'
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out our tools',
    features: [
      '1,000 words per month',
      'Basic text humanization',
      'AI detection (limited)',
      'Community support'
    ],
    buttonText: 'Get Started',
    buttonLink: '/',
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'Best for content creators and students',
    features: [
      'Unlimited text humanization',
      'Advanced AI detection',
      'Plagiarism checking',
      'Priority support',
      'Export to multiple formats',
      'Usage analytics'
    ],
    buttonText: 'Start Free Trial',
    buttonLink: '/signup',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: 'per month',
    description: 'For teams and businesses',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee'
    ],
    buttonText: 'Contact Sales',
    buttonLink: '/contact',
    popular: false
  }
];

const features = [
  {
    icon: <Zap className="w-6 h-6" style={{ color: COLORS.highlightGreen }} />,
    title: 'Lightning Fast',
    description: 'Process thousands of words in seconds with our optimized AI models.'
  },
  {
    icon: <Shield className="w-6 h-6" style={{ color: COLORS.highlightGreen }} />,
    title: 'Privacy First',
    description: 'Your data is never stored. We process everything in real-time and delete immediately.'
  },
  {
    icon: <Users className="w-6 h-6" style={{ color: COLORS.highlightGreen }} />,
    title: 'Trusted by Thousands',
    description: 'Join thousands of content creators, students, and professionals worldwide.'
  },
  {
    icon: <Globe className="w-6 h-6" style={{ color: COLORS.highlightGreen }} />,
    title: 'Always Available',
    description: '99.9% uptime guarantee with 24/7 monitoring and support.'
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkGreen} 100%)` }}>
      {/* Header */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: COLORS.highlightGreen }}>
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. Start free, upgrade anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                plan.popular 
                  ? 'ring-4 ring-opacity-50' 
                  : 'hover:shadow-3xl'
              }`}
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${plan.popular ? COLORS.highlightGreen : COLORS.mediumGreen}`,
                boxShadow: plan.popular 
                  ? `0 25px 50px -12px ${COLORS.highlightGreen}40` 
                  : `0 20px 25px -5px ${COLORS.dark}50, 0 10px 10px -5px ${COLORS.dark}25`
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.highlightGreen }}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold" style={{ color: COLORS.accentGreen }}>
                    {plan.price}
                  </span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: COLORS.accentGreen }} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.buttonLink}
                className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black'
                    : 'bg-white hover:bg-gray-100 text-gray-900'
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.highlightGreen }}>
            Why Choose AI Humaniser?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Built with cutting-edge AI technology to deliver the best results for your content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-6 rounded-xl" style={{ backgroundColor: COLORS.darkGreen }}>
              <div className="flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.accentGreen }}>
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.highlightGreen }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.darkGreen }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.accentGreen }}>
              Can I cancel my subscription anytime?
            </h3>
            <p className="text-gray-300">
              Yes, you can cancel your subscription at any time. No long-term contracts or hidden fees.
            </p>
          </div>

          <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.darkGreen }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.accentGreen }}>
              Is there a free trial?
            </h3>
            <p className="text-gray-300">
              Yes! Start with our free plan and upgrade to Pro with a 7-day free trial. No credit card required.
            </p>
          </div>

          <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.darkGreen }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.accentGreen }}>
              How secure is my data?
            </h3>
            <p className="text-gray-300">
              We never store your content. All processing happens in real-time and is immediately deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}