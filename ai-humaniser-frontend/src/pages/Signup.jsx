import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const COLORS = {
    dark: '#11150d',
    darkGreen: '#314026',
    mediumGreen: '#526a40',
    lightGreen: '#739559',
    accentGreen: '#94bf73',
    highlightGreen: '#b5ea8c'
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // The signUp function returns an object with data and error properties
      const { data, error: signUpError } = await signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
          },
        },
      });

      // Explicitly check for an error from Supabase
      if (signUpError) {
        // This will now catch errors like "User already registered"
        throw signUpError;
      }

      // Check if a user was created but needs confirmation
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('Error creating user. Please try again.');
      } else {
      setSuccessMessage('Signup successful! Please check your email to verify your account.');
      }

    } catch (err) {
      // Display the actual error message from Supabase
      setError(err.message || 'An unknown error occurred during signup.');
      console.error("Signup Error:", err); // Also log the full error object
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, colorClass: 'bg-gray-200', text: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { strength: score, colorClass: 'bg-red-500', text: 'Weak' };
    if (score <= 3) return { strength: score, colorClass: 'bg-yellow-500', text: 'Fair' };
    if (score <= 4) return { strength: score, colorClass: 'bg-blue-500', text: 'Good' };
    return { strength: score, colorClass: 'bg-green-500', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength(form.password);
  const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4" 
         style={{ background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkGreen} 100%)` }}>
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${COLORS.highlightGreen} 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: COLORS.highlightGreen }}>
            AI Humaniser
          </h1>
          <p className="text-lg" style={{ color: COLORS.accentGreen }}>
            Create your account and start humanizing AI content
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border" 
             style={{ borderColor: COLORS.mediumGreen }}>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.darkGreen }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ borderColor: COLORS.mediumGreen, background: '#f8f9fa' }}
                  placeholder="Enter your full name" required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.darkGreen }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ borderColor: COLORS.mediumGreen, background: '#f8f9fa' }}
                  placeholder="Enter your email" required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.darkGreen }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ borderColor: COLORS.mediumGreen, background: '#f8f9fa' }}
                  placeholder="Create a password" required
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {form.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 w-8 rounded-full transition-all duration-200 ${
                            level <= passwordStrength.strength
                              ? passwordStrength.colorClass
                              : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-xs font-medium" style={{ color: COLORS.mediumGreen }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.darkGreen }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ 
                    borderColor: passwordsMatch ? COLORS.accentGreen : COLORS.mediumGreen,
                    background: '#f8f9fa'
                  }}
                  placeholder="Confirm your password" required
                />
                <button
                  type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                
                {form.confirmPassword && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    {passwordsMatch ? (
                      <CheckCircle size={20} style={{ color: COLORS.accentGreen }} />
                    ) : (
                      <AlertCircle size={20} style={{ color: '#ef4444' }} />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="/terms" className="font-medium hover:underline" style={{ color: COLORS.accentGreen }}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="font-medium hover:underline" style={{ color: COLORS.accentGreen }}>
                  Privacy Policy
                </a>
              </label>
          </div>

            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {error}
          </div>
            )}
            
            {successMessage && (
              <div className="p-3 rounded-lg text-sm" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                {successMessage}
              </div>
            )}

            <button
              type="submit" disabled={isLoading || !agreedToTerms || !passwordsMatch || !form.password || !form.confirmPassword}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white text-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${COLORS.darkGreen} 0%, ${COLORS.mediumGreen} 100%)` }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button className="w-full py-3 px-4 rounded-lg border-2 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 flex items-center justify-center gap-3"
                  style={{ borderColor: COLORS.mediumGreen }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <a href="/login" className="font-semibold hover:underline transition-colors duration-200" 
               style={{ color: COLORS.accentGreen }}>
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

