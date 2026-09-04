// pages/SuperAdminLoginPage.tsx
import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { superAdminLogin } from "../api/super-admin-auth.api";

export default function SuperAdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await superAdminLogin({
        email,
        password,
      });

      // Stockage du token pour que apiFetch l'envoie dans les requêtes /admin/**
      localStorage.setItem("super_admin_token", response.token);

      navigate("/super-admin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Identifiants super-admin invalides.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-slate-900/80 p-8 shadow-2xl shadow-red-500/5 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-slate-950 font-black text-xl mb-4 shadow-lg shadow-red-500/20">
            SA
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Espace Super-Owner
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-red-400 font-semibold">
            Accès strictement restreint
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email Super-Admin
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
              placeholder="admin@buylogic.fr"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-red-500 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-red-500/20 transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Vérification..." : "Connexion Super-Admin"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            ← Retour à la connexion classique
          </Link>
        </div>
      </div>
    </div>
  );
}