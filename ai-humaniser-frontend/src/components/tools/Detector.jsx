import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui/Button';
import WordLimitedTextbox from '../ui/WordLimitedTextbox';
import { Search, ShieldCheck, Info } from 'lucide-react';

export default function Detector({ isPremium }) {
  const [text, setText] = useState('');
  const wordLimit = isPremium ? Infinity : 2000;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const overLimit = !isPremium && wordCount > wordLimit;

  // Feature highlight cards data
  const featureCards = [
    {
      icon: <Search className="w-8 h-8 text-[#8db48e] mb-2" />,
      title: 'Detect AI Content',
      desc: 'Our AI Detector analyzes your text and tells you if it was likely written by a human or an AI.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#8db48e] mb-2" />,
      title: 'Accurate & Fast',
      desc: 'Get instant results with high accuracy, powered by advanced AI models.'
    },
    {
      icon: <Info className="w-8 h-8 text-[#8db48e] mb-2" />,
      title: 'How to Use',
      desc: "Paste your text above, click 'Detect AI', and see the results instantly."
    }
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">AI Detector</h2>
        <WordLimitedTextbox
          value={text}
          onChange={e => setText(e.target.value)}
          wordLimit={wordLimit === Infinity ? 1000000 : wordLimit}
          errorMessage="Word limit exceeded for free users!"
          placeholder="Enter text to detect AI content..."
        />
        <Button
          disabled={overLimit || !isPremium}
          className={(!isPremium || overLimit) ? 'cursor-not-allowed' : ''}
        >
          Detect AI Content
        </Button>
        {!isPremium && (
          <p className="mt-2 text-sm text-gray-600">
            Premium feature - upgrade to use
          </p>
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

Detector.propTypes = {
  isPremium: PropTypes.bool.isRequired,
};
