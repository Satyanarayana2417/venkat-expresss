import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Package } from 'lucide-react';
import { toast } from 'sonner';

interface HistoryRecord {
  id: string;
  action: string;
  productInfo?: string;
  timestamp: Date;
}

const History = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error('Please log in to view your history');
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const historyRef = collection(db, 'history', user.uid, 'records');
        const q = query(historyRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);

        const historyData: HistoryRecord[] = snapshot.docs.map(doc => ({
          id: doc.id,
          action: doc.data().action || 'Unknown action',
          productInfo: doc.data().productInfo,
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        }));

        setRecords(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12 bg-gradient-to-b from-muted/50 to-background">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/home')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="font-heading text-4xl font-bold mb-2">Your History</h1>
          <p className="text-muted-foreground">Track your activity and orders</p>
        </div>

        {records.length === 0 ? (
          <Card className="shadow-premium-lg">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-heading text-xl font-semibold mb-2">No history found</h3>
              <p className="text-muted-foreground mb-6">
                Your activity history will appear here once you start using the platform
              </p>
              <Button onClick={() => navigate('/products')} className="gradient-gold">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id} className="shadow-premium hover:shadow-premium-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{record.action}</CardTitle>
                      {record.productInfo && (
                        <CardDescription className="mt-1">{record.productInfo}</CardDescription>
                      )}
                    </div>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {record.timestamp.toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
