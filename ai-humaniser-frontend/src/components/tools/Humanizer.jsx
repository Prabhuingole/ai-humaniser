import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui/Button';
import WordLimitedTextbox from '../ui/WordLimitedTextbox';
import { Sparkles, ShieldCheck, Info, Wand2, Copy, Check, Download, Upload, RotateCcw } from 'lucide-react';
import { aiHumaniserService } from '../../services/aiHumaniserService';

export default function Humanizer({ isPremium }) {
  const [text, setText] = useState('');
  const [humanizedText, setHumanizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const wordLimit = isPremium ? Infinity : 1000;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const overLimit = !isPremium && wordCount > wordLimit;

  const handleHumanize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to humanize');
      return;
    }

    if (overLimit) {
      setError(`Word limit exceeded! Please upgrade to premium for unlimited processing.`);
      return;
    }

    setIsProcessing(true);
    setError('');
    setCopied(false);

    try {
      console.log('🤖 Processing with AI Humaniser...');
      
      const result = await aiHumaniserService.humanizeText(text);
      
      if (result.success) {
        setHumanizedText(result.humanizedText);
        console.log('✅ Text humanized successfully:', result);
      } else {
        setError(result.error || 'Failed to humanize text');
        console.error('❌ Humanization failed:', result.error);
      }
    } catch (error) {
      setError(error.message);
      console.error('❌ Humanization error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (humanizedText) {
      try {
        await navigator.clipboard.writeText(humanizedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Copy failed:', error);
      }
    }
  };

  const handleReset = () => {
    setText('');
    setHumanizedText('');
    setError('');
    setCopied(false);
  };

  // Feature highlight cards data
  const featureCards = [
    {
      icon: <Sparkles className="w-8 h-8 text-[#8db48e] mb-2" />,
      title: 'Make Text Human',
      desc: 'Our AI Humanizer rewrites your content to sound natural and bypass AI detectors, making it perfect for blogs, essays, and more.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#8db48e] mb-2" />,
      title: 'Safe & Secure',
      desc: 'Your data is never stored. We prioritize your privacy and ensure your content is processed securely every time.'
    },
    {
      icon: <Info className="w-8 h-8 text-[#8db48e] mb-2" />,
      title: 'How to Use',
      desc: "Paste your AI-generated text above, click 'Humanize Text', and get results instantly. Edit as needed and enjoy undetectable content!"
    }
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">AI Humanizer</h2>
        
        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Text (AI-generated):
          </label>
          <WordLimitedTextbox
            value={text}
            onChange={e => setText(e.target.value)}
            wordLimit={wordLimit === Infinity ? 1000000 : wordLimit}
            errorMessage="Word limit exceeded for free users!"
            placeholder="Enter AI-generated text here..."
          />
          <div className="mt-2 text-sm text-gray-500 flex justify-between">
            <span>Word count: {wordCount}</span>
            {!isPremium && (
              <span className={overLimit ? 'text-red-500 font-semibold' : 'text-gray-500'}>
                Limit: {wordLimit} words
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={handleHumanize}
            disabled={isProcessing || overLimit}
            className={`flex items-center gap-2 ${overLimit ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Humanize Text
              </>
            )}
          </Button>
          
          {humanizedText && (
            <>
              <Button 
                onClick={handleCopy}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              
              <Button 
                onClick={handleReset}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <RotateCcw size={20} />
                Reset
              </Button>
            </>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            ❌ {error}
          </div>
        )}

        {/* Word Limit Warning */}
        {overLimit && !error && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <div className="flex items-center justify-between">
              <div>
                ⚠️ Word limit exceeded ({wordCount}/{wordLimit}). 
                <span className="font-semibold"> Please upgrade to premium for unlimited processing.</span>
              </div>
              <a 
                href="/premium" 
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        )}

        {/* Output Section */}
        {humanizedText && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Humanized Output:
            </label>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-gray-800 whitespace-pre-wrap">{humanizedText}</p>
            </div>
          </div>
        )}


      </div>
      {/* Feature highlight cards OUTSIDE the white box */}
      <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {featureCards.map((card, idx) => (
          <div key={idx} className="bg-[#f5f5f5] rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
            {card.icon}
            <h3 className="font-bold text-lg mb-1 text-[#4d724d]">{card.title}</h3>
            <p className="text-center text-[#4d724d]">{card.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

Humanizer.propTypes = {
  isPremium: PropTypes.bool.isRequired,
};