import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, List, Eye } from "lucide-react";
import ReservationList from "./ReservationList";

interface ReservationData {
  confirmationCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: number;
  reservationDate: string;
  reservationTime: string;
  tableType: string;
}

interface ReservationReceiptProps {
  open: boolean;
  onClose: () => void;
  data: ReservationData | null;
}

const ReservationReceipt = ({ open, onClose, data }: ReservationReceiptProps) => {
  const [listOpen, setListOpen] = useState(false);
  
  // Disable scrolling when receipt is open
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
  
  if (!data) return null;

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
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-sm bg-card border border-border overflow-hidden"
            >
              {/* Gold accent top */}
              <div className="h-[2px] w-full bg-primary" />

              {/* Confirmed icon */}
              <div className="flex flex-col items-center pt-10 pb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 rounded-full border border-primary flex items-center justify-center mb-5"
                >
                  <Check size={18} className="text-primary" />
                </motion.div>
                <p className="text-primary font-body text-[10px] tracking-[0.3em] uppercase mb-2">
                  Confirmed
                </p>
                <h3 className="font-display text-3xl">Élysée</h3>
              </div>

              {/* Dashed separator */}
              <div className="mx-8 border-t border-dashed border-border" />

              {/* Details */}
              <div className="px-8 py-8 space-y-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground font-body text-[10px] tracking-[0.2em] uppercase">
                    Guest
                  </span>
                  <span className="font-display text-lg">{data.guestName}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground font-body text-[10px] tracking-[0.2em] uppercase">
                    Email
                  </span>
                  <span className="font-body text-sm">{data.guestEmail}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground font-body text-[10px] tracking-[0.2em] uppercase">
                    Phone
                  </span>
                  <span className="font-body text-sm">{data.guestPhone}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground font-body text-[10px] tracking-[0.2em] uppercase">
                    Date
                  </span>
                  <span className="font-display text-lg">{data.reservationDate}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground font-body text-[10px] tracking-[0.2em] uppercase">
                    Time
                  </span>
                  <span className="font-display text-lg">{data.reservationTime}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground font-body text-[10px] tracking-[0.2em] uppercase">
                    Party
                  </span>
                  <span className="font-display text-lg">
                    {data.guestCount} {data.guestCount === 1 ? "Guest" : "Guests"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground font-body text-[10px] tracking-[0.2em] uppercase">
                    Table
                  </span>
                  <span className="font-display text-lg">{data.tableType}</span>
                </div>
              </div>

              {/* Dashed separator */}
              <div className="mx-8 border-t border-dashed border-border" />

              {/* Confirmation code */}
              <div className="px-8 py-6 text-center">
                <p className="text-muted-foreground font-body text-[10px] tracking-[0.2em] uppercase mb-2">
                  Confirmation
                </p>
                <p className="font-body text-sm tracking-[0.3em] text-foreground">
                  {data.confirmationCode}
                </p>
              </div>

              {/* Action buttons */}
              <div className="px-8 pb-8 space-y-3">
                <button
                  onClick={() => setListOpen(true)}
                  className="w-full border border-border text-muted-foreground py-3 text-xs tracking-[0.2em] uppercase font-body hover:border-primary hover:text-primary transition-colors duration-500"
                >
                  <Eye size={14} className="inline mr-2" />
                  View All Reservations
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-primary text-primary py-3 text-xs tracking-[0.2em] uppercase font-body hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
                >
                  Done
                </button>
              </div>

              {/* Close icon */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ReservationList 
        open={listOpen} 
        onClose={() => setListOpen(false)} 
      />
    </>
  );
};

export default ReservationReceipt;
