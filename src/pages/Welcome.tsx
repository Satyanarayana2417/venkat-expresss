import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Welcome = () => {
  const navigate = useNavigate();

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
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="https://i.ibb.co/Lzj866ZR/IMG-20250916-103734-1.webp" 
              alt="Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-[#2E3B6B] hover:bg-[#253152] text-white rounded-none h-12 text-base font-semibold"
            >
              Log In
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="outline"
              className="w-full bg-transparent border-2 border-[#2E3B6B] text-[#2E3B6B] hover:bg-transparent hover:border-[#253152] hover:text-[#253152] rounded-none h-12 text-base font-semibold transition-colors"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
