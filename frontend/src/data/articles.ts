import type { Article } from "../types/Article";
import { article as stockSecurite } from "./blog/calculer-stock-securite-fournisseur.js";
import { article as digitalisationAchats } from "./blog/digitalisation-achats-pme-peur-transition.js";
import { article as factureElectronique } from "./blog/facture-electronique-artisans-fin-paperasse.js";
import { article as arnaquesFournisseurs } from "./blog/arnaques-fournisseurs-virements-pme-comment-proteger-achats.js";
import { article as maverickBuying } from "./blog/stopper-maverick-buying-achats-sauvages-pme.js";
import { article as otif } from "./blog/mesurer-performance-fournisseur-indicateur-otif-pme.js";
import { article as gestionLitiges } from "./blog/gestion-litiges-fournisseurs-factures-reliquats.js";
import { article as criseAchats } from "./blog/negoce-materiaux-crise-achats-sauvent-marge.js";

export const articles: Article[] = [
  stockSecurite,
  digitalisationAchats,
  factureElectronique,
  arnaquesFournisseurs,
  maverickBuying,
  otif,
  gestionLitiges,
  criseAchats,
];