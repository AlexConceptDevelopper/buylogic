import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccessMessage("Si cet e-mail existe, un lien de réinitialisation a été envoyé.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-black tracking-tight">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-slate-400">Entrez votre e-mail pour recevoir un lien de réinitialisation.</p>

        {successMessage ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300">
            {successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                placeholder="nom@exemple.com"
              />
            </div>

            {error && <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien"}
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