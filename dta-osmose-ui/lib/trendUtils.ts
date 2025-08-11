import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
 // dynamiser le dashboard

export type TrendDirection = "up" | "down" | "neutral";

export type DynamicTrend = {
  trend: string;
  trendDirection: TrendDirection;
  footerTop: string;
};

export function getDynamicTrend(current: number, previous: number): DynamicTrend {
  // Cas où il n'y avait rien avant
  if (previous === 0) {
    if (current === 0) {
      return {
        trend: "0%",
        trendDirection: "neutral",
        footerTop: "Stable par rapport à la période précédente",
      };
    } else {
      return {
        trend: "N/A",
        trendDirection: "up",
        footerTop: "Nouvelle donnée ce mois-ci",
      };
    }
  }

  const growth = ((current - previous) / previous) * 100;
  const direction: TrendDirection =
    growth > 0 ? "up" : growth < 0 ? "down" : "neutral";

  return {
    trend:
      (growth > 0 ? "+" : growth < 0 ? "-" : "") +
      Math.abs(parseFloat(growth.toFixed(1))) +
      "%",
    trendDirection: direction,
    footerTop:
      direction === "up"
        ? "En hausse par rapport à la période précédente"
        : direction === "down"
        ? "En baisse par rapport à la période précédente"
        : "Stable par rapport à la période précédente",
  };
}
