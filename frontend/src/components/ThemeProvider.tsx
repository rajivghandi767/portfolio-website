import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeContextType } from "../types/index";

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Storage key for theme preference
const THEME_STORAGE_KEY = "rajivwallace-theme-preference";

// Props type for the provider
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize state from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      // Try to get from localStorage first
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        return savedTheme === "dark";
      }

      // Fall back to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    // Default to light mode if not on client
    return false;
  });

  // Apply theme effect
  useEffect(() => {
    // Find the HTML element
    const htmlElement = document.documentElement;

    if (isDarkMode) {
      // Apply dark mode
      htmlElement.classList.add("dark");

      // For AMOLED optimization, we can add a custom data attribute
      // This can be used for additional AMOLED-specific styling if needed
      htmlElement.setAttribute("data-amoled", "true");

      // Store preference
      localStorage.setItem(THEME_STORAGE_KEY, "dark");
    } else {
      // Remove dark mode
      htmlElement.classList.remove("dark");

      // Remove AMOLED attribute
      htmlElement.removeAttribute("data-amoled");

      // Store preference
      localStorage.setItem(THEME_STORAGE_KEY, "light");
    }

    // Additional meta theme-color for mobile browsers
    // This helps match the browser UI to your site theme
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        isDarkMode ? "#000000" : "#ffffff"
      );
    } else {
      // Create the meta tag if it doesn't exist
      const newMetaThemeColor = document.createElement("meta");
      newMetaThemeColor.name = "theme-color";
      newMetaThemeColor.content = isDarkMode ? "#000000" : "#ffffff";
      document.head.appendChild(newMetaThemeColor);
    }
  }, [isDarkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
