import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  deletePurchaseOrder,
  getPurchaseOrders,
} from "../api/purchaseOrder.api";
import useAsync from "../hooks/useAsync";

import PurchaseFilters from "../components/purchase/PurchaseFilters";
import PurchaseStats from "../components/purchase/PurchaseStats";
import PurchaseTable from "../components/purchase/PurchaseTable";

import type { PurchaseOrder } from "../types/purchaseOrder";

type OrderFilter =
  | "ALL"
  | "DRAFT"
  | "ORDERED"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED";

export default function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OrderFilter>("ALL");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { loading, error, execute } = useAsync<PurchaseOrder[]>();

  useEffect(() => {
    const loadOrders = async () => {
      const data = await execute(() => getPurchaseOrders());

      if (data) {
        setOrders(data);
      }
    };

    void loadOrders();
  }, [execute]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      draft: orders.filter((order) => order.status === "DRAFT").length,
      ordered: orders.filter((order) => order.status === "ORDERED").length,
      partiallyReceived: orders.filter(
        (order) => order.status === "PARTIALLY_RECEIVED",
      ).length,
    };
  }, [orders]);

  const handleCreateNew = () => {
    navigate("/purchase-orders/new");
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      await deletePurchaseOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.idPurchaseOrder !== orderId));
      setDeletingId(null);
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...orders]
      .filter((order) => {
        const matchesSearch =
          !normalizedSearch ||
          order.orderNumber.toLowerCase().includes(normalizedSearch) ||
          order.supplierName.toLowerCase().includes(normalizedSearch);

        if (!matchesSearch) {
          return false;
        }

        if (filter === "ALL") {
          return true;
        }

        return order.status === filter;
      })
      .sort((a, b) => {
        const dateA = new Date(a.orderedAt ?? a.createdAt).getTime();
        const dateB = new Date(b.orderedAt ?? b.createdAt).getTime();

        return dateB - dateA;
      });
  }, [orders, search, filter]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
        <div className="mt-3 h-10 w-72 animate-pulse rounded bg-white/5" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
        </div>
        <div className="mt-6 h-12 animate-pulse rounded-xl bg-white/5" />
        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Commandes
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Vos commandes
        </h1>
        <div className="mt-8 rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Impossible de charger les commandes.
          </p>
          <p className="mt-2 text-sm text-red-300">
            Une erreur est survenue lors de la récupération des commandes.
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
            Commandes
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Vos commandes
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Suivez les commandes préparées, envoyées et réceptionnées par votre
            entreprise.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
            <p className="text-xs text-slate-500">Total des commandes</p>
            <p className="mt-1 text-xl font-bold text-white">{stats.total}</p>
          </div>

          <button
            type="button"
            onClick={handleCreateNew}
            className="cursor-pointer rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
          >
            + Nouvelle commande
          </button>
        </div>
      </div>

      <div className="mt-8">
        <PurchaseStats
          stats={stats}
          filter={filter}
          onSelectFilter={setFilter}
        />
      </div>

      <PurchaseFilters
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onSelectFilter={setFilter}
      />

      <PurchaseTable
        orders={filteredOrders}
        deletingId={deletingId}
        onStartDelete={setDeletingId}
        onCancelDelete={() => setDeletingId(null)}
        onConfirmDelete={handleDeleteOrder}
      />
    </div>
  );
}