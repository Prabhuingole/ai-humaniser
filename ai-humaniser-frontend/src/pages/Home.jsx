import { useState } from 'react';
import Header from '../components/core/Header';
import Footer from '../components/core/Footer';
import Humanizer from '../components/tools/Humanizer';
import Detector from '../components/tools/Detector';
import Plagiarism from '../components/tools/Plagiarism';

import { Sparkles, ShieldCheck, Info, Search, FileText, Brain, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// New Color Palette
const COLORS = {
  dark: '#11150d',
  darkGreen: '#314026', 
  mediumGreen: '#526a40',
  lightGreen: '#739559',
  accentGreen: '#94bf73',
  highlightGreen: '#b5ea8c'
};

const featureCards = {
  humanizer: [
    {
      icon: <Sparkles className="w-12 h-12" style={{ color: COLORS.highlightGreen }} />, 
      title: 'Make Text Human',
      desc: 'Our AI Humanizer rewrites your content to sound natural and bypass AI detectors, making it perfect for blogs, essays, and more.'
    },
    {
      icon: <ShieldCheck className="w-12 h-12" style={{ color: COLORS.highlightGreen }} />, 
      title: 'Safe & Secure',
      desc: 'Your data is never stored. We prioritize your privacy and ensure your content is processed securely every time.'
    },
    {
      icon: <Info className="w-12 h-12" style={{ color: COLORS.highlightGreen }} />, 
      title: 'How to Use',
      desc: 
        "Paste your AI-generated text above, click 'Humanize Text', and get results instantly. Edit as needed and enjoy undetectable content!"
    }
  ],
  detector: [
    {
      icon: <Search className="w-12 h-12" style={{ color: COLORS.highlightGreen }} />, 
      title: 'Detect AI Content',
      desc: 'Our AI Detector analyzes your text and tells you if it was likely written by a human or an AI.'
    },
    {
      icon: <ShieldCheck className="w-12 h-12" style={{ color: COLORS.highlightGreen }} />, 
      title: 'Accurate & Fast',
      desc: 'Get instant results with high accuracy, powered by advanced AI models.'
    },
    {
      icon: <Info className="w-12 h-12" style={{ color: COLORS.highlightGreen }} />, 
      title: 'How to Use',
      desc: "Paste your text above, click 'Detect AI', and see the results instantly."
    }
  ],
  plagiarism: [
    {
      icon: <FileText className="w-12 h-12" style={{ color: COLORS.highlightGreen }} />, 
      title: 'Check for Plagiarism',
      desc: 'Our Plagiarism Checker scans your content and finds any duplicate or copied text.'
    },
    {
      icon: <ShieldCheck className="w-12 h-12" style={{ color: COLORS.highlightGreen }} />, 
      title: 'Originality Matters',
      desc: 'Ensure your work is unique and avoid accidental plagiarism in essays, articles, and more.'
    },
    {
      icon: <Info className="w-12 h-12" style={{ color: COLORS.highlightGreen }} />, 
      title: 'How to Use',
      desc: "Paste your text above, click 'Check Plagiarism', and get a detailed originality report."
    }
  ]
};

export default function Home() {
  const [activeTool, setActiveTool] = useState('humanizer');
  const [isPremium, setIsPremium] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.dark }}>
      <Header 
        isPremium={isPremium} 
        activePage={activeTool}
        colors={COLORS}
      />

      {/* Hero Section */}
      <section 
        style={{ 
          background: `linear-gradient(135deg, ${COLORS.darkGreen} 0%, ${COLORS.mediumGreen} 50%, ${COLORS.lightGreen} 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }} 
        className="text-white py-24 px-4 text-center relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-16 h-16 mr-4" style={{ color: COLORS.highlightGreen }} />
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              AI Humaniser
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl mb-8 font-light opacity-90">
            Make Your Content Undetectable
          </h2>
          <p className="text-xl md:text-2xl mb-12 font-medium opacity-80 max-w-4xl mx-auto leading-relaxed">
            Transform AI-generated content into natural, human-like text that bypasses detection tools.
            <span className="block mt-4 text-2xl" style={{ color: COLORS.highlightGreen }}>
              Free & premium plans available.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/premium"
              className="group inline-flex items-center font-bold px-8 py-4 rounded-2xl shadow-2xl bg-white text-xl hover:scale-105 transition-all duration-300 transform"
              style={{ color: COLORS.darkGreen }}
            >
              <Star className="w-6 h-6 mr-3" style={{ color: COLORS.lightGreen }} />
              <span>Upgrade to Premium</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center font-semibold px-8 py-4 rounded-2xl border-2 border-white text-xl hover:bg-white hover:text-darkGreen transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Tool Cards Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: COLORS.highlightGreen }}>
              Powerful AI Tools
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from our suite of advanced AI tools designed to enhance your content creation workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* AI Humaniser Card */}
            <div 
              className={`relative p-8 rounded-3xl shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                activeTool === 'humanizer' 
                  ? 'ring-4 ring-opacity-50' 
                  : 'hover:shadow-3xl'
              }`}
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${activeTool === 'humanizer' ? COLORS.highlightGreen : COLORS.mediumGreen}`,
                boxShadow: activeTool === 'humanizer' 
                  ? `0 25px 50px -12px ${COLORS.highlightGreen}40` 
                  : `0 20px 25px -5px ${COLORS.dark}50, 0 10px 10px -5px ${COLORS.dark}25`
              }}
              onClick={() => setActiveTool('humanizer')}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-2xl mr-4" style={{ backgroundColor: COLORS.mediumGreen }}>
                  <Sparkles className="w-8 h-8" style={{ color: COLORS.highlightGreen }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: COLORS.highlightGreen }}>
                  AI Humaniser
                </h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Transform AI-generated content into natural, human-like text that bypasses detection tools with advanced algorithms.
              </p>
              <div className="flex items-center text-sm" style={{ color: COLORS.accentGreen }}>
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Bypass AI detection</span>
              </div>
            </div>

            {/* AI Detector Card */}
            <div 
              className={`relative p-8 rounded-3xl shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                activeTool === 'detector' 
                  ? 'ring-4 ring-opacity-50' 
                  : 'hover:shadow-3xl'
              }`}
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${activeTool === 'detector' ? COLORS.highlightGreen : COLORS.mediumGreen}`,
                boxShadow: activeTool === 'detector' 
                  ? `0 25px 50px -12px ${COLORS.highlightGreen}40` 
                  : `0 20px 25px -5px ${COLORS.dark}50, 0 10px 10px -5px ${COLORS.dark}25`
              }}
              onClick={() => setActiveTool('detector')}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-2xl mr-4" style={{ backgroundColor: COLORS.mediumGreen }}>
                  <Search className="w-8 h-8" style={{ color: COLORS.highlightGreen }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: COLORS.highlightGreen }}>
                  AI Detector
                </h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Analyze text with precision to determine if content was written by AI or human, with detailed confidence scores.
              </p>
              <div className="flex items-center text-sm" style={{ color: COLORS.accentGreen }}>
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>High accuracy detection</span>
              </div>
            </div>

            {/* Plagiarism Checker Card */}
            <div 
              className={`relative p-8 rounded-3xl shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                activeTool === 'plagiarism' 
                  ? 'ring-4 ring-opacity-50' 
                  : 'hover:shadow-3xl'
              }`}
              style={{
                backgroundColor: COLORS.darkGreen,
                border: `2px solid ${activeTool === 'plagiarism' ? COLORS.highlightGreen : COLORS.mediumGreen}`,
                boxShadow: activeTool === 'plagiarism' 
                  ? `0 25px 50px -12px ${COLORS.highlightGreen}40` 
                  : `0 20px 25px -5px ${COLORS.dark}50, 0 10px 10px -5px ${COLORS.dark}25`
              }}
              onClick={() => setActiveTool('plagiarism')}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-2xl mr-4" style={{ backgroundColor: COLORS.mediumGreen }}>
                  <FileText className="w-8 h-8" style={{ color: COLORS.highlightGreen }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: COLORS.highlightGreen }}>
                  Plagiarism Checker
                </h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Comprehensive plagiarism detection that scans billions of documents to ensure your content is completely original.
              </p>
              <div className="flex items-center text-sm" style={{ color: COLORS.accentGreen }}>
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Deep web scanning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <div className="mb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {activeTool === 'humanizer' && <Humanizer isPremium={isPremium} colors={COLORS} />}
          {activeTool === 'detector' && <Detector isPremium={isPremium} colors={COLORS} />}
          {activeTool === 'plagiarism' && <Plagiarism isPremium={isPremium} colors={COLORS} />}
        </div>
      </div>



      <Footer colors={COLORS} />
    </div>
  );
}