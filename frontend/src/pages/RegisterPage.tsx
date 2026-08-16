import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/auth.api";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register({
        firstName,
        lastName,
        companyName,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de créer votre compte.",
      );
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
        <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
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
                  Commencez simplement.
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Créez votre espace BuyLogic
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Votre compte crée automatiquement votre entreprise,
                  votre espace de travail et votre période d'essai de
                  30 jours.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Prénom
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(event.target.value)
                      }
                      autoComplete="given-name"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                      placeholder="Alex"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Nom
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(event) =>
                        setLastName(event.target.value)
                      }
                      autoComplete="family-name"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Nom de l'entreprise
                  </label>

                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(event) =>
                      setCompanyName(event.target.value)
                    }
                    autoComplete="organization"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    placeholder="Atelier Dupont Industrie"
                  />
                </div>

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
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
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

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    placeholder="8 caractères minimum"
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
                  className="w-full cursor-pointer rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Création du compte..."
                    : "Créer mon compte gratuitement"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="cursor-pointer font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Se connecter
                </Link>
              </p>
            </div>

            <div className="relative hidden overflow-hidden border-l border-white/5 bg-linear-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-10 lg:flex lg:flex-col lg:justify-between">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative">
                <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  Offre découverte
                </div>

                <h2 className="mt-6 text-3xl font-black tracking-tight">
                  30 jours. 0 €.
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Découvrez BuyLogic avec un véritable espace
                  d'entreprise et vos propres données.
                </p>
              </div>

              <div className="relative mt-10 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                  <p className="text-xl font-black text-white">
                    30 jours gratuits
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Pour découvrir l'ensemble de l'expérience BuyLogic
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
                  ✓ Aucune carte bancaire
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
                  ✓ Aucun prélèvement automatique
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
                  ✓ Votre entreprise reste isolée des autres
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}