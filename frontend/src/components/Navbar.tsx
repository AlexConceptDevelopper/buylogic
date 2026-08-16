import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex cursor-pointer items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20">
            <span className="text-lg font-black">B</span>
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              BuyLogic
            </p>

            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Smart purchasing
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {!isAuthenticated && (
            <>
              <a
                href="#features"
                className="cursor-pointer text-sm text-slate-400 transition hover:text-white"
              >
                Fonctionnalités
              </a>

              <a
                href="#how-it-works"
                className="cursor-pointer text-sm text-slate-400 transition hover:text-white"
              >
                Comment ça marche
              </a>

              <Link
                to="/login"
                className="cursor-pointer rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/5"
              >
                Connexion
              </Link>
            </>
          )}

          {!loading && isAuthenticated && user && (
            <div className="relative">
              <button
                type="button"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() =>
                  setProfileOpen((value) => !value)
                }
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-3 py-2 transition hover:border-white/20 hover:bg-white/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-sm font-black text-slate-950">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </p>

                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    {user.role}
                  </p>
                </div>

                <svg
                  className={`h-4 w-4 text-slate-500 transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl"
                >
                  <div className="border-b border-white/5 px-3 py-3">
                    <p className="text-sm font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="mt-2 block cursor-pointer rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Tableau de bord
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="mt-1 w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-400/5 hover:text-red-200"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          className="cursor-pointer rounded-lg border border-white/10 p-2 text-slate-300 transition hover:border-white/20 hover:bg-white/5 md:hidden"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1.5 block h-0.5 w-5 bg-current" />
          <span className="mt-1.5 block h-0.5 w-5 bg-current" />
        </button>
      </div>
    </header>
  );
}