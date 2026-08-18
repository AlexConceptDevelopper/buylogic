import type { StockMovement } from "../../types/stockMovement";

interface ProductMovementsSectionProps {
  movements: StockMovement[];
}

const movementLabels: Record<string, string> = {
  PURCHASE: "Commande reçue",
  SALE: "Vente",
  RETURN: "Retour",
  LOSS: "Perte / casse",
  ADJUSTMENT: "Ajustement",
  TRANSFER: "Transfert",
};

export default function ProductMovementsSection({
  movements,
}: ProductMovementsSectionProps) {
  return (
    <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">
            Derniers mouvements
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Les derniers changements enregistrés sur ce produit.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-600">
          {movements.length}
        </span>
      </div>

      {movements.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/5 bg-white/2 p-5 text-center">
          <p className="text-sm font-semibold text-slate-300">
            Aucun mouvement récent
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Les réceptions, ventes et ajustements apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-white/5">
          {movements.map((movement) => {
            const quantityIsPositive = movement.quantity > 0;

            const movementType =
              movementLabels[movement.movementType] ??
              movement.movementType;

            return (
              <div
                key={movement.idStockMovement}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-200">
                    {movementType}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {movement.reference || "Sans référence"} ·{" "}
                    {new Date(
                      movement.movementDate,
                    ).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <span
                  className={[
                    "shrink-0 text-sm font-bold",
                    quantityIsPositive
                      ? "text-emerald-300"
                      : "text-rose-300",
                  ].join(" ")}
                >
                  {quantityIsPositive ? "+" : ""}
                  {movement.quantity.toLocaleString("fr-FR")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}