import type { ProductUnit, ProductType } from "../types/product";

// Le dictionnaire pour afficher du beau français sur l'interface
export const UNIT_LABELS: Record<ProductUnit, string> = {
  UNIT: "Unité",
  BOX: "Boîte",
  SET: "Lot / Set",
  KG: "Kilogramme",
  G: "Gramme",
  L: "Litre",
  MTR: "Mètre",
};

export const TYPE_LABELS: Record<ProductType, string> = {
  PURCHASED: "Acheté",
  MANUFACTURED: "Fabriqué",
};

export const getUnitLabel = (unit: ProductUnit, quantity: number): string => {
  const baseLabel = UNIT_LABELS[unit] || unit;
  
  if (quantity > 1) {
    switch (unit) {
      case "UNIT": return "Unités";
      case "BOX": return "Boîtes";
      case "SET": return "Lots / Sets";
      case "KG": return "Kilogrammes";
      case "G": return "Grammes";
      case "L": return "Litres";
      case "MTR": return "Mètres";
      default: return baseLabel + "s";
    }
  }
  return baseLabel;
};