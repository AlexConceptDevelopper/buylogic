import { Helmet } from "react-helmet";

const faqs = [
  {
    question: "Pourquoi choisir un logiciel d'achat PME plutôt qu'un ERP classique ?",
    answer:
      "Les ERP traditionnels sont souvent lourds, très coûteux et nécessitent plusieurs mois de formation. BuyLogic offre une alternative légère et intuitive, permettant d'automatiser les bons de commande et la gestion des stocks en moins de 5 minutes sans budget d'intégration."
  },
  {
    question: "Comment BuyLogic remplace-t-il la gestion de stock sur Excel ?",
    answer:
      "Contrairement aux tableurs Excel sujets aux erreurs de saisie et aux formules cassées, BuyLogic centralise vos données en temps réel, calcule automatiquement vos vos seuils de réapprovisionnement et génère vos bons de commande PDF en un clic."
  },
  {
    question: "Comment éviter les ruptures de stock dans une PME ?",
    answer:
      "BuyLogic intègre un moteur de calcul de seuil d'alerte minimal basé sur vos historiques d'achat et vos délais fournisseurs, vous prévenant automatiquement avant d'atteindre la rupture."
  }
];

export default function FaqSection() {
  // Génération du Schema JSON-LD pour Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Questions fréquentes sur la gestion des achats en PME
        </h2>
        <p className="mt-3 text-slate-400 text-sm">
          Tout ce que vous devez savoir pour moderniser vos approvisionnements sans usine à gaz.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              {faq.question}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}