import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { 
  saveReservation, 
  getTimeSlotAvailability, 
  isTimeSlotAvailable,
  formatPhoneNumber,
  validatePhoneNumber,
  validateEmail,
  getAvailabilityData,
  type Reservation 
} from "@/services/storageService";
import ReservationReceipt from "./ReservationReceipt";
import CalendarPicker from "./CalendarPicker";

const timeSlots = [
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
];

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

const tableTypes = ["Standard", "Window", "Private", "Bar"];

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
}

interface ReceiptData {
  confirmationCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: number;
  reservationDate: string;
  reservationTime: string;
  tableType: string;
}

const ReservationModal = ({ open, onClose }: ReservationModalProps) => {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [tableType, setTableType] = useState("Standard");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [availabilityData, setAvailabilityData] = useState(getAvailabilityData());

  // Refresh availability data when modal opens
  useEffect(() => {
    if (open) {
      setAvailabilityData(getAvailabilityData());
    }
  }, [open]);

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

  const resetForm = () => {
    setStep(0);
    setDate("");
    setTime("");
    setGuests(2);
    setTableType("Standard");
    setName("");
    setEmail("");
    setPhone("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async () => {
    console.log('Submit attempt:', { name, email, phone, date, time, guests });
    
    if (!name.trim() || !date) {
      console.error('Missing required fields:', { name: name.trim(), date });
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate that either email OR phone is valid
    const isEmailValid = email.trim() ? validateEmail(email.trim()) : false;
    const isPhoneValid = phone.trim() ? validatePhoneNumber(phone) : false;
    
    console.log('Validation results:', { isEmailValid, isPhoneValid, email: email.trim(), phone });
    
    if (!isEmailValid && !isPhoneValid) {
      toast.error("Please provide a valid email address or phone number");
      return;
    }
    
    setSubmitting(true);

    try {
      const reservation = saveReservation({
        guestName: name.trim(),
        guestEmail: email.trim() || '', // Allow empty email if phone is valid
        guestPhone: phone || '', // Allow empty phone if email is valid
        guestCount: guests,
        reservationDate: date,
        reservationTime: time,
        tableType: tableType,
      });

      console.log('Reservation saved:', reservation);

      setSubmitting(false);
      onClose();
      resetForm();
      
      // Refresh availability data after successful reservation
      setAvailabilityData(getAvailabilityData());

      // Show receipt
      setReceiptData({
        confirmationCode: reservation.confirmationCode,
        guestName: reservation.guestName,
        guestEmail: reservation.guestEmail,
        guestPhone: reservation.guestPhone,
        guestCount: reservation.guestCount,
        reservationDate: reservation.reservationDate,
        reservationTime: reservation.reservationTime,
        tableType: reservation.tableType,
      });
      setReceiptOpen(true);
      
      toast.success("Reservation confirmed successfully!");
    } catch (error) {
      console.error('Save error:', error);
      setSubmitting(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const canProceed = () => {
    if (step === 0) return !!date;
    if (step === 1) return !!time && isTimeSlotAvailable(time);
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) {
      if (!name.trim()) return false;
      
      // Check if either email OR phone is valid
      const isEmailValid = email.trim() ? validateEmail(email.trim()) : false;
      const isPhoneValid = phone.trim() ? validatePhoneNumber(phone) : false;
      
      return isEmailValid || isPhoneValid;
    }
    return false;
  };

  const stepLabels = ["Select Date", "Select Time", "Party Size", "Table Type", "Guest Info"];
  const stepTitles = ["When?", "What Time?", "How Many?", "Where?", "Almost There"];
  const totalSteps = 5;

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
              className="relative z-10 w-full max-w-md bg-card border border-border p-8 md:p-10"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>

              <p className="text-primary font-body text-[10px] tracking-[0.3em] uppercase mb-3">
                {stepLabels[step]}
              </p>
              <h3 className="font-display text-3xl md:text-4xl mb-8">
                {stepTitles[step]}
              </h3>

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="date"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CalendarPicker 
                      selectedDate={date} 
                      onDateSelect={setDate} 
                    />
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="time"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 gap-2"
                  >
                    {timeSlots.map((t) => {
                      const availability = availabilityData.find(s => s.time === t);
                      const isAvailable = availability ? availability.booked < availability.totalCapacity : true;
                      const isAlmostFull = availability?.isAlmostFull;
                      
                      return (
                        <button
                          key={t}
                          onClick={() => setTime(t)}
                          disabled={!isAvailable}
                          className={`py-3 text-xs tracking-[0.1em] font-body border transition-colors duration-300 relative ${
                            time === t
                              ? "border-primary bg-primary text-primary-foreground"
                              : isAvailable
                              ? "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                              : "border-border text-muted-foreground/30 cursor-not-allowed"
                          }`}
                        >
                          <div>{t}</div>
                          {isAlmostFull && isAvailable && (
                            <div className="absolute -top-1 -right-1 text-xs">🔥</div>
                          )}
                          {!isAvailable && (
                            <div className="text-xs opacity-50">Full</div>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="guests"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-4 gap-2">
                      {guestOptions.map((g) => (
                        <button
                          key={g}
                          onClick={() => setGuests(g)}
                          className={`py-3 text-sm font-body border transition-colors duration-300 ${
                            guests === g
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    {guests >= 8 && (
                      <p className="text-muted-foreground text-xs font-body text-center">
                        For parties above 8, contact us
                      </p>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 gap-2"
                  >
                    {tableTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTableType(t)}
                        className={`py-4 text-xs tracking-[0.15em] uppercase font-body border transition-colors duration-300 ${
                          tableType === t
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full bg-transparent border-b border-border py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <p className="text-muted-foreground text-xs font-body">
                      Either email or phone number is required
                    </p>
                    
                    {/* Summary */}
                    <div className="mt-6 p-4 border border-border rounded-lg">
                      <p className="text-xs font-body text-muted-foreground mb-2">Reservation Summary</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span>{date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span>{time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Guests:</span>
                          <span>{guests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Table:</span>
                          <span>{tableType}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mt-10">
                {step > 0 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="text-muted-foreground text-xs tracking-[0.2em] uppercase font-body hover:text-foreground transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => (step < totalSteps - 1 ? setStep(step + 1) : handleSubmit())}
                  disabled={!canProceed() || submitting}
                  className="border border-primary text-primary px-8 py-3 text-xs tracking-[0.2em] uppercase font-body hover:bg-primary hover:text-primary-foreground transition-colors duration-500 disabled:opacity-30 disabled:pointer-events-none"
                >
                  {submitting ? "Saving…" : step < totalSteps - 1 ? "Continue" : "Confirm"}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalSteps }).map((_, s) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      s === step ? "w-6 bg-primary" : "w-1 bg-border"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReservationReceipt
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        data={receiptData}
      />
    </>
  );
};

export default ReservationModal;
