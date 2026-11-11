import type { Article } from "../types/Article";
import { article as stockSecurite } from "./blog/calculer-stock-securite-fournisseur";
import { article as digitalisationAchats } from "./blog/digitalisation-achats-pme-peur-transition";
import { article as factureElectronique } from "./blog/facture-electronique-artisans-fin-paperasse";
import { article as arnaquesFournisseurs } from "./blog/arnaques-fournisseurs-virements-pme-comment-proteger-achats";
import { article as maverickBuying } from "./blog/stopper-maverick-buying-achats-sauvages-pme";
import { article as otif } from "./blog/mesurer-performance-fournisseur-indicateur-otif-pme";
import { article as gestionLitiges } from "./blog/gestion-litiges-fournisseurs-factures-reliquats";
import { article as criseAchats } from "./blog/negoce-materiaux-crise-achats-sauvent-marge";

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