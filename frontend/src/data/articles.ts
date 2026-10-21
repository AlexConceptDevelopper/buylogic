import type { Article } from "../types/Article";
import { article as stockSecurite } from "./blog/calculer-stock-securite-fournisseur.ts";
import { article as digitalisationAchats } from "./blog/digitalisation-achats-pme-peur-transition.ts";
import { article as factureElectronique } from "./blog/facture-electronique-artisans-fin-paperasse.ts";
import { article as arnaquesFournisseurs } from "./blog/arnaques-fournisseurs-virements-pme-comment-proteger-achats.ts";
import { article as maverickBuying } from "./blog/stopper-maverick-buying-achats-sauvages-pme.ts";
import { article as otif } from "./blog/mesurer-performance-fournisseur-indicateur-otif-pme.ts"

export const articles: Article[] = [
  stockSecurite,
  digitalisationAchats,
  factureElectronique,
  arnaquesFournisseurs,
  maverickBuying,
  otif,
];