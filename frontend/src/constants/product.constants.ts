import type { ProductUnit, ProductType } from "../types/product";

// Le dictionnaire pour afficher du beau français sur l'interface
export const UNIT_LABELS: Record<ProductUnit, string> = {
  UNIT: "Unité",
  BOX: "Boîte",
  SET: "Lot / Set",
  KG: "Kilogramme",
  G: "Gramme",
  L: "Litre",
  ML: "Millilitre",
};

export const TYPE_LABELS: Record<ProductType, string> = {
  PURCHASED: "Acheté",
  MANUFACTURED: "Fabriqué",
};