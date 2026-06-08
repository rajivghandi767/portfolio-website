import { createContext, use, ReactNode } from "react";
import { useTheme } from "../hooks/useTheme";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => { /* noop */ },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const themeValues = useTheme();

  return (
    <ThemeContext value={themeValues}>
      {children}
    </ThemeContext>
  );
};

export const useThemeContext = () => use(ThemeContext);
