// Spanish category-name translations. Hand-written for the same reason as
// ur/ar — categories are small in number and appear on nearly every page
// (nav, sidebar, footer, homepage), so they're kept as reviewed seed data
// instead of raw machine translation. Converter names/descriptions are
// left as LibreTranslate output per direction from the site owner.

export const esCategoryTranslations: Record<string, { name: string; description: string }> = {
  length: {
    name: "Longitud",
    description: "Convierte entre unidades métricas e imperiales de longitud — metros, pies, millas, pulgadas y más.",
  },
  weight: {
    name: "Peso / Masa",
    description: "Convierte entre unidades métricas e imperiales de peso — kilogramos, libras, onzas y más.",
  },
  area: {
    name: "Superficie",
    description: "Convierte entre unidades métricas e imperiales de superficie — metros cuadrados, pies cuadrados, acres, hectáreas y más.",
  },
  volume: {
    name: "Volumen",
    description: "Convierte entre unidades métricas y estadounidenses tradicionales de volumen — litros, galones, tazas, onzas líquidas y más.",
  },
  temperature: {
    name: "Temperatura",
    description: "Convierte entre las escalas de temperatura Celsius, Fahrenheit y Kelvin.",
  },
  speed: {
    name: "Velocidad",
    description: "Convierte entre unidades comunes de velocidad — kilómetros/hora, millas/hora, metros/segundo y nudos.",
  },
  time: {
    name: "Tiempo",
    description: "Convierte entre unidades comunes de tiempo — segundos, minutos, horas, días y más.",
  },
  "digital-storage": {
    name: "Almacenamiento Digital",
    description: "Convierte entre unidades de almacenamiento digital — bits, bytes, KB, MB, GB, TB y PB (decimal/SI).",
  },
  pressure: {
    name: "Presión",
    description: "Convierte entre unidades de presión — pascales, bares, PSI, atmósferas y torr.",
  },
  energy: {
    name: "Energía",
    description: "Convierte entre unidades de energía — julios, calorías, kilocalorías y vatios-hora.",
  },
  power: {
    name: "Potencia",
    description: "Convierte entre unidades de potencia — vatios, kilovatios y caballos de fuerza.",
  },
  angle: {
    name: "Ángulo",
    description: "Convierte entre unidades de ángulo — grados, radianes y gradianes.",
  },
};
