import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { 
  getReservations, 
  updateReservationStatus,
  type Reservation 
} from "@/services/storageService";

interface ReservationListProps {
  open: boolean;
  onClose: () => void;
}

const ReservationList = ({ open, onClose }: ReservationListProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Disable scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setReservations(getReservations());
    }
  }, [open]);

  const handleStatusUpdate = (id: string, status: Reservation['status']) => {
    if (updateReservationStatus(id, status)) {
      setReservations(getReservations());
      toast.success(`Reservation ${status}`);
    } else {
      toast.error("Failed to update reservation");
    }
  };

  const generateReceiptHTML = () => {
    return `
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 100%; height: 2px; background: #d4a574; margin-bottom: 20px;"></div>
        <h2 style="font-size: 24px; margin: 0; font-weight: 300;">Élysée</h2>
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; margin: 5px 0; color: #d4a574;">Confirmed</p>
      </div>
      
      <div style="border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 20px 0; margin: 20px 0;">
        ${reservations.map(reservation => `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #666;">Guest</span>
              <span style="font-size: 16px; font-weight: 300;">${reservation.guestName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #666;">Email</span>
              <span style="font-size: 14px;">${reservation.guestEmail || 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #666;">Phone</span>
              <span style="font-size: 14px;">${reservation.guestPhone || 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #666;">Date</span>
              <span style="font-size: 16px; font-weight: 300;">${reservation.reservationDate}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #666;">Time</span>
              <span style="font-size: 16px; font-weight: 300;">${reservation.reservationTime}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #666;">Party</span>
              <span style="font-size: 16px; font-weight: 300;">${reservation.guestCount} ${reservation.guestCount === 1 ? "Guest" : "Guests"}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #666;">Table</span>
              <span style="font-size: 16px; font-weight: 300;">${reservation.tableType}</span>
            </div>
            <div style="border-top: 1px dashed #ccc; padding-top: 10px;">
              <div style="text-align: center;">
                <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #666; margin-bottom: 5px;">Confirmation</p>
                <p style="font-size: 14px; letter-spacing: 0.3em; font-family: monospace;">${reservation.confirmationCode}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
        <p>42 Rue du Faubourg, Paris</p>
        <p>+33 1 42 68 05 00</p>
      </div>
    `;
  };

  const handleExport = async () => {
    try {
      // Create a temporary container for the receipt
      const receiptElement = document.createElement('div');
      receiptElement.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 400px;
        background: white;
        padding: 40px;
        font-family: system-ui, -apple-system, sans-serif;
        color: #000;
      `;
      
      receiptElement.innerHTML = generateReceiptHTML();
      document.body.appendChild(receiptElement);
      
      // Capture as image
      const canvas = await html2canvas(receiptElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      });
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reservations-${new Date().toISOString().split('T')[0]}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Reservation receipt downloaded successfully");
        }
      }, 'image/png');
      
      // Clean up
      document.body.removeChild(receiptElement);
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error("Failed to generate receipt image");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-4xl max-h-[80vh] bg-card border border-border overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <p className="text-primary font-body text-[10px] tracking-[0.3em] uppercase mb-2">
                    Portfolio Demo
                  </p>
                  <h3 className="font-display text-2xl">All Reservations</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {reservations.length} reservation{reservations.length !== 1 ? 's' : ''} stored locally
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReceiptModalOpen(true)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="View receipt"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={handleExport}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Export reservations"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-6">
                {reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No reservations yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Create your first reservation to see it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <motion.div
                        key={reservation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h4 className="font-display text-lg">{reservation.guestName}</h4>
                              <span className={`text-xs font-body uppercase tracking-[0.2em] ${getStatusColor(reservation.status)}`}>
                                {reservation.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Code:</span>
                                <p className="font-mono">{reservation.confirmationCode}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Date:</span>
                                <p>{formatDate(reservation.reservationDate)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Time:</span>
                                <p>{reservation.reservationTime}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Guests:</span>
                                <p>{reservation.guestCount} people</p>
                              </div>
                            </div>
                            
                            <div className="mt-3 text-sm">
                              <span className="text-muted-foreground">Contact:</span>
                              <span className="ml-2">{reservation.guestEmail}</span>
                              <span className="ml-4">{reservation.guestPhone}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {reservation.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                                className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {receiptModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setReceiptModalOpen(false)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md max-h-[80vh] bg-white rounded-lg shadow-2xl overflow-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setReceiptModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Receipt content */}
              <div 
                className="p-8"
                dangerouslySetInnerHTML={{ __html: generateReceiptHTML() }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReservationList;
