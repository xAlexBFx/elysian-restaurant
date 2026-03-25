import { useState } from "react";
import { motion } from "framer-motion";
import ReservationModal from "./ReservationModal";

const ReservationSection = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative h-screen w-full snap-start snap-always flex flex-col items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.03)_0%,_transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-6"
        >
          <p className="text-primary font-body text-xs tracking-[0.3em] uppercase mb-6">Reserve</p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight mb-8">
            Your Table<br />Awaits
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto mb-12 leading-relaxed">
            Join us for an unforgettable evening. Our tasting menu changes with the seasons, 
            crafted from the finest ingredients sourced worldwide.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="border border-primary text-primary px-10 py-4 text-xs tracking-[0.3em] uppercase font-body hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
          >
            Reserve Now
          </button>
          <div className="mt-16 flex flex-col items-center gap-2 text-muted-foreground font-body text-xs tracking-[0.2em]">
            <span>42 Rue du Faubourg, Paris</span>
            <span>+33 1 42 68 05 00</span>
          </div>
        </motion.div>
      </section>

      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default ReservationSection;
