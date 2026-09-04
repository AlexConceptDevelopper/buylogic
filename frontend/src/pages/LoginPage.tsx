import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({
        email,
        password,
      });

      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message.toLowerCase() : "";
      
      if (
        message.includes("bad credentials") ||
        message.includes("401") ||
        message.includes("unauthorized") ||
        message.includes("unexpected error") ||
        message.includes("internal server error")
      ) {
        setError("Adresse e-mail ou mot de passe incorrect.");
      } else {
        setError("Impossible de se connecter au serveur. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-10 lg:p-12">
              <Link
                to="/"
                className="inline-flex cursor-pointer items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20">
                  <span className="text-lg font-black">B</span>
                </div>

                <div>
                  <p className="text-lg font-bold tracking-tight text-white">
                    BuyLogic
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Smart purchasing
                  </p>
                </div>
              </Link>

              <div className="mt-10">
                <p className="text-sm font-semibold text-cyan-300">
                  Bon retour.
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Connectez-vous à BuyLogic
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Retrouvez votre activité, vos recommandations et vos décisions
                  d'achat au même endroit.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Adresse e-mail
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    placeholder="vous@entreprise.fr"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Mot de passe
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                      placeholder="Votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-600 transition hover:text-slate-950"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
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
                  className="w-full cursor-pointer rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-xs text-slate-600">ou</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/3 px-4 py-3.5 text-sm font-semibold text-slate-500"
              >
                Continuer avec Google
              </button>

              <div className="mt-6 text-center text-sm text-slate-500">
                Pas encore de compte ?{" "}
                <Link
                  to="/register"
                  className="cursor-pointer font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Créer mon compte gratuitement
                </Link>
              </div>
            </div>

            <div className="relative hidden overflow-hidden border-l border-white/5 bg-linear-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-10 lg:flex lg:flex-col lg:justify-between">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative">
                <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  Offre découverte
                </div>

                <h2 className="mt-6 text-3xl font-black tracking-tight">
                  30 jours pour découvrir BuyLogic.
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Testez votre espace avec vos données, laissez BuyLogic
                  analyser votre activité et voyez progressivement la valeur de
                  ses recommandations.
                </p>
              </div>

              <div className="relative mt-10 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                  <p className="text-sm font-bold text-white">0,00 €</p>
                  <p className="mt-1 text-xs text-slate-500">
                    pendant les 30 premiers jours
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
                  ✓ Aucune carte bancaire
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
                  ✓ Aucun prélèvement automatique
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}