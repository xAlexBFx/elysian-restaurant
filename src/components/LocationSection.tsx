import { motion } from "framer-motion";
import { MapPin, Clock, Phone } from "lucide-react";

const LocationSection = () => {
  return (
    <section className="relative h-screen w-full snap-start snap-always flex flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(var(--primary)/0.04)_0%,_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-5xl px-6"
      >
        <div className="text-center mb-16">
          <p className="text-primary font-body text-xs tracking-[0.3em] uppercase mb-6">Find Us</p>
          <h2 className="font-display text-5xl md:text-7xl font-normal tracking-tight">
            Location & Hours
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-10 h-10 border border-border flex items-center justify-center mx-auto mb-6">
              <MapPin size={14} className="text-primary" />
            </div>
            <h3 className="font-display text-lg mb-3">Address</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              42 Rue du Faubourg<br />
              Saint-Honoré<br />
              75008 Paris, France
            </p>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-10 h-10 border border-border flex items-center justify-center mx-auto mb-6">
              <Clock size={14} className="text-primary" />
            </div>
            <h3 className="font-display text-lg mb-3">Hours</h3>
            <div className="text-muted-foreground font-body text-sm leading-relaxed space-y-1">
              <p>Lunch · 12:00 – 14:30</p>
              <p>Dinner · 18:00 – 22:30</p>
              <p className="text-primary/60 text-xs mt-2 tracking-[0.1em] uppercase">Closed Mondays</p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-10 h-10 border border-border flex items-center justify-center mx-auto mb-6">
              <Phone size={14} className="text-primary" />
            </div>
            <h3 className="font-display text-lg mb-3">Contact</h3>
            <div className="text-muted-foreground font-body text-sm leading-relaxed space-y-1">
              <p>+33 1 42 68 05 00</p>
              <p>reservations@elysee.fr</p>
            </div>
          </motion.div>
        </div>

        {/* Minimal map embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 w-full h-48 md:h-64 overflow-hidden border border-border"
        >
          <iframe
            title="Élysée Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.2158!2d2.3159!3d48.8698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sRue%20du%20Faubourg%20Saint-Honor%C3%A9%2C%2075008%20Paris!5e0!3m2!1sen!2sfr!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(1) contrast(1.1) brightness(0.7)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LocationSection;
