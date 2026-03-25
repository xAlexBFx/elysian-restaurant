import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List } from "lucide-react";
import ReservationModal from "./ReservationModal";
import ReservationList from "./ReservationList";

const FloatingReserveButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const handleListClick = () => {
    setListOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 1 // Show after page loads
          }}
          onClick={handleListClick}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-background border border-primary text-primary rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="View all reservations"
        >
          <List size={20} />
          
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-16 top-1/2 -translate-y-1/2 bg-background border border-border px-3 py-1 rounded-md text-xs whitespace-nowrap pointer-events-none"
          >
            View Reservations
          </motion.div>
        </motion.button>
      </AnimatePresence>

      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <ReservationList open={listOpen} onClose={() => setListOpen(false)} />
    </>
  );
};

export default FloatingReserveButton;
