import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, User, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  
  // Get return path from location state
  const from = (location.state as any)?.from || '/';
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      // Redirect to return path or home
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E3B6B] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#7B89C2] rounded-full opacity-60 -translate-y-1/4 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2E3B6B] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#7B89C2] rounded-full opacity-60 translate-y-1/4 -translate-x-1/3"></div>

      {/* Main Card Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8">SIGN IN</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: undefined });
                  }}
                  className="pl-10 pr-4 h-12 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B6B9E] focus:border-transparent"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: undefined });
                  }}
                  className="pl-10 pr-4 h-12 bg-white border border-gray-200 rounded-lg text-gray-400 placeholder:text-gray-300 focus:ring-2 focus:ring-[#5B6B9E] focus:border-transparent"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || !formData.email || !formData.password}
                className="w-full bg-[#2E3B6B] hover:bg-[#253152] text-white rounded-none h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'SIGN IN'
                )}
              </Button>
            </div>

            {/* Forget Password Link */}
            <div className="text-center pt-2">
              <Link to="/forgot-password" className="text-gray-400 text-sm hover:text-gray-600">
                Forget Password?
              </Link>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                don't have an account?{' '}
                <Link to="/signup" className="text-[#2E3B6B] font-bold hover:underline">
                  SIGN UP
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
