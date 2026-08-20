import { useState } from "react";
import type { Product, ProductCompositionDTO } from "../../types/product";
import { UNIT_LABELS } from "../../constants/product.constants";

interface ManufacturedProductSectionProps {
  product: Product;
  allProducts?: Product[];
  onAddComponent: (component: ProductCompositionDTO) => Promise<void>;
  loading?: boolean;
}

export default function ManufacturedProductSection({
  product,
  allProducts = [],
  onAddComponent,
  loading = false,
}: ManufacturedProductSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ingredientId, setIngredientId] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  // État pour gérer la modification d'un composant existant
  const [editingItem, setEditingItem] = useState<ProductCompositionDTO | null>(
    null,
  );

  const recipeItems = Array.isArray(product.components)
    ? product.components
    : [];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIngredientId(0);
    setQuantity("");
    setFormError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (item: ProductCompositionDTO) => {
    setEditingItem(item);
    setIngredientId(item.idChildProduct);
    setQuantity(String(item.quantity));
    setFormError(null);
    setIsOpen(true);
  };

  const handleSaveIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (ingredientId === 0) {
      setFormError("Veuillez sélectionner un ingrédient.");
      return;
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setFormError("La quantité doit être supérieure à 0.");
      return;
    }

    const componentData: ProductCompositionDTO = {
      idChildProduct: ingredientId,
      quantity: parsedQuantity,
    };

    try {
      await onAddComponent(componentData);
      setIsOpen(false);
      setQuantity("");
      setIngredientId(0);
      setEditingItem(null);
    } catch {
      setFormError("Impossible d'enregistrer cet ingrédient.");
    }
  };

  console.log("Objet product reçu :", product);

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Composition de la recette
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Gérez ici les composants nécessaires pour fabriquer : {product.name}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="cursor-pointer rounded-xl bg-cyan-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Ajouter un ingrédient
        </button>
      </div>

      <div className="mt-6">
        {recipeItems.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/2 p-6 text-center">
            <p className="text-sm text-slate-400">
              Aucun ingrédient dans cette recette pour le moment.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Ajoutez des composants pour constituer votre produit fabriqué.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recipeItems.map((item) => (
              <div
                key={item.idChildProduct}
                className="flex items-center justify-between py-3 text-sm"
              >
                <span className="font-medium text-white">
                  {/* On cherche dans allProducts le produit qui a le même ID que l'ingrédient */}
                  {allProducts.find((p) => p.idProduct === item.idChildProduct)
                    ?.name || `Produit #${item.idChildProduct}`}
                </span>

                <div className="flex items-center gap-4">
                  <span className="text-slate-400">
                    {item.quantity} {UNIT_LABELS[product.unit] || product.unit}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="cursor-pointer text-xs text-cyan-400 hover:underline"
                    >
                      Modifier
                    </button>
                    {/* Bouton de suppression (à relier selon votre API de suppression) */}
                    <button
                      type="button"
                      onClick={() => {
                        // TODO: Implémenter la suppression si besoin
                      }}
                      className="cursor-pointer text-xs text-red-400 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/60 p-4">
          <h4 className="text-sm font-semibold text-white">
            {editingItem
              ? "Modifier la quantité de l'ingrédient"
              : "Associer un ingrédient"}
          </h4>

          {formError && (
            <div className="mt-3 rounded-lg border border-red-400/10 bg-red-400/5 p-3 text-xs text-red-300">
              {formError}
            </div>
          )}

          <form
            onSubmit={(e) => void handleSaveIngredient(e)}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-slate-400">
                Ingrédient
              </label>
              <select
                value={ingredientId}
                disabled={!!editingItem} // On bloque le changement de produit si on modifie juste la quantité
                onChange={(e) => setIngredientId(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40 disabled:opacity-50"
              >
                <option value={0}>Sélectionner un produit...</option>
                {allProducts
                  .filter((p) => p.idProduct !== product.idProduct)
                  .map((p) => (
                    <option key={p.idProduct} value={p.idProduct}>
                      {p.name} ({p.reference})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">
                Quantité nécessaire
              </label>
              <input
                type="number"
                step={product.fractional ? "0.001" : "1"}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ex. 0.5"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
              >
                {loading
                  ? "Enregistrement..."
                  : editingItem
                    ? "Mettre à jour"
                    : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
