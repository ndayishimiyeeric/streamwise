import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.NEXT_BASE_URL)
    return `https://${process.env.NEXT_BASE_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}
