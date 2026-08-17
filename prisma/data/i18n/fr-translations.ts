// French category-name translations. Hand-written for the same reason as
// ur/ar/es — categories are small in number and appear on nearly every page
// (nav, sidebar, footer, homepage), so they're kept as reviewed seed data
// instead of raw machine translation. Converter names/descriptions are
// left as LibreTranslate output per direction from the site owner.

export const frCategoryTranslations: Record<string, { name: string; description: string }> = {
  length: {
    name: "Longueur",
    description: "Convertissez entre les unités métriques et impériales de longueur — mètres, pieds, miles, pouces et plus.",
  },
  weight: {
    name: "Poids / Masse",
    description: "Convertissez entre les unités métriques et impériales de poids — kilogrammes, livres, onces et plus.",
  },
  area: {
    name: "Superficie",
    description: "Convertissez entre les unités métriques et impériales de superficie — mètres carrés, pieds carrés, acres, hectares et plus.",
  },
  volume: {
    name: "Volume",
    description: "Convertissez entre les unités métriques et américaines traditionnelles de volume — litres, gallons, tasses, onces liquides et plus.",
  },
  temperature: {
    name: "Température",
    description: "Convertissez entre les échelles de température Celsius, Fahrenheit et Kelvin.",
  },
  speed: {
    name: "Vitesse",
    description: "Convertissez entre les unités courantes de vitesse — kilomètres/heure, miles/heure, mètres/seconde et nœuds.",
  },
  time: {
    name: "Temps",
    description: "Convertissez entre les unités courantes de temps — secondes, minutes, heures, jours et plus.",
  },
  "digital-storage": {
    name: "Stockage Numérique",
    description: "Convertissez entre les unités de stockage numérique — bits, octets, Ko, Mo, Go, To et Po (décimal/SI).",
  },
  pressure: {
    name: "Pression",
    description: "Convertissez entre les unités de pression — pascals, bars, PSI, atmosphères et torr.",
  },
  energy: {
    name: "Énergie",
    description: "Convertissez entre les unités d'énergie — joules, calories, kilocalories et wattheures.",
  },
  power: {
    name: "Puissance",
    description: "Convertissez entre les unités de puissance — watts, kilowatts et chevaux-vapeur.",
  },
  angle: {
    name: "Angle",
    description: "Convertissez entre les unités d'angle — degrés, radians et grades.",
  },
};
