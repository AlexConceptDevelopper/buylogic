interface AdminTabsProps {
  activeTab: "companies" | "users" | "logs";
  onChangeTab: (tab: "companies" | "users" | "logs") => void;
}

export default function AdminTabs({ activeTab, onChangeTab }: AdminTabsProps) {
  const tabs = [
    { id: "companies", label: "Entreprises", icon: "🏢" },
    { id: "users", label: "Utilisateurs", icon: "👥" },
    { id: "logs", label: "Audit & Sécurité", icon: "🛡️" },
  ] as const;

  return (
    <div className="flex overflow-x-auto no-scrollbar border-b border-white/10 pb-2 space-x-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10"
                : "bg-slate-900/40 text-slate-400 border border-white/5 hover:bg-slate-800/60 hover:text-slate-200"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}