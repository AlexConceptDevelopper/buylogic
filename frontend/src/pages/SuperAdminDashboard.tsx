import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminTabs from "../components/admin/AdminTabs";
import CompaniesManager from "../components/admin/CompaniesManager";
import UsersManager from "../components/admin/UsersManager";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [loading] = useState(true);
  const [activeTab, setActiveTab] = useState<"companies" | "users" | "logs">("companies");

  function handleLogout() {
    localStorage.removeItem("super_admin_token");
    navigate("/super-admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Admin */}
      <header className="border-b border-red-500/20 bg-slate-900/40 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-slate-950 font-black text-lg shadow-lg shadow-red-500/20">
            SA
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Super-Owner Command Center
            </h1>
            <p className="text-xs text-red-400 font-medium uppercase tracking-widest">
              BuyLogic Core Control
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          Déconnexion Session
        </button>
      </header>

      {/* Contenu Principal */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Grille de stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Statut Système
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-400">
              {loading ? "Vérification..." : "Opérationnel (OK)"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Sécurité Token
            </p>
            <p className="mt-2 text-2xl font-black text-red-400">
              Actif (SUPER_OWNER)
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Environnement API
            </p>
            <p className="mt-2 text-xl font-bold text-slate-200 truncate">
              {import.meta.env.VITE_API_URL || "https://api.buylogic.fr"}
            </p>
          </div>
        </div>

        {/* Navigation par Onglets Admin */}
        <div className="space-y-6">
          <AdminTabs activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Affichage dynamique selon l'onglet actif */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl">
            {activeTab === "companies" && <CompaniesManager />}
            
            {activeTab === "users" && <UsersManager />}

            {activeTab === "logs" && (
              <div className="text-center py-12 text-slate-400 text-xs">
                Journaux d'audit et de sécurité en cours de déploiement...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}