import ProductAlertRow from "../ProductAlertRow";

export default function ProductAlertList() {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">
            Produits à surveiller
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Analyse basée sur la consommation et le stock actuel
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <ProductAlertRow
          name="Filtre hydraulique"
          reference="FILTRE-001"
          stock={115}
          status="Risque élevé"
          severity="high"
        />

        <ProductAlertRow
          name="Cartouche filtrante"
          reference="CART-001"
          stock={5}
          status="Risque de rupture"
          severity="critical"
        />

        <ProductAlertRow
          name="Gants nitrile"
          reference="GANT-NITRILE"
          stock={85}
          status="À surveiller"
          severity="medium"
        />
      </div>
    </div>
  );
}