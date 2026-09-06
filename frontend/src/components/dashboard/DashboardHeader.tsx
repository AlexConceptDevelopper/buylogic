import { useState, useEffect } from "react";
import { createCheckoutSession } from "../../api/billing.api";
import { getCompanyById } from "../../api/company.api";
import { useAuth } from "../../context/AuthContext";

interface DashboardHeaderProps {
  remainingTrialDays?: number;
  trialExpired?: boolean;
  subscriptionStatus?: string;
}

export default function DashboardHeader({
  remainingTrialDays: propRemainingDays,
  trialExpired: propTrialExpired,
  subscriptionStatus: propStatus,
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [isLoaded, setIsLoaded] = useState(propRemainingDays !== undefined || propStatus !== undefined);
  
  const [remainingTrialDays, setRemainingTrialDays] = useState<number | undefined>(propRemainingDays);
  const [trialExpired, setTrialExpired] = useState<boolean | undefined>(propTrialExpired);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | undefined>(propStatus);

  useEffect(() => {
    if (user?.idCompany) {
      getCompanyById(user.idCompany)
        .then((company: any) => {
          if (company) {
            setRemainingTrialDays(company.remainingTrialDays);
            setTrialExpired(company.trialExpired);
            // On récupère le statut exact (ex: "PAID", "ACTIVE", "TRIAL", etc.)
            setSubscriptionStatus(company.subscriptionStatus || company.status);
          }
        })
        .catch((err) => console.error("Erreur chargement infos trial", err))
        .finally(() => setIsLoaded(true));
    } else {
      setIsLoaded(true);
    }
  }, [user?.idCompany]);

  const role = user?.role?.toUpperCase();
  const isOwner = role === "OWNER" || role === "SUPER_ADMIN";
  const companyId = user?.idCompany;

  const handleSubscribe = async () => {
    if (!companyId || !isOwner) return;

    try {
      setLoadingStripe(true);
      const data = await createCheckoutSession(companyId);
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erreur lors de la redirection vers Stripe", error);
    } finally {
      setLoadingStripe(false);
    }
  };

  // Un utilisateur est considéré comme "payant" si son statut n'est pas "TRIAL" (ou s'il est explicitement PAID/ACTIVE)
  const isPaid = subscriptionStatus === "PAID" || subscriptionStatus === "ACTIVE";

  let badgeStyle = "border-cyan-400/20 bg-cyan-400/5 text-cyan-300";
  let dotStyle = "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]";
  let label = `Il vous reste ${remainingTrialDays} jour${remainingTrialDays! > 1 ? "s" : ""} d'essai`;

  if (trialExpired || remainingTrialDays === 0) {
    badgeStyle = "border-red-400/20 bg-red-400/5 text-red-300";
    dotStyle = "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.7)] animate-pulse";
    label = "Essai expiré";
  } else if (remainingTrialDays !== undefined && remainingTrialDays <= 3) {
    badgeStyle = "border-red-400/20 bg-red-400/5 text-red-300";
    dotStyle = "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.7)] animate-pulse";
  } else if (remainingTrialDays !== undefined && remainingTrialDays <= 7) {
    badgeStyle = "border-amber-400/20 bg-amber-400/5 text-amber-300";
    dotStyle = "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]";
  }

  const showSubscribeButton =
    isOwner && (trialExpired || (remainingTrialDays !== undefined && remainingTrialDays <= 7));

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Vue d'ensemble
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Gardez un œil sur vos stocks, vos commandes et les recommandations de
          BuyLogic.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* On n'affiche le bloc d'abonnement que lorsque l'appel API a fini de tourner */}
        {isLoaded && (
          <>
            {isPaid ? (
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                  <span className="text-xs font-semibold text-cyan-300">
                    Abonnement Pro Actif
                  </span>
                </div>
              </div>
            ) : (
              remainingTrialDays !== undefined && (
                <div className={`rounded-xl border px-4 py-2.5 flex items-center gap-3 ${badgeStyle}`}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${dotStyle}`} />
                    <span className="text-xs font-semibold">{label}</span>
                  </div>

                  {showSubscribeButton && (
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={loadingStripe}
                      className="cursor-pointer rounded-lg bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                    >
                      {loadingStripe ? "Redirection..." : "S'abonner"}
                    </button>
                  )}
                </div>
              )
            )}
          </>
        )}

        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
            <span className="text-xs font-semibold text-emerald-300">
              Système opérationnel
            </span>
          </div>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/6 hover:text-white"
        >
          Actualiser
        </button>
      </div>
    </div>
  );
}