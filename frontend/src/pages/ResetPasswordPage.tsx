import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!token) {
      setError("Jeton de réinitialisation manquant dans l'URL.");
      return;
    }

    setLoading(true);

    try {
      const targetUrl = `${import.meta.env.VITE_API_URL || "https://api.buylogic.fr"}/auth/reset-password`;

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Impossible de réinitialiser le mot de passe.");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-black tracking-tight">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm text-slate-400">Choisissez un nouveau mot de passe sécurisé pour votre compte BuyLogic.</p>

        {success ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300">
            Mot de passe mis à jour avec succès ! Redirection vers la connexion...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Nouveau mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                placeholder="••••••••"
              />
            </div>

            {error && <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
            >
              {loading ? "Mise à jour..." : "Modifier le mot de passe"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}