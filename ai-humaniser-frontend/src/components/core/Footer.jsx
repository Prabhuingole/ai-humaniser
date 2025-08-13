import { Link } from 'react-router-dom';
import { Brain, Github, Twitter, Mail } from 'lucide-react';

export default function Footer({ colors }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="py-12 px-4 border-t"
      style={{ 
        backgroundColor: colors?.darkGreen || '#314026',
        borderTopColor: colors?.mediumGreen || '#526a40'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-8 h-8" style={{ color: colors?.highlightGreen }} />
              <span className="text-2xl font-bold text-white">AI Humaniser</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Transform AI-generated content into natural, human-like text that bypasses detection tools with advanced algorithms.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors?.highlightGreen }}>
              Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  AI Humaniser
                </Link>
              </li>
              <li>
                <Link 
                  to="/detector" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  AI Detector
                </Link>
              </li>
              <li>
                <Link 
                  to="/plagiarism" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Plagiarism Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors?.highlightGreen }}>
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/pricing" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-600">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="text-gray-400 text-sm">
              © {currentYear} AI Humaniser. All rights reserved.
            </span>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-mediumGreen transition-all duration-200"
              style={{ color: colors?.accentGreen }}
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-mediumGreen transition-all duration-200"
              style={{ color: colors?.accentGreen }}
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="mailto:contact@aihumaniser.com" 
              className="p-2 rounded-lg hover:bg-mediumGreen transition-all duration-200"
              style={{ color: colors?.accentGreen }}
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}