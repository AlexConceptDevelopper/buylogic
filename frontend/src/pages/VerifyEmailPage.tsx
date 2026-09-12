import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/auth.api";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Verrou pour éviter le double appel en mode dev (StrictMode)
  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    if (!token) {
      setStatus("error");
      setErrorMessage("Token de vérification manquant.");
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Impossible de vérifier le compte."
        );
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20">
              <span className="text-lg font-black">B</span>
            </div>
            <p className="text-lg font-bold tracking-tight text-white">BuyLogic</p>
          </Link>

          {status === "loading" && (
            <div>
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <h1 className="text-xl font-bold">Vérification en cours...</h1>
              <p className="mt-2 text-sm text-slate-400">
                Veuillez patienter pendant que nous activons votre compte.
              </p>
            </div>
          )}

          {status === "success" && (
            <div>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                ✓
              </div>
              <h1 className="text-2xl font-black tracking-tight">Compte activé !</h1>
              <p className="mt-2 text-sm text-slate-400">
                Votre adresse e-mail a été vérifiée avec succès. Votre entreprise et votre compte sont désormais actifs.
              </p>
              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-block w-full rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
                >
                  Se connecter à BuyLogic
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-400/10 text-red-400 border border-red-400/20">
                ✕
              </div>
              <h1 className="text-2xl font-black tracking-tight">Échec de l'activation</h1>
              <p className="mt-2 text-sm text-red-300/90">
                {errorMessage || "Le lien d'activation est invalide ou a expiré (24h maximum)."}
              </p>
              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}