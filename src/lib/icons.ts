import {
  Ruler,
  Scale,
  LandPlot,
  Beaker,
  Thermometer,
  Gauge,
  Clock,
  HardDrive,
  Wind,
  Zap,
  BatteryCharging,
  Compass,
  Globe,
  Calculator,
  Hash,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  length: Ruler,
  weight: Scale,
  area: LandPlot,
  volume: Beaker,
  temperature: Thermometer,
  speed: Gauge,
  time: Clock,
  "digital-storage": HardDrive,
  pressure: Wind,
  energy: Zap,
  power: BatteryCharging,
  angle: Compass,
};

export const fallbackCategoryIcon: LucideIcon = Calculator;
export const landIcon: LucideIcon = LandPlot;
export const countryIcon: LucideIcon = Globe;

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] ?? fallbackCategoryIcon;
}

export const calculatorCategoryIcons: Record<string, LucideIcon> = {
  numbers: Hash,
  health: HeartPulse,
  math: Calculator,
};

export function getCalculatorIcon(category: string): LucideIcon {
  return calculatorCategoryIcons[category] ?? Hash;
}
