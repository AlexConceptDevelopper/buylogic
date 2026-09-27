import type { Article } from "../types/Article";
import { article as stockSecurite } from "./blog/calculer-stock-securite-fournisseur";
import { article as digitalisationAchats } from "./blog/digitalisation-achats-pme-peur-transition";

export const articles: Article[] = [
  stockSecurite,
  digitalisationAchats,
];