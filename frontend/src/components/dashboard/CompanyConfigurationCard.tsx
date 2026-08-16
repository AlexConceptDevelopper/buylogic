import { useEffect, useMemo, useState } from "react";

import { getCompanyConfiguration } from "../../api/companyConfiguration.api";
import useAsync from "../../hooks/useAsync";

import type { CompanyConfiguration } from "../../types/companyConfiguration";

export default function CompanyConfigurationCard() {
  const [configuration, setConfiguration] =
    useState<CompanyConfiguration | null>(null);

  const { loading, error, execute } = useAsync<CompanyConfiguration>();

  useEffect(() => {
    const loadConfiguration = async () => {
      const data = await execute(() => getCompanyConfiguration());

      if (data) {
        setConfiguration(data);
      }
    };

    void loadConfiguration();
  }, [execute]);

  const labels = useMemo(() => {
    if (!configuration) {
      return null;
    }

    const productManagementLabel =
      configuration.productManagementMode === "RESALE"
        ? "Revente directe"
        : configuration.productManagementMode === "PRODUCTION"
          ? "Fabrication / assemblage"
          : "Revente + fabrication / assemblage";

    const consumptionLabel =
      configuration.consumptionMode === "DIRECT_STOCK_OUT"
        ? "Sortie directe du stock"
        : configuration.consumptionMode === "COMPOSITION"
          ? "Consommation par composition"
          : "Sortie directe + composition";

    const consumptionSourceLabel =
      configuration.consumptionSource === "CSV"
        ? "Import CSV"
        : configuration.consumptionSource === "MANUAL"
          ? "Saisie manuelle"
          : "Import CSV + saisie manuelle";

    return {
      productManagementLabel,
      consumptionLabel,
      consumptionSourceLabel,
    };
  }, [configuration]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
        <div className="h-4 w-40 animate-pulse rounded bg-white/5" />

        <div className="mt-3 h-3 w-72 animate-pulse rounded bg-white/5" />

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="h-20 animate-pulse rounded-xl bg-white/5" />
          <div className="h-20 animate-pulse rounded-xl bg-white/5" />
          <div className="h-20 animate-pulse rounded-xl bg-white/5" />
        </div>
      </section>
    );
  }

  if (error || !configuration || !labels) {
    return null;
  }

  let description =
    "BuyLogic adapte son analyse des achats au fonctionnement de votre entreprise.";

  if (
    configuration.productManagementMode === "RESALE" &&
    configuration.consumptionMode === "DIRECT_STOCK_OUT"
  ) {
    description =
      "Vos produits sont principalement revendus tels quels et les ventes peuvent être suivies directement comme des sorties de stock.";
  } else if (
    configuration.productManagementMode === "PRODUCTION" &&
    configuration.consumptionMode === "COMPOSITION"
  ) {
    description =
      "Vos ventes peuvent entraîner la consommation de plusieurs composants. BuyLogic utilise leurs compositions pour suivre vos besoins.";
  } else if (
    configuration.productManagementMode === "MIXED" ||
    configuration.consumptionMode === "MIXED"
  ) {
    description =
      "BuyLogic prend en charge les produits revendus directement et ceux dont la vente entraîne la consommation de composants.";
  }

  return (
    <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/3 p-6">
      <div>
        <p className="text-sm font-semibold text-white">
          Votre fonctionnement BuyLogic
        </p>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-white/2 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
            Gestion des produits
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-200">
            {labels.productManagementLabel}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
            Gestion du stock
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-200">
            {labels.consumptionLabel}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
            Données de consommation
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-200">
            {labels.consumptionSourceLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
