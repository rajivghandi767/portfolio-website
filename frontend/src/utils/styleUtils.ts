import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class names or conditional class expressions together
 * using clsx and tailwind-merge, which handles Tailwind CSS class conflicts properly
 * 
 * @param inputs - Any number of class names, objects, or arrays to be merged
 * @returns Merged class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Creates a CSS variable value reference
 * 
 * @param variableName - CSS variable name without the '--' prefix
 * @returns String formatted as CSS variable reference
 */
export function cssVar(variableName: string): string {
  return `var(--${variableName})`;
}

/**
 * Gets a CSS variable value as a React inline style
 * 
 * @param variableName - CSS variable name without the '--' prefix
 * @returns Object with the variable as a React inline style
 */
export function getVarStyle(variableName: string): React.CSSProperties {
  return { 
    [variableName]: `var(--${variableName})` 
  };
}

export default {
  cn,
  cssVar,
  getVarStyle
};