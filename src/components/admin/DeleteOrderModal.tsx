import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  orderNumber: string;
  customerName: string;
}

export const DeleteOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  customerName,
}: DeleteOrderModalProps) => {
  const [deletionReason, setDeletionReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isReasonValid = deletionReason.trim().length >= 15;

  const handleConfirmDelete = async () => {
    if (!isReasonValid) {
      toast.error('Please provide a detailed reason (minimum 15 characters)');
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm(deletionReason.trim());
      setDeletionReason('');
      onClose();
    } catch (error) {
      console.error('Error deleting order:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setDeletionReason('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Delete Order - Permanent Action
          </DialogTitle>
          <DialogDescription className="text-base">
            You are about to permanently delete order <span className="font-mono font-semibold">{orderNumber}</span> for customer <span className="font-semibold">{customerName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning Banner */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">
                  ⚠️ WARNING: This action is permanent and cannot be undone!
                </h4>
                <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                  <li>The order will be permanently removed from the database</li>
                  <li>Customer will no longer see this order in their account</li>
                  <li>All order data, tracking history, and payment details will be deleted</li>
                  <li>This action will be logged in the audit trail</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mandatory Justification Form */}
          <div className="space-y-3">
            <Label htmlFor="deletionReason" className="text-base font-semibold flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Reason for Deletion (Required) *
            </Label>
            <Textarea
              id="deletionReason"
              placeholder="Please provide a detailed justification for deleting this order (minimum 15 characters)&#10;&#10;Examples:&#10;- Duplicate order created by customer&#10;- Customer requested cancellation and refund processed&#10;- Test order placed by mistake&#10;- Fraudulent order detected"
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
              className="min-h-[150px] resize-none"
              disabled={isDeleting}
            />
            <div className="flex items-center justify-between text-sm">
              <span className={deletionReason.trim().length >= 15 ? 'text-green-600' : 'text-gray-500'}>
                {deletionReason.trim().length} / 15 characters minimum
              </span>
              {deletionReason.trim().length > 0 && deletionReason.trim().length < 15 && (
                <span className="text-red-600 font-medium">
                  {15 - deletionReason.trim().length} more characters needed
                </span>
              )}
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              By clicking "Confirm Deletion" below, you acknowledge that:
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside ml-2">
              <li>You have provided a valid justification for this deletion</li>
              <li>This action will be permanently logged with your admin account</li>
              <li>This deletion cannot be reversed or undone</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={!isReasonValid || isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Confirm Deletion
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
