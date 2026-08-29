import { useState } from "react";
import type { Company } from "../../types/company";
import { uploadCompanyLogo } from "../../api/company.api";
import useAsync from "../../hooks/useAsync";

interface CompanyParamsTabProps {
  company: Company | null;
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>;
  actionLoading: boolean;
  onSaveCompany: (e: React.FormEvent) => void;
  successMessage: string | null;
}

export default function CompanyParamsTab({
  company,
  setCompany,
  actionLoading,
  onSaveCompany,
  successMessage,
}: CompanyParamsTabProps) {
  const { execute: executeUpload } = useAsync<Company>();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!company) {
    return <div className="mt-8 text-slate-400">Chargement des informations de l'entreprise...</div>;
  }

  const handleChange = (field: keyof Company, value: any) => {
    setCompany((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Taille max (2 Mo)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError("Le logo est trop volumineux. La taille maximale autorisée est de 2 Mo.");
      return;
    }

    // Check du type MIME
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Format non supporté. Veuillez utiliser un fichier PNG, JPG, WEBP ou SVG.");
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const updatedCompany = await executeUpload(() => uploadCompanyLogo(company.idCompany, file));
      if (updatedCompany) {
        setCompany(updatedCompany);
      }
    } catch (err: any) {
      setUploadError(err.message || "Une erreur est survenue lors du téléversement de l'image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-white/5 bg-slate-900/70 p-6">
      <div className="border-b border-white/5 pb-4">
        <p className="text-sm font-semibold text-white">Coordonnées et Infos Légales</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Ces informations ainsi que votre logo apparaîtront sur vos bons de commande PDF.
        </p>
      </div>

      {successMessage && (
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      {uploadError && (
        <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {uploadError}
        </div>
      )}

      <form onSubmit={onSaveCompany} className="mt-6 space-y-6 max-w-2xl">
        {/* Section Logo Cloudinary */}
        <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-slate-950 p-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-slate-500 overflow-hidden">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt="Logo entreprise" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs">Logo</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Logo de l'entreprise
              </label>
              <span className="text-[10px] text-slate-500">PNG, JPG, WEBP, SVG • Max : 2 Mo</span>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-400 file:text-slate-950 hover:file:bg-cyan-300 file:cursor-pointer cursor-pointer disabled:opacity-50"
            />
            {uploading && <p className="text-xs text-cyan-400">Téléversement en cours...</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={company.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email de contact
            </label>
            <input
              type="email"
              value={company.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Téléphone
            </label>
            <input
              type="text"
              value={company.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Ex: 01 23 45 67 89"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              SIRET / N° Immatriculation
            </label>
            <input
              type="text"
              value={company.siret ?? ""}
              onChange={(e) => handleChange("siret", e.target.value)}
              placeholder="Ex: 123 456 789 00012"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Horaires de réception
          </label>
          <input
            type="text"
            value={company.receptionHours ?? ""}
            onChange={(e) => handleChange("receptionHours", e.target.value)}
            placeholder="Ex: 8h-12h / 14h-17h"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Adresse postale de l'agence
          </label>
          <textarea
            rows={3}
            value={company.address ?? ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Numéro, rue, code postal, ville..."
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={actionLoading || uploading}
            className="cursor-pointer rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {actionLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}