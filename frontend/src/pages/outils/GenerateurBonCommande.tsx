import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Download, Mail, Plus, Trash2, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Item {
  id: string;
  designation: string;
  qty: number | "";
  price: number | "";
}

export default function GenerateurBonCommande() {
  // États initialisés à vide pour que les placeholders s'affichent
  const [companyName, setCompanyName] = useState("");
  const [companyDetails, setCompanyDetails] = useState("");
  const [companySiret, setCompanySiret] = useState("");

  const [supplierName, setSupplierName] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierDetails, setSupplierDetails] = useState("");

  const [items, setItems] = useState<Item[]>([
    { id: "1", designation: "", qty: 1, price: "" },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), designation: "", qty: 1, price: "" },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Calcul dynamique du total HT (gère proprement les valeurs vides)
  const totalHT = items.reduce((sum, item) => {
    const q = typeof item.qty === "number" ? item.qty : 0;
    const p = typeof item.price === "number" ? item.price : 0;
    return sum + q * p;
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    const orderNum = `BC-${new Date().getFullYear()}-001`;
    const sender = companyName || "Votre Entreprise";
    const subject = encodeURIComponent(`Bon de Commande ${orderNum} - ${sender}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nVeuillez trouver ci-joint notre bon de commande N° ${orderNum} d'un montant de ${totalHT.toFixed(
        2
      )} € HT.\n\nCordialement,\n${sender}\n${companyDetails}\n\n---\nDocument édité via BuyLogic (https://buylogic.fr)`
    );

    window.location.href = `mailto:${supplierEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col print:bg-white print:text-black">
      <Helmet>
        <title>Générateur Bon de Commande PDF Gratuit & Modèle PME | BuyLogic</title>
        <meta
          name="description"
          content="Créez, téléchargez en PDF ou envoyez votre bon de commande fournisseur par e-mail gratuitement. Outil en ligne sans inscription pour PME."
        />
        <link
          rel="canonical"
          href="https://buylogic.fr/outils/generateur-bon-de-commande-pdf-gratuit"
        />
      </Helmet>

      <Navbar />

      <main className="grow print:p-0">
        {/* Header Écran */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center print:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Outil Métier 100% Gratuit</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Générateur de{" "}
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Bon de Commande PDF & Email
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Remplissez les champs ci-dessous, imprimez en PDF ou pré-remplissez votre e-mail en un clic.
          </p>
        </section>

        {/* Zone Document */}
        <section className="max-w-4xl mx-auto px-4 pb-20 print:p-0 print:max-w-full print:m-0">
          <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0">
            
            {/* CARTOUCHE DE MARQUE BUYLOGIC (Impression / PDF) */}
            <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-cyan-400 font-black text-lg">
                  B
                </div>
                <div>
                  <span className="font-black text-slate-900 text-base tracking-tight block leading-none">
                    BuyLogic
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block mt-1">
                    LOGICIEL D'ACHAT & STOCKS PME
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Document édité via</span>
                <span className="text-xs font-bold text-cyan-600 font-mono">https://buylogic.fr</span>
              </div>
            </div>

            {/* En-tête de la commande (Émetteur & Fournisseur) */}
            <div className="flex flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200">
              {/* Émetteur */}
              <div className="space-y-1.5 w-1/2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider print:hidden block">
                  Émetteur (Votre Entreprise) :
                </span>
                <input
                  type="text"
                  placeholder="Ex: Mycompany SAS"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full font-black text-xl text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-cyan-500 print:bg-transparent print:border-none print:p-0 placeholder:font-bold placeholder:text-slate-300"
                />
                <input
                  type="text"
                  placeholder="Ex: 12 rue de l'Industrie, 75001 Paris | Tél: 01 23 45 67 89"
                  value={companyDetails}
                  onChange={(e) => setCompanyDetails(e.target.value)}
                  className="w-full text-xs text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200 focus:outline-none focus:border-cyan-500 print:bg-transparent print:border-none print:p-0 print:text-slate-500 placeholder:text-slate-300"
                />
                <input
                  type="text"
                  placeholder="Ex: SIRET : 123 456 789 00012"
                  value={companySiret}
                  onChange={(e) => setCompanySiret(e.target.value)}
                  className="w-full text-[11px] font-mono text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-200 focus:outline-none focus:border-cyan-500 print:bg-transparent print:border-none print:p-0 placeholder:text-slate-300"
                />
              </div>

              {/* Fournisseur */}
              <div className="space-y-1.5 w-1/2 text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider print:hidden block">
                  Fournisseur Destinataire :
                </span>
                <input
                  type="text"
                  placeholder="Ex: NOVA"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full text-right font-bold text-lg text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-cyan-500 print:bg-transparent print:border-none print:p-0 placeholder:text-slate-300"
                />
                <input
                  type="email"
                  placeholder="Ex: contact@generation-nova.fr"
                  value={supplierEmail}
                  onChange={(e) => setSupplierEmail(e.target.value)}
                  className="w-full text-right text-xs font-mono text-cyan-700 bg-slate-50 p-1.5 rounded border border-slate-200 focus:outline-none focus:border-cyan-500 print:bg-transparent print:border-none print:p-0 placeholder:text-slate-300"
                />
                <input
                  type="text"
                  placeholder="Ex: 45 rue du Commerce, 69002 Lyon"
                  value={supplierDetails}
                  onChange={(e) => setSupplierDetails(e.target.value)}
                  className="w-full text-right text-xs text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200 focus:outline-none focus:border-cyan-500 print:bg-transparent print:border-none print:p-0 print:text-slate-500 placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Titre & Date */}
            <div className="my-6 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                BON DE COMMANDE N° BC-{new Date().getFullYear()}-001
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Date : {new Date().toLocaleDateString("fr-FR")}
              </span>
            </div>

            {/* Tableau des Articles */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-700 uppercase text-xs">
                    <th className="py-2.5">Désignation</th>
                    <th className="py-2.5 text-center w-24">Quantité</th>
                    <th className="py-2.5 text-right w-32">P.U. HT (€)</th>
                    <th className="py-2.5 text-right w-32">Total HT</th>
                    <th className="py-2.5 w-10 print:hidden"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item) => {
                    const q = typeof item.qty === "number" ? item.qty : 0;
                    const p = typeof item.price === "number" ? item.price : 0;
                    const rowTotal = q * p;

                    return (
                      <tr key={item.id}>
                        <td className="py-3 pr-2">
                          <input
                            type="text"
                            placeholder="Ex: Huile d'olive extra vierge (Bidon 5L)"
                            value={item.designation}
                            onChange={(e) => updateItem(item.id, "designation", e.target.value)}
                            className="w-full bg-slate-50 p-2 rounded border border-slate-200 focus:outline-none focus:border-cyan-500 print:bg-transparent print:border-none print:p-0 print:font-medium placeholder:text-slate-300"
                          />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "qty",
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                            className="w-20 text-center bg-slate-50 p-2 rounded border border-slate-200 focus:outline-none focus:border-cyan-500 print:bg-transparent print:border-none print:p-0 placeholder:text-slate-300"
                          />
                        </td>
                        <td className="py-3 px-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="55.00"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "price",
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                            className="w-28 text-right bg-slate-50 p-2 rounded border border-slate-200 focus:outline-none focus:border-cyan-500 print:bg-transparent print:border-none print:p-0 placeholder:text-slate-300"
                          />
                        </td>
                        <td className="py-3 pl-2 text-right font-bold text-slate-900">
                          {rowTotal.toFixed(2)} €
                        </td>
                        <td className="py-3 text-right print:hidden">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Supprimer la ligne"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bouton Ajouter Ligne */}
            <div className="mb-6 print:hidden">
              <button
                onClick={addItem}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-800 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Ajouter un article
              </button>
            </div>

            {/* Total HT */}
            <div className="flex justify-end border-t-2 border-slate-900 pt-4 mb-12">
              <div className="text-right space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase block">
                  Total Général HT
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {totalHT.toFixed(2)} € HT
                </span>
              </div>
            </div>

            {/* FOOTER PDF (Impression) */}
            <div className="hidden print:block pt-6 border-t border-slate-200 text-center space-y-1.5">
              <p className="text-xs font-bold text-slate-800">
                Généré gratuitement sur BuyLogic — Logiciel d'Achat & Gestion de Stock PME
              </p>
              <p className="text-[11px] font-medium text-cyan-700">
                Automatisez vos bons de commande et évitez les ruptures de stock sur : <span className="font-bold underline">https://buylogic.fr</span>
              </p>
              <p className="text-[9px] text-slate-400">
                © {new Date().getFullYear()} BuyLogic. Tous droits réservés. Édité par CubTaik.
              </p>
            </div>

            {/* ACTIONS ECRAN */}
            <div className="print:hidden border-t border-slate-200 pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleSendEmail}
                  className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Envoyer par Email
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Imprimer / Télécharger en PDF
                </button>
              </div>
              <p className="text-[11px] text-slate-500 text-right">
                💡 Vous pouvez télécharger le PDF <strong>ET</strong> l'envoyer directement à votre fournisseur via votre logiciel de messagerie !
              </p>
            </div>
          </div>

          {/* BANNER CTA */}
          <div className="mt-12 bg-linear-to-r from-slate-900 via-slate-900 to-cyan-950 border border-cyan-500/30 rounded-2xl p-8 print:hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-lg font-bold text-white">
                Marre de créer vos bons de commande à la hand ?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>BuyLogic</strong> génère automatiquement vos bons de commande PDF en un clic quand vos stocks atteignent le seuil critique.
              </p>
            </div>
            <Link
              to="/register"
              className="shrink-0 inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg shadow-cyan-400/20"
            >
              Tester BuyLogic Gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}