import { useEffect, useRef, useState } from 'react';
import { Brain, Star, LogOut } from 'lucide-react';
import ShareButton from '../ui/ShareButton';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header({ isPremium, activePage, colors }) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setVisible(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced navigation button styling
  const navButtonClass = () =>
    'text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 relative hover:bg-white hover:text-darkGreen hover:shadow-md';

  return (
    <header
      style={{
        background: `linear-gradient(135deg, ${colors.darkGreen} 0%, ${colors.mediumGreen} 100%)`,
        borderBottom: `2px solid ${colors.accentGreen}`,
        transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      }}
      className="sticky top-0 z-50 shadow-2xl backdrop-blur-md"
    >
      <div className="mx-auto max-w-6xl px-8 py-4 flex items-center justify-between gap-8">
        {/* Left: Logo + Site Name */}
        <div className="flex items-center gap-4 min-w-fit">
          <Link to="/">
            <span className="flex items-center gap-4">
              <Brain className="text-white h-8 w-8 drop-shadow" style={{ color: colors.highlightGreen }} />
              <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow font-sans">AI Humaniser</span>
            </span>
          </Link>
        </div>
        {/* Center: Features Navigation (hidden on mobile) */}
        <nav className="hidden md:flex justify-center gap-12 flex-1">
          <Link
            to="/"
            className={navButtonClass()}
          >
            AI Humaniser
          </Link>
          <Link
            to="/detector"
            className={navButtonClass()}
          >
            AI Detector
          </Link>
          <Link
            to="/plagiarism"
            className={navButtonClass()}
          >
            Plagiarism Checker
          </Link>
        </nav>
        {/* Hamburger for mobile */}
        <button className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white hover:text-darkGreen transition-all duration-200" onClick={() => setMobileMenu(m => !m)}>
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        {/* Right: Share + Premium + Auth */}
        <div className="flex items-center gap-4 min-w-fit">
          <ShareButton colors={colors} />
          <Link
            to="/premium"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg border-2 border-white bg-white hover:bg-darkGreen hover:text-white transition-all duration-200 min-w-0"
            style={{ minWidth: 0 }}
          >
            <Star className="h-5 w-5 group-hover:text-white" style={{ color: colors.lightGreen }} />
            <span className="font-bold text-base group-hover:text-white" style={{ color: colors.darkGreen }}>Premium</span>
          </Link>
          {session ? (
            <button
              onClick={handleSignOut}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg border-2 border-white bg-transparent hover:bg-red-500 hover:border-red-500 transition-all duration-200 min-w-0"
            style={{ minWidth: 0 }}
          >
              <LogOut className="h-5 w-5 text-white" />
              <span className="font-bold text-base text-white">Logout</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 px-4 py-2 rounded-lg shadow-md hover:shadow-lg border-2 border-white bg-transparent hover:bg-white hover:text-darkGreen transition-all duration-200 min-w-0"
                style={{ minWidth: 0 }}
              >
                <span className="font-bold text-base text-white">Login</span>
          </Link>
              <Link
                to="/signup"
                className="group flex items-center gap-1 px-4 py-2 rounded-lg shadow-md hover:shadow-lg border-2 border-white bg-white hover:bg-darkGreen hover:text-white transition-all duration-200 min-w-0"
                style={{ minWidth: 0 }}
              >
                <span className="font-bold text-base group-hover:text-white" style={{ color: colors.darkGreen }}>Sign Up</span>
              </Link>
            </>
      )}
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden flex flex-col items-center gap-4 py-6 bg-gradient-to-b from-darkGreen to-mediumGreen border-t border-white/20">
          <Link to="/" className="text-white font-semibold px-4 py-3 rounded-lg hover:bg-white hover:text-darkGreen transition-all duration-200 w-full text-center">AI Humaniser</Link>
          <Link to="/detector" className="text-white font-semibold px-4 py-3 rounded-lg hover:bg-white hover:text-darkGreen transition-all duration-200 w-full text-center">AI Detector</Link>
          <Link to="/plagiarism" className="text-white font-semibold px-4 py-3 rounded-lg hover:bg-white hover:text-darkGreen transition-all duration-200 w-full text-center">Plagiarism Checker</Link>
          <Link to="/premium" className="font-bold px-5 py-3 rounded-lg shadow-md border-2 border-white bg-white text-darkGreen hover:bg-darkGreen hover:text-white transition-all duration-200 w-full text-center flex items-center justify-center gap-2">
            <Star className="h-5 w-5" style={{ color: colors.lightGreen }} />
            <span className="font-bold text-base">Premium</span>
          </Link>
          {session ? (
            <button
              onClick={handleSignOut}
              className="font-bold px-5 py-3 rounded-lg shadow-md border-2 border-white bg-red-500 text-white hover:bg-red-600 transition-all duration-200 w-full text-center flex items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link to="/login" className="font-bold px-5 py-3 rounded-lg shadow-md border-2 border-white bg-transparent text-white hover:bg-white hover:text-darkGreen transition-all duration-200 w-full text-center">Login</Link>
              <Link to="/signup" className="font-bold px-5 py-3 rounded-lg shadow-md border-2 border-white bg-white text-darkGreen hover:bg-darkGreen hover:text-white transition-all duration-200 w-full text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}