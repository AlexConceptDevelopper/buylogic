import { useState, useEffect } from "react";
import { createCheckoutSession } from "../../api/billing.api";
import { getCompanyById } from "../../api/company.api";
import { useAuth } from "../../context/AuthContext";

interface DashboardHeaderProps {
  remainingTrialDays?: number;
  trialExpired?: boolean;
  subscriptionStatus?: string;
  subscriptionEndDate?: string | null; 
  cancelAtPeriodEnd?: boolean;        
}

export default function DashboardHeader({
  remainingTrialDays: propRemainingDays,
  trialExpired: propTrialExpired,
  subscriptionStatus: propStatus,
  subscriptionEndDate: propEndDate,
  cancelAtPeriodEnd: propCancelAtPeriodEnd,
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [isLoaded, setIsLoaded] = useState(propRemainingDays !== undefined || propStatus !== undefined);
  
  const [remainingTrialDays, setRemainingTrialDays] = useState<number | undefined>(propRemainingDays);
  const [trialExpired, setTrialExpired] = useState<boolean | undefined>(propTrialExpired);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | undefined>(propStatus);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null | undefined>(propEndDate);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState<boolean | undefined>(propCancelAtPeriodEnd);

  useEffect(() => {
    if (user?.idCompany) {
      getCompanyById(user.idCompany)
        .then((company: any) => {
          if (company) {
            setRemainingTrialDays(company.remainingTrialDays);
            setTrialExpired(company.trialExpired);
            
            // On récupère le statut et les indicateurs depuis l'objet subscription embarqué
            const sub = company.subscription;
            const subStat = sub?.status || company.subscriptionStatus;
            
            setSubscriptionStatus(subStat);
            setSubscriptionEndDate(sub?.currentPeriodEnd || company.subscriptionEndDate);
            setCancelAtPeriodEnd(sub?.cancelAtPeriodEnd || subStat === "CANCELED_PENDING" || company.cancelAtPeriodEnd);
          }
        })
        .catch((err) => console.error("Erreur chargement infos abonnement", err))
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

  const isCancelPending = subscriptionStatus === "CANCELED_PENDING" || cancelAtPeriodEnd;
  const isPaid = (subscriptionStatus === "PAID" || subscriptionStatus === "ACTIVE") && !isCancelPending;

  // Calcul du nombre de jours restants avant la fin effective de la période payée
  let daysBeforeEnd = 0;
  if (subscriptionEndDate) {
    const diffTime = new Date(subscriptionEndDate).getTime() - new Date().getTime();
    daysBeforeEnd = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

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

  const showSubscribeButton = isOwner && !isPaid;

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
          Gardez un œil sur vos stocks, vos commandes et les recommandations de BuyLogic.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isLoaded && (
          <>
            {isCancelPending ? (
              /* CAS 2 : Abonnement en cours de résiliation (actif jusqu'à la fin de la période) */
              <div className="flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)] animate-pulse" />
                  <span className="text-xs font-semibold text-amber-300">
                    Résilié {daysBeforeEnd > 0 ? `(encore ${daysBeforeEnd} jour${daysBeforeEnd > 1 ? "s" : ""} d'accès)` : ""}
                  </span>
                </div>
                {isOwner && (
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={loadingStripe}
                    className="cursor-pointer rounded-lg bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-50"
                  >
                    {loadingStripe ? "Redirection..." : "Se réabonner"}
                  </button>
                )}
              </div>
            ) : isPaid ? (
              /* CAS STANDARD : Abonnement Pro Actif */
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                  <span className="text-xs font-semibold text-cyan-300">
                    Abonnement Pro Actif
                  </span>
                </div>
              </div>
            ) : (
              /* CAS ESSAI GRATUIT */
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