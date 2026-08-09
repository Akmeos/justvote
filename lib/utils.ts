import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFrenchTypography(text: string): string {
  if (!text) return "";
  // Replace standard space before ?, !, :, ; with a non-breaking space (\u00A0)
  return text.replace(/\s+([?!:;])/g, "\u00A0$1");
}
