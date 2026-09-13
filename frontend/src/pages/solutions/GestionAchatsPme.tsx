import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'; 

interface Product {
  id: string;
  name: string;
  ref: string;
  price: number;
  unit: string;
  minQty: number;
}

interface OrderItem extends Product {
  qty: number;
}

const CATALOGUE_FICTIF: Product[] = [
  { id: '1', name: 'Kit Liaison Frigorifique 1/4 - 3/8 (5m)', ref: 'SANI-LIAISON-5M', price: 42.50, unit: 'SET', minQty: 5 },
  { id: '2', name: 'Gaine Isolante Flexible Ø 160 mm (10m)', ref: 'SANI-GAINE-160', price: 28.00, unit: 'MTR', minQty: 2 },
  { id: '3', name: 'Bouteille Fluide R32 (9.5kg)', ref: 'SANI-R32-9.5', price: 145.00, unit: 'BTE', minQty: 1 },
];

export default function GestionAchatsPme() {
  const [supplier, setSupplier] = useState("SaniChauffage Diffusion");
  const [orderNumber] = useState(`BC-2026-${Math.floor(100 + Math.random() * 900)}`);
  
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [copied, setCopied] = useState(false);

  const handleAddProduct = (product: Product) => {
    const existing = orderItems.find(item => item.id === product.id);
    if (existing) {
      setOrderItems(orderItems.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + item.minQty } : item
      ));
    } else {
      setOrderItems([...orderItems, { ...product, qty: product.minQty }]);
    }
  };

  const handleRemoveProduct = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleQtyChange = (id: string, newQty: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const validQty = newQty < item.minQty ? item.minQty : newQty;
        return { ...item, qty: validQty };
      }
      return item;
    }));
  };

  const totalGeneral = orderItems.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const handleSimulateExport = () => {
    if (orderItems.length === 0) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Logiciel de gestion des achats et commandes pour PME</title>
        <meta name="description" content="Découvrez notre solution simple pour centraliser vos fournisseurs et éditer vos bons de commande PDF en un clic. Testez notre outil en ligne." />
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-slate-100 overflow-visible">
        <div className="mx-auto max-w-6xl px-6 py-12">
          
          {/* Navigation rapide retour */}
          <div className="mb-8">
            <Link to="/" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition">
              ← Accueil
            </Link>
          </div>

          {/* En-tête de la page */}
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <span className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase">
              Logiciel & Solution PME
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 mb-4">
              Logiciel de gestion des achats et des commandes pour PME
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Centralisez vos fournisseurs, éditez des bons de commande propres en 2 clics et testez notre simulateur ci-dessous pour voir la simplicité de l'outil.
            </p>
          </div>

          {/* SECTION INTERACTIVE PRINCIPALE */}
          <div className="my-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
            
            {/* Colonne de gauche : Configuration & Catalogue */}
            <div className="space-y-6">
              
              {/* Infos générales */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Informations générales</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Fournisseur</label>
                    <select 
                      value={supplier} 
                      onChange={(e) => setSupplier(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                    >
                      <option value="SaniChauffage Diffusion">SaniChauffage Diffusion</option>
                      <option value="Brossette Thermique">Brossette Thermique</option>
                      <option value="Cedeo Pro">Cedeo Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">N° de commande (auto)</label>
                    <input 
                      type="text" 
                      value={orderNumber} 
                      disabled
                      className="w-full rounded-xl bg-slate-950/50 border border-white/5 px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Catalogue du fournisseur */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Catalogue du fournisseur</h2>
                <p className="text-xs text-slate-400">Cliquez sur "Ajouter" pour inclure un produit dans la commande.</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-white/10 text-slate-400 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Produit / Référence</th>
                        <th className="py-2.5 px-3">Prix Catalogue</th>
                        <th className="py-2.5 px-3">Min. Requis</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {CATALOGUE_FICTIF.map((prod) => (
                        <tr key={prod.id} className="hover:bg-white/2 transition">
                          <td className="py-3 px-3">
                            <span className="font-semibold text-white block">{prod.name}</span>
                            <span className="text-[10px] text-cyan-400">RÉF : {prod.ref}</span>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-200">{prod.price.toFixed(2)} € / {prod.unit}</td>
                          <td className="py-3 px-3 text-slate-400">{prod.minQty} {prod.unit}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleAddProduct(prod)}
                              className="rounded-lg bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition cursor-pointer border border-cyan-400/20"
                            >
                              + Ajouter
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lignes de la commande en cours */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Lignes de la commande</h2>
                
                {orderItems.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">Aucun article sélectionné. Ajoutez des produits depuis le catalogue ci-dessus.</p>
                ) : (
                  <div className="space-y-4">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-white/5">
                        <div className="space-y-1">
                          <span className="font-semibold text-white text-xs block">{item.name}</span>
                          <span className="text-[10px] text-cyan-400">RÉF : {item.ref}</span>
                        </div>
                        <div className="flex items-center gap-4 justify-between sm:justify-end">
                          <div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                min={item.minQty}
                                value={item.qty} 
                                onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                                className="w-16 rounded-lg bg-slate-900 border border-white/10 px-2 py-1 text-center text-xs text-white focus:border-cyan-400 focus:outline-none"
                              />
                              <span className="text-xs text-slate-400">{item.unit}</span>
                            </div>
                            <span className="text-[9px] text-slate-500 block mt-0.5">Min requis : {item.minQty} {item.unit}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-white block">{(item.qty * item.price).toFixed(2)} €</span>
                            <span className="text-[10px] text-slate-400">{item.price} € / {item.unit}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveProduct(item.id)}
                            className="text-xs text-red-400 hover:text-red-300 transition cursor-pointer p-1"
                            title="Supprimer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Total général estimé</span>
                      <span className="text-xl font-extrabold text-cyan-400">{totalGeneral.toFixed(2)} € HT</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Colonne de droite : Aperçu du Bon de Commande PDF en direct */}
            <div className="lg:sticky lg:top-8">
              <div className="rounded-2xl border border-white/20 bg-white p-6 text-slate-900 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-slate-100 px-4 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-l border-slate-200 rounded-bl-xl">
                  Aperçu PDF Direct
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">BON DE COMMANDE</h3>
                    <p className="text-xs text-slate-500 font-mono">{orderNumber}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p className="font-semibold text-slate-800">Votre PME</p>
                    <p>Service Achats & Logistique</p>
                  </div>
                </div>

                <div className="mb-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Fournisseur :</span>
                  <span className="text-slate-900 font-semibold">{supplier}</span>
                </div>

                {orderItems.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl mb-6 bg-slate-50">
                    <p className="text-xs text-slate-400 italic">Le bon de commande est vide.</p>
                    <p className="text-[10px] text-slate-400 mt-1">Ajoutez des produits depuis le catalogue.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                          <th className="py-2">Article</th>
                          <th className="py-2 text-center">Qté</th>
                          <th className="py-2 text-right">P.U.</th>
                          <th className="py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orderItems.map((item) => (
                          <tr key={item.id}>
                            <td className="py-2.5 font-medium text-slate-800 max-w-30 truncate">{item.name}</td>
                            <td className="py-2.5 text-center">{item.qty} {item.unit}</td>
                            <td className="py-2.5 text-right">{item.price} €</td>
                            <td className="py-2.5 text-right font-bold text-slate-900">{(item.qty * item.price).toFixed(2)} €</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-sm mb-6">
                  <span className="font-bold text-slate-600">Total Net :</span>
                  <span className="font-black text-cyan-600 text-lg">{totalGeneral.toFixed(2)} € HT</span>
                </div>

                <button
                  onClick={handleSimulateExport}
                  disabled={orderItems.length === 0}
                  className={`w-full rounded-xl py-3 text-xs font-bold transition shadow-lg ${
                    orderItems.length === 0 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-950 text-white hover:bg-slate-900 cursor-pointer'
                  }`}
                >
                  {copied ? "✓ Bon de commande simulé avec succès !" : "Générer / Télécharger le PDF"}
                </button>

                {copied && (
                  <p className="text-[11px] text-cyan-600 text-center mt-3 font-medium animate-pulse">
                    Envie d'enregistrer vos vrais fournisseurs ? Créez votre compte gratuitement !
                  </p>
                )}
              </div>
            </div>

          </div>

          <div className="border-t border-white/10 my-16" />

          {/* PARTIE LECTURE / CONTENU SEO APPROFONDI */}
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Le vrai coût de la gestion des achats "à l'ancienne" en PME
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Dans une PME, le temps passé à jongler entre des tableaux Excel, des e-mails éparpillés et des bons de commande papier est colossal. Sans centralisation, les conséquences pèsent lourdement sur la rentabilité :
              </p>
              <ul className="space-y-2 text-slate-300 list-disc list-inside text-sm pl-2">
                <li><strong className="text-white">Des erreurs de références :</strong> Transmettre un code article erroné à un distributeur retarde les chantiers et bloque l'approvisionnement.</li>
                <li><strong className="text-slate-200">Des dérives tarifaires :</strong> L'absence d'historique des prix d'achat empêche de repérer les hausses de tarifs injustifiées appliquées par les fournisseurs.</li>
                <li><strong className="text-slate-200">Un suivi de livraison aveugle :</strong> Ne pas savoir précisément ce qui a été commandé, validé ou reçu crée des tensions internes et des retards de facturation.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Comment notre logiciel centralise vos flux sans usine à gaz
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Les PME n'ont pas besoin d'un ERP lourd, complexe et hors de prix taillé pour des multinationales. Notre solution a été pensée pour aller droit au but et structurer vos processus d'achats en quelques minutes :
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
                  <h3 className="font-bold text-white mb-2 text-sm">Référentiel unifié</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Retrouvez instantanément les coordonnées, les catalogues et les conditions négociées avec chaque fournisseur.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
                  <h3 className="font-bold text-white mb-2 text-sm">Bons de commande pros</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Générez des PDF structurés à votre image, conformes et prêts à être envoyés en un seul clic.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
                  <h3 className="font-bold text-white mb-2 text-sm">Contrôle des minimums</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Respectez automatiquement les conditionnements et les seuils de commande exigés par vos distributeurs.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Pourquoi les équipes adoptent notre solution sur le terrain
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                <strong className="text-white">Une prise en main immédiate :</strong> Pas besoin de semaines de formation. L'interface est fluide, ergonomique et conçue pour que vos collaborateurs soient autonomes dès le premier jour.<br />
                <strong className="text-white">Zéro double saisie :</strong> Fini de réécrire les mêmes informations d'un fichier à l'autre. Tout est interconnecté pour sécuriser vos flux de trésorerie et vos stocks.
              </p>
            </div>

          </div>

          {/* CTA de fin */}
          <div className="mt-16 rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center backdrop-blur-md shadow-2xl max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3">En finir avec les erreurs de commande sur Excel</h3>
            <p className="text-sm text-slate-400 mb-6">
              Centralisez vos catalogues, sécurisez vos minimums de commande et gagnez un temps précieux au quotidien.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 transition"
            >
              Créer mon compte gratuit
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}