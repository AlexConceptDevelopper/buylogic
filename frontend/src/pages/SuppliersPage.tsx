import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getSuppliers } from "../api/supplier.api";
import useAsync from "../hooks/useAsync";

import type { Supplier } from "../types/supplier";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");

  const {
    loading,
    error,
    execute,
  } = useAsync<Supplier[]>();

  useEffect(() => {
    const loadSuppliers = async () => {
      const data = await execute(() => getSuppliers());

      if (data) {
        setSuppliers(data);
      }
    };

    void loadSuppliers();
  }, [execute]);

  const filteredSuppliers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return suppliers;
    }

    return suppliers.filter(
      (supplier) =>
        supplier.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        supplier.email
          .toLowerCase()
          .includes(normalizedSearch) ||
        supplier.phone
          .toLowerCase()
          .includes(normalizedSearch),
    );
  }, [suppliers, search]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="h-4 w-24 animate-pulse rounded bg-white/5" />

        <div className="mt-3 h-10 w-72 animate-pulse rounded bg-white/5" />

        <div className="mt-8 h-12 animate-pulse rounded-xl bg-white/5" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="h-44 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-44 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-44 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Fournisseurs
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Vos fournisseurs
        </h1>

        <div className="mt-8 rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Impossible de charger les fournisseurs.
          </p>

          <p className="mt-2 text-sm text-red-300">
            Une erreur est survenue lors de la récupération des
            fournisseurs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Fournisseurs
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Vos fournisseurs
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Retrouvez vos fournisseurs et leurs coordonnées
            pour gérer vos achats plus facilement.
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
          <p className="text-xs text-slate-500">
            Fournisseurs
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {suppliers.length}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <label
          htmlFor="supplier-search"
          className="sr-only"
        >
          Rechercher un fournisseur
        </label>

        <input
          id="supplier-search"
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Rechercher par nom, email ou téléphone..."
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
        />
      </div>

      {filteredSuppliers.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-white/5 bg-slate-900/70 p-10 text-center">
          <p className="text-sm font-semibold text-white">
            Aucun fournisseur trouvé
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Aucun fournisseur ne correspond à votre recherche.
          </p>
        </section>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <Link
              key={supplier.idSupplier}
              to={`/suppliers/${supplier.idSupplier}`}
              className="group cursor-pointer rounded-2xl border border-white/5 bg-slate-900/70 p-5 transition hover:border-cyan-400/20 hover:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white transition group-hover:text-cyan-300">
                    {supplier.name}
                  </p>

                  <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-600">
                    Fournisseur
                  </p>
                </div>

                <span
                  className={[
                    "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                    supplier.active
                      ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                      : "border-slate-400/20 bg-slate-400/5 text-slate-400",
                  ].join(" ")}
                >
                  {supplier.active ? "Actif" : "Inactif"}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-300">
                    {supplier.email || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Téléphone
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    {supplier.phone || "Non renseigné"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <span className="text-xs font-semibold text-slate-600 transition group-hover:text-cyan-300">
                  Voir le fournisseur →
                </span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}