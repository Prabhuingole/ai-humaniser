import React, { useState, useRef, useEffect } from 'react';

const shareOptions = [
  {
    name: 'WhatsApp',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
      </svg>
    ),
    url: (link) => `https://wa.me/?text=${encodeURIComponent(link)}`,
  },
  {
    name: 'Twitter',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0012 8.29c0 .34.04.67.1.99A12.13 12.13 0 013 5.1a4.28 4.28 0 001.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 003.44 4.19c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.29 4.29 0 004 2.98A8.6 8.6 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.72 8.72 0 0024 4.59a8.5 8.5 0 01-2.54.7z" /></svg>
    ),
    url: (link) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`,
  },
  {
    name: 'Facebook',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z" /></svg>
    ),
    url: (link) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" /></svg>
    ),
    url: (link) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(link)}`,
  },
  {
    name: 'Copy Link',
    icon: (copied) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {copied ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        )}
      </svg>
    ),
    url: (link) => link,
    copy: true,
  },
];

export default function ShareButton({ link, colors }) {
  // Get the current URL more reliably
  const currentLink = link || window.location.href;
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = (option) => {
    if (option.copy) {
      // Enhanced copy functionality with fallback
      const copyToClipboard = async (text) => {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            // Modern clipboard API
            await navigator.clipboard.writeText(text);
            return true;
          } else {
            // Fallback for older browsers or non-secure contexts
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
          }
        } catch (err) {
          console.error('Failed to copy: ', err);
          return false;
        }
      };

      copyToClipboard(currentLink).then((success) => {
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } else {
          // Fallback: show alert with link
          alert(`Copy this link: ${currentLink}`);
        }
      });
    } else {
      window.open(option.url(currentLink), '_blank', 'noopener,noreferrer');
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="bg-white rounded-full p-2 hover:bg-accentGreen transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
        title="Share"
        onClick={() => setOpen((o) => !o)}
        style={{ 
          backgroundColor: colors ? colors.darkGreen : 'white',
          color: colors ? colors.highlightGreen : '#65B741'
        }}
      >
        {/* Share nodes icon */}
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="18" cy="6" r="2.5" fill="currentColor" />
          <circle cx="6" cy="12" r="2.5" fill="currentColor" />
          <circle cx="18" cy="18" r="2.5" fill="currentColor" />
          <line x1="7.7" y1="12.9" x2="16.3" y2="17.1" stroke="currentColor" strokeWidth={2} />
          <line x1="16.3" y1="6.9" x2="7.7" y2="11.1" stroke="currentColor" strokeWidth={2} />
        </svg>
      </button>
      {open && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl py-2 z-50 border animate-fade-in"
          style={{
            backgroundColor: colors ? colors.darkGreen : 'white',
            borderColor: colors ? colors.mediumGreen : '#e5e7eb'
          }}
        >
          {shareOptions.map((option) => (
            <button
              key={option.name}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-all duration-200 ${
                option.copy && copied 
                  ? 'text-highlightGreen bg-accentGreen/20' 
                  : 'text-gray-300 hover:bg-mediumGreen/30'
              }`}
              onClick={() => handleShare(option)}
              style={{
                color: option.copy && copied ? colors?.highlightGreen : colors ? '#d1d5db' : '#374151'
              }}
            >
              <div className="flex-shrink-0">
                {typeof option.icon === 'function' ? option.icon(copied) : option.icon}
              </div>
              <span className="font-medium">{option.copy && copied ? 'Copied!' : option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 