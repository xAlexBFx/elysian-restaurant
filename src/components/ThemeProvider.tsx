import { useEffect, createContext, useContext } from "react";

interface ThemeContextType {
  mode: "dark";
}

const ThemeContext = createContext<ThemeContextType>({ mode: "dark" });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }, []);

  return (
    <ThemeContext.Provider value={{ mode: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
};
