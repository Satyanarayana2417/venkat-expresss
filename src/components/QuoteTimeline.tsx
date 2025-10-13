import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, Send, Package, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface QuoteTimelineProps {
  quoteId: string;
  onClose?: () => void;
}

interface QuoteData {
  status: 'Pending' | 'Reviewing' | 'Quoted' | 'Accepted' | 'Rejected';
  createdAt: any;
  firstName: string;
  lastName: string;
  serviceType: string;
  weight: number;
  destinationCountry: string;
}

const statusConfig = {
  Pending: { 
    label: 'Request Submitted', 
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: FileText,
    description: 'Your quote request has been received and is waiting for review.'
  },
  Reviewing: { 
    label: 'Under Review', 
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Clock,
    description: 'Our team is currently reviewing your request and preparing a quote.'
  },
  Quoted: { 
    label: 'Quote Sent', 
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Send,
    description: 'Your quote has been sent to your email. Please review and respond.'
  },
  Accepted: { 
    label: 'Completed', 
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    description: 'Your quote has been accepted. We will contact you shortly with next steps.'
  },
  Rejected: { 
    label: 'Cancelled', 
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: X,
    description: 'This quote request has been cancelled or rejected.'
  },
};

const milestones: Array<'Pending' | 'Reviewing' | 'Quoted' | 'Accepted'> = [
  'Pending',
  'Reviewing',
  'Quoted',
  'Accepted'
];

export const QuoteTimeline = ({ quoteId, onClose }: QuoteTimelineProps) => {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!quoteId) {
      setLoading(false);
      return;
    }

    // Set up real-time listener for the quote document
    const quoteRef = doc(db, 'quote_requests', quoteId);
    
    const unsubscribe = onSnapshot(
      quoteRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setQuoteData({
            status: data.status || 'Pending',
            createdAt: data.createdAt,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            serviceType: data.serviceType || '',
            weight: data.weight || 0,
            destinationCountry: data.destinationCountry || '',
          });
          setError('');
        } else {
          setError('Quote request not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching quote:', err);
        setError('Failed to load quote status. You may not have permission to view this quote.');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [quoteId]);

  if (loading) {
    return (
      <Card className="mt-8 animate-pulse">
        <CardContent className="p-8">
          <div className="h-64 bg-gray-100 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8 border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <X className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quoteData) {
    return null;
  }

  const currentStatusIndex = milestones.indexOf(quoteData.status as any);
  const isRejected = quoteData.status === 'Rejected';
  const currentConfig = statusConfig[quoteData.status];
  const CurrentIcon = currentConfig.icon;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy • HH:mm');
    } catch {
      return '';
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'you-give-we-ship': 'You Give, We Ship',
      'we-buy-for-you': 'We Buy for You',
      'express-shipping': 'Express Shipping',
    };
    return labels[type] || type;
  };

  return (
    <Card className="mt-8 border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Quote Request Status
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time updates for your shipping quote request
            </p>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status Banner */}
        <div className={`${currentConfig.bgColor} ${currentConfig.borderColor} border-2 rounded-lg p-4`}>
          <div className="flex items-start gap-4">
            <div className={`${currentConfig.color} rounded-full p-3`}>
              <CurrentIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-lg font-bold ${currentConfig.textColor}`}>
                  {currentConfig.label}
                </h3>
                <Badge variant="outline" className={currentConfig.borderColor}>
                  Current Status
                </Badge>
              </div>
              <p className="text-sm text-gray-700">
                {currentConfig.description}
              </p>
              {quoteData.createdAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Submitted: {formatDate(quoteData.createdAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quote Details Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-sm text-gray-700 mb-3">Request Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <span className="ml-2 font-medium">{quoteData.firstName} {quoteData.lastName}</span>
            </div>
            <div>
              <span className="text-gray-500">Service:</span>
              <span className="ml-2 font-medium">{getServiceTypeLabel(quoteData.serviceType)}</span>
            </div>
            <div>
              <span className="text-gray-500">Weight:</span>
              <span className="ml-2 font-medium">{quoteData.weight} kg</span>
            </div>
            <div>
              <span className="text-gray-500">Destination:</span>
              <span className="ml-2 font-medium capitalize">
                {quoteData.destinationCountry.replace(/-/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {!isRejected && (
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-gray-700">Progress Timeline</h4>
            <div className="relative">
              {milestones.map((milestone, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const config = statusConfig[milestone];
                const Icon = config.icon;
                const isLast = index === milestones.length - 1;

                return (
                  <div key={milestone} className="relative">
                    <div className="flex items-start gap-4 pb-8">
                      {/* Icon */}
                      <div className="relative z-10">
                        <div
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all
                            ${isCompleted 
                              ? `${config.color} shadow-md` 
                              : 'bg-gray-200'
                            }
                            ${isCurrent ? 'ring-4 ring-primary ring-offset-2 ring-offset-white scale-110' : ''}
                          `}
                        >
                          <Icon 
                            className={`h-5 w-5 ${isCompleted ? 'text-white' : 'text-gray-400'}`} 
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <h5 className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {config.label}
                        </h5>
                        <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                          {config.description}
                        </p>
                      </div>
                    </div>

                    {/* Connecting Line */}
                    {!isLast && (
                      <div
                        className={`absolute left-5 top-10 w-0.5 h-8 -translate-x-1/2 transition-colors
                          ${index < currentStatusIndex ? config.color : 'bg-gray-200'}
                        `}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> If you have any questions about your quote request, 
            please contact our support team or check your email for updates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
