import { useState } from "react";
import type { Company } from "../../types/company";
import type { CompanyConfiguration } from "../../types/companyConfiguration";
import { uploadCompanyLogo, deleteCompany } from "../../api/company.api";
import { cancelSubscription } from "../../api/billing.api";
import useAsync from "../../hooks/useAsync";

interface CompanyParamsTabProps {
  company: Company | null;
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>;
  configuration: CompanyConfiguration | null;
  actionLoading: boolean;
  onSaveCompany: (e: React.SyntheticEvent) => void;
  successMessage: string | null;
}

export default function CompanyParamsTab({
  company,
  setCompany,
  configuration,
  actionLoading,
  onSaveCompany,
  successMessage,
}: CompanyParamsTabProps) {
  const { execute: executeUpload } = useAsync<Company>();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // États pour la modale de suppression de l'entreprise
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmCompanyName, setConfirmCompanyName] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  // États pour la modale, la résiliation et le réabonnement
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!company) {
    return (
      <div className="mt-8 text-slate-400">
        Chargement des informations de l'entreprise...
      </div>
    );
  }

  const handleChange = (field: keyof Company, value: any) => {
    setCompany((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(
        "Le logo est trop volumineux. La taille maximale autorisée est de 2 Mo.",
      );
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Format non supporté. Veuillez utiliser un fichier PNG, JPG, WEBP ou SVG.",
      );
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const updatedCompany = await executeUpload(() =>
        uploadCompanyLogo(company.idCompany, file),
      );
      if (updatedCompany) {
        setCompany(updatedCompany);
      }
    } catch (err: any) {
      setUploadError(
        err.message ||
          "Une erreur est survenue lors du téléversement de l'image.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmCancelSubscription = async () => {
    setIsCanceling(true);
    setCancelMessage(null);

    try {
      await cancelSubscription(company.idCompany);
      setCancelMessage({
        type: "success",
        text: "Votre abonnement a été résilié avec succès. Il restera actif jusqu'à la fin de la période en cours.",
      });
      setIsCancelModalOpen(false);
    } catch (err: any) {
      setCancelMessage({
        type: "error",
        text:
          err.message ||
          "Une erreur est survenue lors de la résiliation de l'abonnement.",
      });
      setIsCancelModalOpen(false);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleSubscribe = async () => {
    setLoadingStripe(true);
    try {
      // Remplace par ta fonction d'appel API Stripe existante si nécessaire
      // Ex: const res = await createCheckoutSession(company.idCompany);
      // window.location.href = res.url;
    } catch (err: any) {
      console.error("Erreur redirection Stripe:", err);
    } finally {
      setLoadingStripe(false);
    }
  };

  const handleDeleteCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmCompanyName !== company.name) {
      setDeleteError("Le nom de l'entreprise ne correspond pas.");
      return;
    }
    setDeleteError(null);
    setIsDeleting(true);

    try {
      await deleteCompany(company.idCompany);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      setIsDeleting(false);
      setDeletionSuccess(true);

      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err: any) {
      setDeleteError(
        err.message ||
          "Une erreur est survenue lors de la suppression de l'entreprise.",
      );
      setIsDeleting(false);
    }
  };

  const isManufactured =
    (configuration?.productManagementMode as string) === "MANUFACTURED" ||
    (configuration?.productManagementMode as string) === "PRODUCTION";

  const managementLabel = isManufactured
    ? "Fabrication / assemblage"
    : "Achat / revente";

  // Détection élargie pour inclure le statut de résiliation en cours
  const subStatus = company.subscriptionStatus || (company as any).status;
  const isPaid = subStatus === "PAID" || subStatus === "ACTIVE";
  const isCancelPending =
    (company as any).cancelAtPeriodEnd === true ||
    subStatus === "CANCELED_PENDING";

  // On affiche le bloc si l'utilisateur est payant OU si son abonnement est en fin de vie planifiée
  const showBillingBlock = isPaid || isCancelPending;

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
        <div className="border-b border-white/5 pb-4">
          <p className="text-sm font-semibold text-white">
            Coordonnées et Infos Légales
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Ces informations ainsi que votre logo apparaîtront sur vos bons de
            commande PDF.
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

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <form onSubmit={onSaveCompany} className="space-y-6 lg:col-span-2">
            <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-slate-950 p-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-slate-500 overflow-hidden">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt="Logo entreprise"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs">Logo</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Logo de l'entreprise
                  </label>
                  <span className="text-[10px] text-slate-500">
                    PNG, JPG, WEBP, SVG • Max : 2 Mo
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-400 file:text-slate-950 hover:file:bg-cyan-300 file:cursor-pointer cursor-pointer disabled:opacity-50"
                />
                {uploading && (
                  <p className="text-xs text-cyan-400">
                    Téléversement en cours...
                  </p>
                )}
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
                {actionLoading
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-slate-950 p-5">
              <p className="text-sm font-semibold text-white">
                Mode de fonctionnement BuyLogic
              </p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Définit la manière dont BuyLogic analyse vos besoins d'achats et
                de stocks.
              </p>

              <div className="mt-4 rounded-lg border border-white/5 bg-slate-900 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Gestion des produits
                </p>
                <p className="mt-1.5 text-sm font-semibold text-slate-200">
                  {managementLabel}
                </p>
              </div>
            </div>

            {showBillingBlock && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-amber-400">
                    Abonnement
                  </p>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {isCancelPending
                      ? "Votre abonnement est résilié mais reste actif jusqu'à la fin de la période payée."
                      : "Besoin d'interrompre votre abonnement ? Vous pouvez le résilier à tout moment."}
                  </p>
                </div>

                {cancelMessage && (
                  <div
                    className={`rounded-lg p-3 text-xs ${cancelMessage.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300" : "bg-rose-500/10 border border-rose-500/20 text-rose-300"}`}
                  >
                    {cancelMessage.text}
                  </div>
                )}

                {isCancelPending ? (
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={loadingStripe}
                    className="w-full cursor-pointer rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-50"
                  >
                    {loadingStripe ? "Redirection..." : "Se réabonner"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    disabled={isCanceling}
                    className="w-full cursor-pointer rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500 hover:text-slate-950 disabled:opacity-50"
                  >
                    {isCanceling ? "Résiliation..." : "Résilier mon abonnement"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- ZONE DE DANGER : SUPPRESSION DE L'ENTREPRISE --- */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-rose-400">Zone de danger</p>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              La suppression de l'entreprise entraînera la résiliation immédiate
              de votre abonnement Stripe, l'effacement de vos fichiers
              Cloudinary et la purge définitive de toutes vos données métiers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmCompanyName("");
              setDeleteError(null);
              setDeletionSuccess(false);
              setIsDeleteModalOpen(true);
            }}
            className="cursor-pointer shrink-0 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 transition hover:bg-rose-500 hover:text-white"
          >
            Supprimer l'entreprise
          </button>
        </div>
      </div>

      {/* --- MODALE DE CONFIRMATION DE RÉSILIATION D'ABONNEMENT --- */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl">
            <p className="text-lg font-bold text-amber-400">
              Confirmer la résiliation ?
            </p>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Voulez-vous vraiment résilier votre abonnement ? Il restera{" "}
              <strong className="text-white">
                actif jusqu'à la fin de la période déjà payée
              </strong>{" "}
              avant de passer en mode inactif.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCanceling}
                className="cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                Conserver mon abonnement
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelSubscription}
                disabled={isCanceling}
                className="cursor-pointer rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
              >
                {isCanceling ? "Résiliation..." : "Oui, résilier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODALE DE CONFIRMATION DE SUPPRESSION D'ENTREPRISE --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl">
            {deletionSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xl">
                  ✓
                </div>
                <p className="text-lg font-bold text-white">
                  Entreprise supprimée avec succès !
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Toutes vos données ont bien été purgées. À bientôt sur
                  BuyLogic !
                </p>
                <p className="text-[11px] text-cyan-400 animate-pulse pt-2">
                  Redirection vers la page de connexion...
                </p>
              </div>
            ) : (
              <>
                <p className="text-lg font-bold text-rose-400">
                  Êtes-vous absolument sûr ?
                </p>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Cette action est{" "}
                  <strong className="text-white">irréversible</strong>. Elle
                  supprimera définitivement l'entreprise{" "}
                  <span className="text-white font-semibold">
                    {company.name}
                  </span>
                  , résiliera vos paiements et effacera l'ensemble de vos
                  données.
                </p>

                <form
                  onSubmit={handleDeleteCompanySubmit}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Veuillez taper{" "}
                      <span className="text-rose-300 select-all font-mono">
                        {company.name}
                      </span>{" "}
                      pour confirmer :
                    </label>
                    <input
                      type="text"
                      value={confirmCompanyName}
                      onChange={(e) => setConfirmCompanyName(e.target.value)}
                      placeholder={company.name}
                      disabled={isDeleting}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  {deleteError && (
                    <p className="text-xs text-rose-400 font-semibold">
                      {deleteError}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={isDeleting}
                      className="cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={
                        confirmCompanyName !== company.name || isDeleting
                      }
                      className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isDeleting
                        ? "Suppression en cours..."
                        : "Supprimer définitivement"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}