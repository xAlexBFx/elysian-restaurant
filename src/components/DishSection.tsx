import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

interface DishSectionProps {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  index: number;
  reverse?: boolean;
  chefSelection?: boolean;
}

const DishSection = ({ image, title, subtitle, description, price, index, reverse, chefSelection }: DishSectionProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="relative h-screen w-full snap-start snap-always flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          loading="lazy"
          width={1024}
          height={1024}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-20 px-6 md:px-20 max-w-7xl w-full`}>
        {/* Dish image with hover zoom + tap expand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.5 }}
          className={`relative w-64 h-64 md:w-[28rem] md:h-[28rem] flex-shrink-0 rounded-full overflow-hidden cursor-pointer
            ${chefSelection ? 'shadow-[0_0_100px_rgba(196,164,80,0.3)]' : 'shadow-[0_0_80px_rgba(196,164,80,0.15)]'}`}
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.img
            src={image}
            alt={title}
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full h-full object-cover"
            animate={expanded ? { scale: 1.2 } : { scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          
          {/* Chef's Selection badge */}
          {chefSelection && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: "spring", damping: 15 }}
              viewport={{ once: true }}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-primary text-primary-foreground px-3 py-1.5 flex items-center gap-1.5"
            >
              <Star size={10} fill="currentColor" />
              <span className="font-body text-[9px] tracking-[0.2em] uppercase">Chef's Selection</span>
            </motion.div>
          )}
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center md:text-left"
        >
          {chefSelection && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-primary font-body text-[10px] tracking-[0.3em] uppercase mb-2 flex items-center gap-2 justify-center md:justify-start"
            >
              <Star size={8} fill="currentColor" /> Recommended by Chef
            </motion.p>
          )}
          <p className="text-primary font-body text-xs tracking-[0.3em] uppercase mb-4">{subtitle}</p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-none mb-6">
            {title}
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base max-w-md leading-relaxed mb-8">
            {description}
          </p>
          <motion.span
            className="font-display text-2xl md:text-3xl text-primary inline-block"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {price}
          </motion.span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase font-body">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
      </motion.div>
    </section>
  );
};

export default DishSection;
