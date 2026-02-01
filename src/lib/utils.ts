import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getKarmaTier(karma: number): {
  name: string;
  color: string;
  ringClass: string;
} {
  if (karma >= 5000) {
    return {
      name: "Legendary",
      color: "from-amber-500 via-purple-500 to-indigo-500",
      ringClass: "ring-gradient-legendary",
    };
  }
  if (karma >= 2000) {
    return {
      name: "Trusted",
      color: "amber-500",
      ringClass: "ring-amber-500",
    };
  }
  if (karma >= 500) {
    return {
      name: "Established",
      color: "purple-500",
      ringClass: "ring-purple-500",
    };
  }
  if (karma >= 100) {
    return {
      name: "Contributor",
      color: "indigo-500",
      ringClass: "ring-indigo-500",
    };
  }
  return {
    name: "Newcomer",
    color: "slate-500",
    ringClass: "ring-slate-500",
  };
}

export function generateVerificationCode(): string {
  const words = ["nova", "pulse", "spark", "glow", "flux", "wave", "beam", "core"];
  const word = words[Math.floor(Math.random() * words.length)];
  const code = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${word}-${code}`;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
