import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { getNotifications } from "../../api/notification.api";
import useAsync from "../../hooks/useAsync";
import { useAuth } from "../../context/AuthContext";

import type { Notification } from "../../types/notification";

export default function AppLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  //system notifications mise en suspension temporaire, car elles ne sont pas utilisées dans l'interface actuelle
  const [_notifications, setNotifications] = useState<Notification[]>([]);

  const { execute: executeNotifications } = useAsync<Notification[]>();

  const navigation = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "⌂",
    },
    {
      label: "Fournisseurs",
      path: "/suppliers",
      icon: "◉",
    },
    {
      label: "Produits",
      path: "/products",
      icon: "▣",
    },
    {
      label: "Gestion de stock",
      path: "/stock",
      icon: "▤",
    },
    {
      label: "Commandes",
      path: "/purchase-orders",
      icon: "◫",
    },
    {
      label: "Importer les ventes",
      path: "/consumption-import",
      icon: "⇩",
    },
    {
      label: "Recommandations",
      path: "/recommendations",
      icon: "✦",
    },
    // La ligne "Notifications" a été retirée de la sidebar
    ...(user?.role === "OWNER" || user?.role === "SUPER_ADMIN"
      ? [
          {
            label: "Paramètres",
            path: "/params",
            icon: "⚙",
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const loadNotifications = async () => {
      const data = await executeNotifications(() => getNotifications());

      if (data) {
        setNotifications(data);
      }
    };

    loadNotifications();
  }, [user, executeNotifications]);

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
      : "BL";

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur";

  const roleLabel = user?.role ?? "";

  function handleLogout() {
    setProfileOpen(false);
    logout();
  }

  function closeMenus() {
    setProfileOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-slate-950 lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center border-b border-white/5 px-6">
            <Link
              to="/"
              onClick={closeMenus}
              className="flex cursor-pointer items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20">
                <span className="text-lg font-black">B</span>
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight">BuyLogic</p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Acheter au bon moment
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Gestion
            </p>

            {navigation.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenus}
                  className={[
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-cyan-400/10 text-cyan-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-lg text-sm",
                      isActive
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "bg-white/3 text-slate-500",
                    ].join(" ")}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="border-t border-white/5 p-4">
            <div className="rounded-xl border border-white/5 bg-white/2 p-3">
              <p className="truncate text-xs font-semibold text-slate-300">
                {user?.companyName ?? "Entreprise"}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Entreprise active
              </p>
            </div>

            <Link
              to="/"
              onClick={closeMenus}
              className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <span>←</span>
              Retour au site
            </Link>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="flex h-20 items-center justify-between border-b border-white/5 bg-slate-950/80 px-6 backdrop-blur-xl">
            <div>
              <p className="text-sm font-semibold text-white">
                Espace de gestion
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                Pilotez vos achats et votre stock.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Le bloc cloche/notifications a été entièrement retiré d'ici */}

              {/* Profile */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Ouvrir le menu du profil"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  onClick={() => {
                    setProfileOpen((value) => !value);
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-3 py-2 transition hover:border-white/20 hover:bg-white/5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-bold text-cyan-300">
                    {initials}
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="text-xs font-semibold text-slate-200">
                      {fullName}
                    </p>

                    <p className="text-[10px] text-slate-500">{roleLabel}</p>
                  </div>

                  <span
                    className={[
                      "text-xs text-slate-600 transition-transform",
                      profileOpen ? "rotate-180" : "",
                    ].join(" ")}
                  >
                    ▾
                  </span>
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl"
                  >
                    <div className="border-b border-white/5 px-3 py-3">
                      <p className="text-sm font-semibold text-white">
                        {fullName}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      role="menuitem"
                      onClick={closeMenus}
                      className="mt-2 block cursor-pointer rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      Tableau de bord
                    </Link>

                    <Link
                      to="/"
                      role="menuitem"
                      onClick={closeMenus}
                      className="mt-1 block cursor-pointer rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      Retour au site
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-400/5 hover:text-red-200"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}