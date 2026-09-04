import { useEffect, useState } from "react";
import { adminGetAllCompanies, adminUpdateCompany, adminDeleteCompany, adminGetCompanyConfiguration, adminUpdateCompanyConfiguration } from "../../api/super-admin.api";
import type { Company, CompanyUpdate } from "../../types/company";
import type { CompanyConfiguration, ProductManagementMode } from "../../types/companyConfiguration";

export default function CompaniesManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  // État pour stocker l'entreprise en attente de confirmation de désactivation
  const [companyToToggle, setCompanyToToggle] = useState<Company | null>(null);

  const [formData, setFormData] = useState<CompanyUpdate & { productManagementMode?: ProductManagementMode }>({
    name: "",
    email: "",
    phone: "",
    siret: "",
    address: "",
    receptionHours: "",
    active: true,
    productManagementMode: "RESALE",
  });
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const data = await adminGetAllCompanies();
        if (data) setCompanies(data);
      } catch (err) {
        console.error("Erreur chargement entreprises", err);
      } finally {
        setLoading(false);
      }
    }
    void fetchCompanies();
  }, []);

  const openEditModal = async (company: Company) => {
    setSelectedCompany(company);
    
    let currentMode: ProductManagementMode = "RESALE";

    try {
      const config = await adminGetCompanyConfiguration(company.idCompany);
      if (config && config.productManagementMode) {
        currentMode = config.productManagementMode;
      }
    } catch (err) {
      console.warn("Impossible de charger la configuration de l'entreprise, utilisation du défaut", err);
    }

    setFormData({
      name: company.name || "",
      email: company.email || "",
      phone: company.phone || "",
      siret: company.siret || "",
      address: company.address || "",
      receptionHours: company.receptionHours || "",
      active: company.active ?? true,
      productManagementMode: currentMode,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    setSaving(true);
    try {
      const updatedCompany = await adminUpdateCompany(selectedCompany.idCompany, formData);
      
      await adminUpdateCompanyConfiguration(selectedCompany.idCompany, {
        idCompany: selectedCompany.idCompany,
        productManagementMode: formData.productManagementMode || "RESALE"
      } as CompanyConfiguration);

      const finalActiveState = formData.active ?? true;
      const companyToStore: Company = updatedCompany 
        ? { ...updatedCompany, active: finalActiveState } 
        : { ...selectedCompany, ...formData, active: finalActiveState } as Company;

      setCompanies(companies.map(c => c.idCompany === selectedCompany.idCompany ? companyToStore : c));
      setSelectedCompany(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour", err);
    } finally {
      setSaving(false);
    }
  };

  // Déclencheur du clic : si on veut activer on y va direct, si on veut désactiver on ouvre la modale de confirmation
  const handleToggleClick = (company: Company) => {
    if (company.active) {
      setCompanyToToggle(company); // Ouvre la modale de confirmation pour désactiver
    } else {
      void executeToggle(company); // Réactive directement
    }
  };

  const executeToggle = async (company: Company) => {
    setActionId(company.idCompany);
    try {
      const newActiveState = !company.active;
      
      if (newActiveState) {
        const updated = await adminUpdateCompany(company.idCompany, { ...company, active: true });
        if (updated) {
          setCompanies(companies.map(c => c.idCompany === company.idCompany ? updated : c));
        }
      } else {
        await adminDeleteCompany(company.idCompany);
        setCompanies(companies.map(c => c.idCompany === company.idCompany ? { ...c, active: false } : c));
        if (selectedCompany?.idCompany === company.idCompany) {
          setSelectedCompany(null);
        }
      }
    } catch (err) {
      console.error("Erreur lors du changement de statut de l'entreprise", err);
    } finally {
      setActionId(null);
      setCompanyToToggle(null);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Gestion des Entreprises</h2>
          <p className="text-xs text-slate-400">Vue globale des tenants enregistrés sur la plateforme.</p>
        </div>
        <input
          type="text"
          placeholder="Rechercher une entreprise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Chargement des données...</div>
      ) : filteredCompanies.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-8 text-center text-slate-400 text-xs">
          Aucune entreprise trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <div
              key={company.idCompany}
              className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between space-y-4 transition hover:border-red-500/30"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white truncate">{company.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${company.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {company.active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">ID: #{company.idCompany}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{company.email}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-[11px] text-slate-400 truncate max-w-35">
                  {company.siret ? `SIRET: ${company.siret}` : "Pas de SIRET"}
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleClick(company)}
                    disabled={actionId === company.idCompany}
                    className={`cursor-pointer text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition disabled:opacity-50 ${
                      company.active
                        ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                    }`}
                  >
                    {actionId === company.idCompany ? "..." : company.active ? "Désactiver" : "Réactiver"}
                  </button>

                  <button
                    onClick={() => openEditModal(company)}
                    className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 transition"
                  >
                    Gérer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale de Confirmation de Désactivation */}
      {companyToToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Confirmer la désactivation</h3>
            <p className="text-xs text-slate-400">
              Êtes-vous sûr de vouloir désactiver l'entreprise <strong className="text-white">{companyToToggle.name}</strong> ? Cette action coupera l'accès aux utilisateurs rattachés à ce tenant.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setCompanyToToggle(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void executeToggle(companyToToggle)}
                disabled={actionId === companyToToggle.idCompany}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-500 transition disabled:opacity-50 cursor-pointer"
              >
                {actionId === companyToToggle.idCompany ? "Désactivation..." : "Confirmer la désactivation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de Modification existante */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Modifier l'entreprise</h3>
                <p className="text-xs text-slate-400">#{selectedCompany.idCompany} - {selectedCompany.name}</p>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-white/5 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">SIRET</label>
                <input
                  type="text"
                  value={formData.siret}
                  onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Adresse</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Mode de gestion des produits</label>
                <select
                  value={formData.productManagementMode}
                  onChange={(e) => setFormData({ ...formData, productManagementMode: e.target.value as ProductManagementMode })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="RESALE">Revente (RESALE)</option>
                  <option value="PRODUCTION">Production (PRODUCTION)</option>
                  <option value="MIXED">Mixte (MIXED)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded bg-slate-950 border-white/10 text-red-500 focus:ring-0"
                />
                <label htmlFor="activeToggle" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Entreprise active
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}