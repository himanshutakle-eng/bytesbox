import { Colors } from "@/constants/Colors";
import { ThemeMode } from "@/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

interface ThemeContextType {
  theme: "light" | "dark";
  themeMode: ThemeMode;
  colors: typeof Colors.light;
  isDark: boolean;
  isLight: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "@zync_theme_mode";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          savedThemeMode &&
          ["light", "dark", "system"].includes(savedThemeMode)
        ) {
          setThemeModeState(savedThemeMode as ThemeMode);
        }
      } catch (error) {
        console.error("Error loading theme mode: ", error);
      }
    };

    loadThemeMode();
  }, []);

  useEffect(() => {
    let newTheme: "light" | "dark";
    if (themeMode === "system") {
      newTheme = systemColorScheme ?? "light";
    } else {
      newTheme = themeMode;
    }
    setTheme(newTheme);
  }, [themeMode, systemColorScheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error("Error setting theme mode: ", error);
    }
  };

  const toggleTheme = () => {
    const newMode: ThemeMode = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newMode);
  };

  const value: ThemeContextType = {
    theme,
    themeMode,
    colors: Colors[theme],
    isDark: theme === "dark",
    isLight: theme === "light",
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used inside ThemeProvider");
  }
  return context;
}
