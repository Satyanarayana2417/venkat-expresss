import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogIn } from 'lucide-react';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  returnPath?: string;
}

/**
 * LoginRequiredModal Component
 * 
 * Shows a modal when a guest user tries to access a protected action.
 * Provides options to login or cancel.
 */
export const LoginRequiredModal = ({ 
  isOpen, 
  onClose, 
  message = 'You need to be logged in to perform this action.',
  returnPath 
}: LoginRequiredModalProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login', { state: { from: returnPath || window.location.pathname } });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-primary" />
            Login Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogin} className="gradient-gold">
            Login Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
