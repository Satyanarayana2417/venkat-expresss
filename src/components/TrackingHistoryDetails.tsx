import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: any;
  description?: string;
}

interface TrackingHistoryDetailsProps {
  trackingHistory: TrackingEvent[];
  className?: string;
  defaultExpanded?: boolean;
}

export const TrackingHistoryDetails = ({ 
  trackingHistory, 
  className,
  defaultExpanded = false 
}: TrackingHistoryDetailsProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!trackingHistory || trackingHistory.length === 0) {
    return null;
  }

  // Sort tracking history by timestamp (newest first)
  const sortedHistory = [...trackingHistory].sort((a, b) => {
    const timeA = a.timestamp?.toDate?.() || new Date(0);
    const timeB = b.timestamp?.toDate?.() || new Date(0);
    return timeB.getTime() - timeA.getTime();
  });

  // Get latest event for preview
  const latestEvent = sortedHistory[0];

  const formatTimestamp = (timestamp: any) => {
    try {
      if (!timestamp) return 'N/A';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy • hh:mm a');
    } catch (error) {
      return 'N/A';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={cn('border-t border-gray-200', className)}>
      {/* Latest Event Preview - Always Visible */}
      <div className="p-4 bg-blue-50/30">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatStatus(latestEvent.status)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <p className="text-xs text-gray-600">{latestEvent.location}</p>
                </div>
                {latestEvent.description && (
                  <p className="text-xs text-gray-600 mt-1">{latestEvent.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTimestamp(latestEvent.timestamp)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Full History Button */}
      {sortedHistory.length > 1 && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-t border-gray-200"
          >
            <span className="text-sm font-medium text-blue-600">
              {isExpanded ? 'Hide' : 'View'} Full Tracking History ({sortedHistory.length} events)
            </span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-blue-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-blue-600" />
            )}
          </button>

          {/* Expanded History */}
          {isExpanded && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-4">
                {sortedHistory.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    {/* Timeline Indicator */}
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                        index === 0 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      )}>
                        <CheckCircle className={cn(
                          'h-5 w-5',
                          index === 0 ? 'text-white' : 'text-gray-600'
                        )} />
                      </div>
                      {index < sortedHistory.length - 1 && (
                        <div className="w-0.5 h-full min-h-[40px] bg-gray-300 my-1" />
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 pb-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatStatus(event.status)}
                          </p>
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              Latest
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          <p className="text-xs text-gray-600">{event.location}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            {formatTimestamp(event.timestamp)}
                          </p>
                        </div>
                        
                        {event.description && (
                          <p className="text-xs text-gray-600 mt-2 pl-5 border-l-2 border-gray-200">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
