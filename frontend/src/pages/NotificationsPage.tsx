import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getNotifications } from "../api/notification.api";
import useAsync from "../hooks/useAsync";
import type { Notification } from "../types/notification";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const {
    loading,
    error,
    execute,
  } = useAsync<Notification[]>();

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await execute(
        () => getNotifications(),
      );

      if (data) {
        setNotifications(data);
      }
    };

    loadNotifications();
  }, [execute]);

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.readAt,
      ).length,
    [notifications],
  );

  const typeStyles: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    PURCHASE_RECOMMENDED: {
      label: "Achat recommandé",
      className:
        "border-cyan-400/20 bg-cyan-400/5 text-cyan-300",
    },

    STOCKOUT_RISK: {
      label: "Risque de rupture",
      className:
        "border-rose-400/20 bg-rose-400/5 text-rose-300",
    },

    OVERSTOCK: {
      label: "Surstock",
      className:
        "border-amber-400/20 bg-amber-400/5 text-amber-300",
    },

    PRICE_INCREASE: {
      label: "Hausse de prix",
      className:
        "border-orange-400/20 bg-orange-400/5 text-orange-300",
    },

    SUPPLIER_DELAY: {
      label: "Retard fournisseur",
      className:
        "border-violet-400/20 bg-violet-400/5 text-violet-300",
    },

    SYSTEM: {
      label: "Système",
      className:
        "border-slate-400/20 bg-slate-400/5 text-slate-300",
    },
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Notifications
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Centre de notifications
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Chargement de vos notifications...
        </p>

        <div className="mt-8 space-y-3">
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Notifications
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Centre de notifications
        </h1>

        <div className="mt-8 rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Impossible de charger les notifications.
          </p>

          <p className="mt-2 text-sm text-red-300">
            Une erreur est survenue lors de la récupération
            des notifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Notifications
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Centre de notifications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Retrouvez les alertes et événements importants
            concernant votre activité BuyLogic.
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
          <p className="text-xs text-slate-500">
            Notifications non lues
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {unreadCount}
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-white/5 bg-slate-900/70 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/5 text-2xl text-emerald-300">
            ✓
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            Tout est à jour
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Aucune notification à afficher pour le moment.
          </p>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70">
          <div className="border-b border-white/5 px-6 py-4">
            <p className="text-sm font-semibold text-white">
              Toutes les notifications
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Les plus récentes apparaissent en premier.
            </p>
          </div>

          <div>
            {notifications.map((notification) => {
              const type =
                typeStyles[notification.type] ?? {
                  label: notification.type,
                  className:
                    "border-white/10 bg-white/5 text-slate-300",
                };

              const formattedDate = new Date(
                notification.createdAt,
              ).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              const notificationContent = (
                <article
                  className={[
                    "border-b border-white/5 px-6 py-5 last:border-b-0",
                    !notification.readAt
                      ? "bg-cyan-400/2.5"
                      : "",
                    notification.idProduct
                      ? "cursor-pointer transition hover:bg-white/3"
                      : "",
                  ].join(" ")}
                >
                  <div className="flex gap-4">
                    <div
                      className={[
                        "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm",
                        type.className,
                      ].join(" ")}
                    >
                      {!notification.readAt ? "!" : "✓"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-sm font-semibold text-white">
                              {notification.title}
                            </h2>

                            {!notification.readAt && (
                              <span className="h-2 w-2 rounded-full bg-cyan-400" />
                            )}
                          </div>

                          {notification.productName && (
                            <p className="mt-2 text-sm font-semibold text-cyan-300">
                              {notification.productName}
                            </p>
                          )}

                          {notification.productReference && (
                            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-600">
                              {notification.productReference}
                            </p>
                          )}

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {notification.message}
                          </p>
                        </div>

                        <span
                          className={[
                            "inline-flex shrink-0 self-start rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                            type.className,
                          ].join(" ")}
                        >
                          {type.label}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-4">
                        <p className="text-[11px] text-slate-600">
                          {formattedDate}
                        </p>

                        {notification.idProduct && (
                          <span className="text-xs font-semibold text-cyan-300">
                            Voir le produit →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );

              if (notification.idProduct) {
                return (
                  <Link
                    key={notification.idNotification}
                    to={`/products/${notification.idProduct}`}
                    className="block"
                  >
                    {notificationContent}
                  </Link>
                );
              }

              return (
                <div key={notification.idNotification}>
                  {notificationContent}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}