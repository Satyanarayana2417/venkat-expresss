import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, RefreshCw, Mail, Phone, MapPin, Package, Calendar, User, Trash2, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useSettings } from '@/hooks/useSettings';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuoteRequest {
  id: string;
  serviceType: string;
  itemName?: string;
  weight: number;
  packageType: string;
  destinationCountry: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  userId: string;  // User ID of the person who submitted the quote
  status: 'Pending' | 'Reviewing' | 'Quoted' | 'Accepted' | 'Rejected';
  createdAt: any;
}

const statusConfig = {
  Pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  Reviewing: { label: 'Reviewing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  Quoted: { label: 'Quoted', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  Accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800 border-green-200' },
  Rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
};

const serviceTypeLabels: Record<string, string> = {
  'you-give-we-ship': 'You Give, We Ship',
  'we-buy-for-you': 'We Buy for You',
  'express-shipping': 'Express Shipping',
};

export const AdminQuotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalQuoteCount, setTotalQuoteCount] = useState(0);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Load admin settings for dynamic contact info in emails
  const { settings } = useSettings();

  // Real-time listener for quote requests
  useEffect(() => {
    setLoading(true);
    
    // Create query to fetch quotes ordered by creation date (newest first)
    const quotesRef = collection(db, 'quote_requests');
    const q = query(quotesRef, orderBy('createdAt', 'desc'));
    
    // Set up real-time listener with onSnapshot
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedQuotes: QuoteRequest[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedQuotes.push({
            id: doc.id,
            serviceType: data.serviceType || 'you-give-we-ship',
            itemName: data.itemName || '',
            weight: data.weight || 0,
            packageType: data.packageType || 'N/A',
            destinationCountry: data.destinationCountry || 'N/A',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            userId: data.userId || 'unknown',  // Include userId from document
            status: data.status || 'Pending',
            createdAt: data.createdAt
          });
        });
        
        setQuotes(fetchedQuotes);
        setTotalQuoteCount(snapshot.size);
        
        // Show toast notification for new quotes (only after initial load)
        if (!loading && snapshot.docChanges().some(change => change.type === 'added')) {
          const newQuotes = snapshot.docChanges().filter(change => change.type === 'added');
          if (newQuotes.length > 0) {
            toast.success(`${newQuotes.length} new quote request${newQuotes.length > 1 ? 's' : ''} received!`, {
              description: 'A customer has submitted a new shipping quote request',
              duration: 5000,
            });
          }
        }
        
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching quote requests:', error);
        toast.error('Failed to load quote requests');
        setLoading(false);
      }
    );
    
    // Cleanup: Unsubscribe from the listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Filter quotes based on search and status
  const filteredQuotes = quotes.filter(quote => {
    const fullName = `${quote.firstName} ${quote.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.phone.includes(searchTerm) ||
      quote.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (newStatus: QuoteRequest['status']) => {
    if (!selectedQuote) return;

    setUpdatingStatus(true);
    try {
      const quoteRef = doc(db, 'quote_requests', selectedQuote.id);
      await updateDoc(quoteRef, {
        status: newStatus
      });

      toast.success('Status updated successfully', {
        description: `Quote request status changed to ${newStatus}`
      });

      // Update local state
      setSelectedQuote({ ...selectedQuote, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteQuote = async (quoteId: string, quoteName: string) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete the quote request from ${quoteName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const quoteRef = doc(db, 'quote_requests', quoteId);
      await deleteDoc(quoteRef);

      toast.success('Quote deleted successfully', {
        description: `Quote request from ${quoteName} has been permanently deleted`
      });

      // Close detail dialog if the deleted quote was being viewed
      if (selectedQuote?.id === quoteId) {
        setIsDetailOpen(false);
        setSelectedQuote(null);
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Failed to delete quote request', {
        description: 'Please try again or contact support if the problem persists'
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Generate Gmail compose URL for customer email with dynamic contact info
  const generateGmailComposeLink = (quote: QuoteRequest) => {
    const subject = `Quote Request #${quote.id.substring(0, 8).toUpperCase()} - ${quote.firstName} ${quote.lastName}`;
    
    // Use dynamic contact information from admin settings
    const storeName = settings.storeName || 'Venkat Express';
    const contactPhone = settings.contactPhone || '+91 XXXXXXXXXX';
    const contactEmail = settings.contactEmail || 'support@venkatexpress.com';
    
    const body = `Dear ${quote.firstName} ${quote.lastName},

Thank you for your quote request with ${storeName}. We have received your inquiry with the following details:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUOTE REQUEST DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Request ID: ${quote.id.substring(0, 12).toUpperCase()}
Status: ${quote.status}
Service Type: ${serviceTypeLabels[quote.serviceType] || quote.serviceType}
${quote.itemName ? `Item Name: ${quote.itemName}` : ''}
Package Type: ${quote.packageType}
Weight: ${quote.weight} kg
Destination: ${quote.destinationCountry.replace(/-/g, ' ').toUpperCase()}
Submitted: ${formatDate(quote.createdAt)}

CONTACT INFORMATION
Phone: ${quote.phone}
Email: ${quote.email}
Delivery Address: ${quote.address}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We are reviewing your request and will provide you with a detailed quote shortly.

If you have any questions or need to provide additional information, please feel free to reply to this email or contact us at:

📞 Phone: ${contactPhone}
📧 Email: ${contactEmail}
🌐 Website: www.venkatexpress.com

Best regards,
${storeName} Team
Your Reliable International Courier Partner`;

    // Encode parameters for Gmail URL
    const encodedTo = encodeURIComponent(quote.email);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Gmail compose URL format: https://mail.google.com/mail/?view=cm&fs=1&to=EMAIL&su=SUBJECT&body=BODY
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
  };

  // Format phone number for WhatsApp (international format without + or spaces)
  const formatPhoneForWhatsApp = (phone: string): string => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If number starts with 0, remove it (common in Indian numbers)
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // If number doesn't start with country code and is 10 digits (Indian mobile)
    // Add India country code (91)
    if (cleaned.length === 10 && !cleaned.startsWith('91')) {
      cleaned = '91' + cleaned;
    }
    
    // If number already has country code but starts with + (from international format)
    // it's already cleaned above
    
    return cleaned;
  };

  // Validate if phone number is usable for WhatsApp
  const isValidWhatsAppPhone = (phone: string): boolean => {
    const formatted = formatPhoneForWhatsApp(phone);
    // Valid international number should be at least 10 digits (some countries)
    // and typically not more than 15 digits
    return formatted.length >= 10 && formatted.length <= 15;
  };

  // Generate WhatsApp click-to-chat link with dynamic contact info
  const generateWhatsAppLink = (quote: QuoteRequest): string => {
    const formattedPhone = formatPhoneForWhatsApp(quote.phone);
    
    // Use dynamic contact information from admin settings
    const storeName = settings.storeName || 'Venkat Express';
    const contactPhone = settings.contactPhone || '+91 XXXXXXXXXX';
    const contactEmail = settings.contactEmail || 'support@venkatexpress.com';
    
    // Create preset message template
    const message = `*${storeName}: Quote Update*

Status: ${quote.status}

Hello ${quote.firstName} ${quote.lastName},

Thank you for choosing ${storeName}! This is regarding your quote request #${quote.id.substring(0, 8).toUpperCase()}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*QUOTE REQUEST DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 *Request ID:* ${quote.id.substring(0, 12).toUpperCase()}
📊 *Status:* ${quote.status}
🚚 *Service Type:* ${serviceTypeLabels[quote.serviceType] || quote.serviceType}
${quote.itemName ? `📋 *Item Name:* ${quote.itemName}\n` : ''}⚖️ *Weight:* ${quote.weight} kg
📦 *Package Type:* ${quote.packageType}
🌍 *Destination:* ${quote.destinationCountry.replace(/-/g, ' ').toUpperCase()}
📅 *Submitted:* ${formatDate(quote.createdAt)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Our team is currently reviewing your request. You can track your quote status anytime by visiting the quote tracking section on our website.

If you have any questions or need to provide additional information, feel free to reply to this message!

Best regards,
*${storeName} Team*
_Your Reliable International Courier Partner_

📞 Phone: ${contactPhone}
📧 Email: ${contactEmail}
🌐 Website: www.venkatexpress.com`;

    // URL encode the message
    const encodedMessage = encodeURIComponent(message);
    
    // Return WhatsApp click-to-chat URL
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };

  return (
    <AdminLayout title="Quote Requests">
      <div className="space-y-6">
        {/* Header with Quote Count */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Quote Requests
              {!loading && (
                <Badge variant="secondary" className="text-base font-semibold">
                  {totalQuoteCount}
                </Badge>
              )}
            </h2>
            <p className="text-muted-foreground">
              {loading ? 'Loading quote requests...' : 'Real-time shipping quote requests from customers'}
            </p>
          </div>
          {!loading && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Live</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, phone, or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Reviewing">Reviewing</SelectItem>
                  <SelectItem value="Quoted">Quoted</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quote Requests Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredQuotes.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No quote requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {quote.firstName} {quote.lastName}
                            </span>
                            <span className="text-xs text-gray-500">{quote.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {serviceTypeLabels[quote.serviceType] || quote.serviceType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm capitalize">
                            {quote.destinationCountry.replace(/-/g, ' ')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{quote.weight} kg</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDate(quote.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={statusConfig[quote.status].color}
                          >
                            {statusConfig[quote.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(quote)}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a 
                                href={generateGmailComposeLink(quote)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center"
                                title={`Send email to ${quote.email} via Gmail`}
                              >
                                <Mail className="h-4 w-4" />
                              </a>
                            </Button>
                            {isValidWhatsAppPhone(quote.phone) ? (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <a 
                                  href={generateWhatsAppLink(quote)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center"
                                  title={`Send WhatsApp message to ${quote.phone}`}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                title="Invalid or missing phone number"
                                className="opacity-50 cursor-not-allowed"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteQuote(quote.id, `${quote.firstName} ${quote.lastName}`)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quote Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Quote Request Details</DialogTitle>
            <DialogDescription>
              Review and manage this shipping quote request
            </DialogDescription>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-6">
              {/* Status Update */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Current Status</Label>
                      <div className="mt-1">
                        <Badge 
                          variant="outline" 
                          className={`${statusConfig[selectedQuote.status].color} text-base`}
                        >
                          {statusConfig[selectedQuote.status].label}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Update Status</Label>
                      <Select
                        value={selectedQuote.status}
                        onValueChange={(value) => handleUpdateStatus(value as QuoteRequest['status'])}
                        disabled={updatingStatus}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Reviewing">Reviewing</SelectItem>
                          <SelectItem value="Quoted">Quoted</SelectItem>
                          <SelectItem value="Accepted">Accepted</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Full Name</Label>
                      <p className="font-medium">{selectedQuote.firstName} {selectedQuote.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Date Submitted</Label>
                      <p className="font-medium">{formatDate(selectedQuote.createdAt)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </Label>
                      <p className="font-medium text-sm">{selectedQuote.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone
                      </Label>
                      <p className="font-medium">{selectedQuote.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Delivery Address
                      </Label>
                      <p className="font-medium text-sm">{selectedQuote.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipment Details */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Shipment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Service Type</Label>
                      <p className="font-medium">
                        {serviceTypeLabels[selectedQuote.serviceType] || selectedQuote.serviceType}
                      </p>
                    </div>
                    {selectedQuote.itemName && (
                      <div>
                        <Label className="text-xs text-gray-500">Item Name</Label>
                        <p className="font-medium">{selectedQuote.itemName}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs text-gray-500">Package Weight</Label>
                      <p className="font-medium">{selectedQuote.weight} kg</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Package Type</Label>
                      <p className="font-medium capitalize">
                        {selectedQuote.packageType.replace(/-/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Destination Country</Label>
                      <p className="font-medium capitalize">
                        {selectedQuote.destinationCountry.replace(/-/g, ' ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleDeleteQuote(selectedQuote.id, `${selectedQuote.firstName} ${selectedQuote.lastName}`)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Quote
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    asChild
                  >
                    <a 
                      href={generateGmailComposeLink(selectedQuote)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email via Gmail
                    </a>
                  </Button>
                  {isValidWhatsAppPhone(selectedQuote.phone) ? (
                    <Button
                      variant="outline"
                      asChild
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <a 
                        href={generateWhatsAppLink(selectedQuote)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      title="Invalid or missing phone number"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                  <Button onClick={() => setIsDetailOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
