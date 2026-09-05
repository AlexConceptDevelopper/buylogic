import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminTabs from "../components/admin/AdminTabs";
import CompaniesManager from "../components/admin/CompaniesManager";
import UsersManager from "../components/admin/UsersManager";
import SecurityLogsManager from "../components/admin/SecurityLogsManager";
import { apiFetch } from "../api/client";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [systemStatus, setSystemStatus] = useState<"checking" | "operational" | "error">("checking");
  const [activeTab, setActiveTab] = useState<"companies" | "users" | "logs">("companies");

  // URL de l'API dynamique
  const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:8080" : "https://api.buylogic.fr");

  useEffect(() => {
    apiFetch<{ status: string }>("/admin/health")
      .then((res) => {
        if (res && res.status === "UP") {
          setSystemStatus("operational");
        } else {
          setSystemStatus("error");
        }
      })
      .catch(() => {
        setSystemStatus("error");
      });
  }, []);

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
        {/* Grille de stats dynamique */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Statut Système
            </p>
            <p className={`mt-2 text-2xl font-black ${
              systemStatus === "checking" 
                ? "text-amber-400 animate-pulse" 
                : systemStatus === "operational" 
                ? "text-emerald-400" 
                : "text-red-500"
            }`}>
              {systemStatus === "checking" && "Vérification..."}
              {systemStatus === "operational" && "Opérationnel (OK)"}
              {systemStatus === "error" && "Hors ligne / Erreur"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Sécurité Token
            </p>
            <p className="mt-2 text-2xl font-black text-red-400 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
              Actif (SUPER_OWNER)
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
            <div className="flex justify-between items-center">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Environnement API
              </p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                apiUrl.includes("localhost") ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {apiUrl.includes("localhost") ? "Local" : "Production"}
              </span>
            </div>
            <p className="mt-2 text-sm font-mono text-slate-200 truncate bg-slate-950/50 p-2 rounded-lg border border-white/5">
              {apiUrl}
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

            {activeTab === "logs" && <SecurityLogsManager />}
          </div>
        </div>
      </main>
    </div>
  );
}