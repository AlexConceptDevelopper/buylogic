import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { createSupplier, getSuppliers } from "../api/supplier.api";
import useAsync from "../hooks/useAsync";
import { useAuth } from "../context/AuthContext";

import type { Supplier, SupplierCreate } from "../types/supplier";

export default function SuppliersPage() {
  const { user } = useAuth();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<SupplierCreate>({
    idCompany: user?.idCompany ?? 0,
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [createError, setCreateError] = useState<string | null>(null);

  const { loading, error, execute } = useAsync<Supplier[]>();

  const { loading: creating, execute: executeCreate } = useAsync<Supplier>();

  useEffect(() => {
    if (user?.idCompany) {
      setForm((current) => ({
        ...current,
        idCompany: user.idCompany,
      }));
    }
  }, [user?.idCompany]);

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
        supplier.name.toLowerCase().includes(normalizedSearch) ||
        supplier.email.toLowerCase().includes(normalizedSearch) ||
        supplier.phone.toLowerCase().includes(normalizedSearch),
    );
  }, [suppliers, search]);

  const handleCreate = async () => {
    setCreateError(null);

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email?.trim() ?? "";
    const trimmedPhone = form.phone?.trim() ?? "";
    const trimmedAddress = form.address?.trim() ?? "";

    if (!trimmedName) {
      setCreateError("Le nom du fournisseur est obligatoire.");
      return;
    }

    if (!user?.idCompany) {
      setCreateError("Impossible de déterminer l'entreprise courante.");
      return;
    }

    const payload: SupplierCreate = {
      idCompany: user.idCompany,
      name: trimmedName,
      email: trimmedEmail || undefined,
      phone: trimmedPhone || undefined,
      address: trimmedAddress || undefined,
    };

    const created = await executeCreate(() => createSupplier(payload));

    if (!created) {
      setCreateError(
        "Impossible de créer le fournisseur. Vérifiez les informations saisies.",
      );
      return;
    }

    setSuppliers((current) => [created, ...current]);

    setForm({
      idCompany: user.idCompany,
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setCreateOpen(false);
  };

  const handleCloseCreate = () => {
    if (creating) {
      return;
    }

    setCreateError(null);

    setForm({
      idCompany: user?.idCompany ?? 0,
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setCreateOpen(false);
  };

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
            Une erreur est survenue lors de la récupération des fournisseurs.
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
            Retrouvez vos fournisseurs et leurs coordonnées pour gérer vos
            achats plus facilement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
            <p className="text-xs text-slate-500">Fournisseurs</p>

            <p className="mt-1 text-xl font-bold text-white">
              {suppliers.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCreateError(null);
              setCreateOpen(true);
            }}
            className="cursor-pointer rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300"
          >
            Ajouter un fournisseur
          </button>
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="supplier-search" className="sr-only">
          Rechercher un fournisseur
        </label>

        <input
          id="supplier-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
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
            {search.trim()
              ? "Aucun fournisseur ne correspond à votre recherche."
              : "Commencez par ajouter votre premier fournisseur."}
          </p>

          {!search.trim() && (
            <button
              type="button"
              onClick={() => {
                setCreateError(null);
                setCreateOpen(true);
              }}
              className="mt-5 cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Ajouter un fournisseur
            </button>
          )}
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
                  <p className="text-xs text-slate-500">Email</p>

                  <p className="mt-1 truncate text-sm text-slate-300">
                    {supplier.email || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Téléphone</p>

                  <p className="mt-1 text-sm text-slate-300">
                    {supplier.phone || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Adresse</p>

                  <p className="mt-1 line-clamp-2 text-sm text-slate-300">
                    {supplier.address || "Non renseignée"}
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

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-supplier-title"
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Nouveau fournisseur
                </p>

                <h2
                  id="create-supplier-title"
                  className="mt-2 text-2xl font-bold text-white"
                >
                  Ajouter un fournisseur
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enregistrez les coordonnées de votre fournisseur.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseCreate}
                disabled={creating}
                aria-label="Fermer"
                className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="supplier-name"
                  className="text-xs font-semibold text-slate-400"
                >
                  Nom du fournisseur *
                </label>

                <input
                  id="supplier-name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Ex. Minoterie Dupont"
                  disabled={creating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="supplier-email"
                  className="text-xs font-semibold text-slate-400"
                >
                  Email
                </label>

                <input
                  id="supplier-email"
                  type="email"
                  value={form.email ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Ex. commande@fournisseur.fr"
                  disabled={creating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="supplier-phone"
                  className="text-xs font-semibold text-slate-400"
                >
                  Téléphone
                </label>

                <input
                  id="supplier-phone"
                  type="tel"
                  value={form.phone ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="Ex. 05 46 00 00 00"
                  disabled={creating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="supplier-address"
                  className="text-xs font-semibold text-slate-400"
                >
                  Adresse
                </label>

                <textarea
                  id="supplier-address"
                  value={form.address ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  placeholder="Ex. 12 rue des Meuniers, 17100 Saintes"
                  disabled={creating}
                  rows={2}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              {createError && (
                <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-4">
                  <p className="text-sm text-red-300">{createError}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseCreate}
                disabled={creating}
                className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => void handleCreate()}
                disabled={creating}
                className={[
                  "rounded-xl px-4 py-3 text-sm font-bold transition",
                  creating
                    ? "cursor-not-allowed bg-slate-700 text-slate-500"
                    : "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300",
                ].join(" ")}
              >
                {creating ? "Création..." : "Créer le fournisseur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
