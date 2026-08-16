import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/auth.api";
import type {
  ConsumptionMode,
  ConsumptionSource,
  ProductManagementMode,
} from "../types/companyConfiguration";

type OnboardingStep = 1 | 2 | 3 | 4;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<OnboardingStep>(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [productManagementMode, setProductManagementMode] =
    useState<ProductManagementMode | null>(null);

  const [consumptionMode, setConsumptionMode] =
    useState<ConsumptionMode | null>(null);

  const [consumptionSource, setConsumptionSource] =
    useState<ConsumptionSource | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stepLabels = ["Compte", "Produits", "Stock", "Données"];

  const optionClassName = (selected: boolean) =>
    [
      "w-full cursor-pointer rounded-2xl border p-5 text-left transition",
      selected
        ? "border-cyan-400/30 bg-cyan-400/10 shadow-lg shadow-cyan-400/5"
        : "border-white/10 bg-slate-950/50 hover:border-white/20 hover:bg-white/5",
    ].join(" ");

  const validateCurrentStep = () => {
    setError("");

    if (step === 1) {
      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !companyName.trim() ||
        !email.trim() ||
        !password
      ) {
        setError("Veuillez compléter tous les champs obligatoires.");
        return false;
      }

      if (password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères.");
        return false;
      }
    }

    if (step === 2 && !productManagementMode) {
      setError(
        "Sélectionnez le fonctionnement qui correspond à votre entreprise.",
      );
      return false;
    }

    if (step === 3 && !consumptionMode) {
      setError("Sélectionnez la manière dont vos ventes impactent le stock.");
      return false;
    }

    if (step === 4 && !consumptionSource) {
      setError(
        "Sélectionnez la manière dont vous souhaitez renseigner vos consommations.",
      );
      return false;
    }

    return true;
  };

  const goNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (step < 4) {
      setStep((current) => (current + 1) as OnboardingStep);
    }
  };

  const goBack = () => {
    setError("");

    if (step > 1) {
      setStep((current) => (current - 1) as OnboardingStep);
    }
  };

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    if (!productManagementMode || !consumptionMode || !consumptionSource) {
      setError("Veuillez compléter la configuration de votre entreprise.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register({
        firstName,
        lastName,
        companyName,
        email,
        password,
        productManagementMode,
        consumptionMode,
        consumptionSource,
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
                  Votre compte crée automatiquement votre entreprise, votre
                  espace de travail et votre configuration BuyLogic.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-4 gap-2">
                {stepLabels.map((label, index) => {
                  const currentStep = (index + 1) as OnboardingStep;

                  const active = currentStep === step;

                  const completed = currentStep < step;

                  return (
                    <div key={label}>
                      <div
                        className={[
                          "h-1.5 rounded-full transition",
                          active || completed ? "bg-cyan-400" : "bg-white/10",
                        ].join(" ")}
                      />

                      <p
                        className={[
                          "mt-2 text-[10px] font-semibold uppercase tracking-[0.14em]",
                          active
                            ? "text-cyan-300"
                            : completed
                              ? "text-slate-300"
                              : "text-slate-600",
                        ].join(" ")}
                      >
                        {label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {step === 1 && (
                  <div className="space-y-5">
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
                          onChange={(event) => setFirstName(event.target.value)}
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
                          onChange={(event) => setLastName(event.target.value)}
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
                        onChange={(event) => setCompanyName(event.target.value)}
                        autoComplete="organization"
                        required
                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                        placeholder="Boulangerie Dupont"
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

                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                        placeholder="8 caractères minimum"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Comment gérez-vous principalement vos produits ?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Cette réponse aide BuyLogic à comprendre comment vos
                      produits entrent et sortent de votre stock.
                    </p>

                    <div className="mt-6 space-y-3">
                      <button
                        type="button"
                        onClick={() => setProductManagementMode("RESALE")}
                        className={optionClassName(
                          productManagementMode === "RESALE",
                        )}
                      >
                        <p className="text-sm font-bold text-white">
                          Je revends les produits tels que je les achète
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Un produit acheté auprès d'un fournisseur est ensuite
                          vendu sans transformation notable.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductManagementMode("PRODUCTION")}
                        className={optionClassName(
                          productManagementMode === "PRODUCTION",
                        )}
                      >
                        <p className="text-sm font-bold text-white">
                          Je fabrique ou assemble mes produits
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Un produit vendu peut nécessiter plusieurs autres
                          produits ou composants.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductManagementMode("MIXED")}
                        className={optionClassName(
                          productManagementMode === "MIXED",
                        )}
                      >
                        <p className="text-sm font-bold text-white">
                          Je fais les deux
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Certains produits sont revendus tels quels et d'autres
                          sont fabriqués ou assemblés.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Lorsqu'un produit est vendu, comment votre stock
                      évolue-t-il ?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      BuyLogic utilise cette information pour déterminer ce qui
                      doit réellement être déduit du stock.
                    </p>

                    <div className="mt-6 space-y-3">
                      <button
                        type="button"
                        onClick={() => setConsumptionMode("DIRECT_STOCK_OUT")}
                        className={optionClassName(
                          consumptionMode === "DIRECT_STOCK_OUT",
                        )}
                      >
                        <p className="text-sm font-bold text-white">
                          Le produit vendu sort directement du stock
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Exemple : vous revendez directement un produit acheté
                          auprès d'un fournisseur.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConsumptionMode("COMPOSITION")}
                        className={optionClassName(
                          consumptionMode === "COMPOSITION",
                        )}
                      >
                        <p className="text-sm font-bold text-white">
                          La vente consomme plusieurs produits ou composants
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Exemple : un produit vendu est composé de plusieurs
                          éléments suivis en stock.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConsumptionMode("MIXED")}
                        className={optionClassName(consumptionMode === "MIXED")}
                      >
                        <p className="text-sm font-bold text-white">
                          Les deux selon les produits
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Certaines ventes sortent directement du stock et
                          d'autres entraînent la consommation de composants.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Comment renseignez-vous vos consommations ?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Cette information permet à BuyLogic d'adapter les écrans
                      d'import et de saisie à votre organisation.
                    </p>

                    <div className="mt-6 space-y-3">
                      <button
                        type="button"
                        onClick={() => setConsumptionSource("CSV")}
                        className={optionClassName(consumptionSource === "CSV")}
                      >
                        <p className="text-sm font-bold text-white">
                          J'importe des fichiers CSV
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Les données peuvent provenir d'un logiciel de caisse,
                          de gestion ou d'un export interne.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConsumptionSource("MANUAL")}
                        className={optionClassName(
                          consumptionSource === "MANUAL",
                        )}
                      >
                        <p className="text-sm font-bold text-white">
                          Je saisis les consommations manuellement
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          J'enregistre directement les sorties dans BuyLogic.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConsumptionSource("MIXED")}
                        className={optionClassName(
                          consumptionSource === "MIXED",
                        )}
                      >
                        <p className="text-sm font-bold text-white">Les deux</p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          J'utilise le CSV pour certaines données et la saisie
                          manuelle pour d'autres.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={loading}
                      className="cursor-pointer rounded-xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Retour
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={loading}
                      className="cursor-pointer rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Continuer
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "Création du compte..."
                        : "Créer mon compte gratuitement"}
                    </button>
                  )}
                </div>
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
                  Découvrez BuyLogic avec un véritable espace d'entreprise et
                  vos propres données.
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
