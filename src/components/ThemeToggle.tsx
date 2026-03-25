import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { mode, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 z-40 w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors duration-500"
      aria-label="Toggle theme"
    >
      <motion.div
        key={mode}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {mode === "dark" ? <Moon size={14} /> : <Sun size={14} />}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
