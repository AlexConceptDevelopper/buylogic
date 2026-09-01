import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { getProducts } from "../../api/product.api";
import { importConsumptions } from "../../api/consumption.api";
import useAsync from "../../hooks/useAsync";
import type { Product } from "../../types/product";

// Parseur interne gérant les virgules et les points-virgules pour n'importe quel CSV
function parseRawCsv(content: string): { headers: string[]; rawRows: Record<string, string>[] } {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rawRows: [] };

  const separator = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(separator).map((h) => h.trim().replace(/^["'](.*)["']$/, "$1"));
  
  const rawRows = lines.slice(1).map((line) => {
    const values = line.split(separator).map((v) => v.trim().replace(/^["'](.*)["']$/, "$1"));
    const rowObj: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowObj[header] = values[index] ?? "";
    });
    return rowObj;
  });

  return { headers, rawRows };
}

type SalesImportRow = {
  date: string;
  reference: string;
  quantity: number;
  product: Product | null;
  error?: string;
};

export default function SalesImportTab() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  
  const [mapping, setMapping] = useState<{ date: string; reference: string; quantity: string }>({
    date: "",
    reference: "",
    quantity: "",
  });
  const [needsMapping, setNeedsMapping] = useState(false);

  const [rows, setRows] = useState<SalesImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importedCount, setImportedCount] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);
  const [importCompleted, setImportCompleted] = useState(false);

  const { loading: productsLoading, execute: executeProducts } = useAsync<Product[]>();
  const { loading: importing } = useAsync<number>();

  const recognizedRows = useMemo(() => rows.filter((r) => r.product !== null && !r.error), [rows]);
  const invalidRows = useMemo(() => rows.filter((r) => r.product === null || !!r.error), [rows]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    resetImport();

    if (!file) return;

    setFileName(file.name);
    setSelectedFile(file);

    try {
      const content = await file.text();
      const parsedData = parseRawCsv(content);

      if (parsedData.headers.length === 0 || parsedData.rawRows.length === 0) {
        setImportError("Le fichier ne contient aucune ligne exploitable.");
        return;
      }

      setHeaders(parsedData.headers);
      setRawRows(parsedData.rawRows);

      // Détection automatique élargie
      const findMatch = (keywords: string[]) => 
        parsedData.headers.find((h) => {
          const lower = h.toLowerCase();
          return keywords.some((kw) => lower.includes(kw));
        }) ?? "";

      const defaultMapping = {
        date: findMatch(["date", "jour", "transaction"]),
        reference: findMatch(["reference", "ref", "code", "sku", "article"]),
        quantity: findMatch(["qte", "quantite", "qty", "quantity", "vente"]),
      };

      // On pré-remplit les selects et on force l'affichage du bloc de correspondance
      setMapping(defaultMapping);
      setNeedsMapping(true);
    } catch (error: any) {
      setImportError(error?.message || "Impossible de lire ce fichier CSV.");
    }
  };

  const processRows = async (dataToProcess: Record<string, string>[], currentMapping: { date: string; reference: string; quantity: string }) => {
    setImportError(null);
    try {
      const products = await executeProducts(() => getProducts());
      if (!products) {
        setImportError("Impossible de récupérer les produits.");
        return;
      }

      const enriched: SalesImportRow[] = dataToProcess.map((raw) => {
        const date = raw[currentMapping.date] ?? "";
        const reference = raw[currentMapping.reference] ?? "";
        const quantity = parseFloat(raw[currentMapping.quantity] ?? "0");

        const product = products.find((p) => p.reference.toLowerCase().trim() === reference.toLowerCase().trim()) ?? null;
        
        if (!product) return { date, reference, quantity, product: null, error: "Référence inconnue" };
        if (!Number.isFinite(quantity) || quantity <= 0) return { date, reference, quantity, product, error: "Quantité invalide (> 0 requis)" };
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { date, reference, quantity, product, error: "Date invalide (AAAA-MM-JJ)" };
        
        return { date, reference, quantity, product };
      });

      setRows(enriched);
      setNeedsMapping(false);
    } catch (error: any) {
      setImportError(error?.message || "Erreur lors du traitement des lignes.");
    }
  };

  const handleApplyMapping = async () => {
    if (!mapping.date || !mapping.reference || !mapping.quantity) {
      setImportError("Veuillez associer chaque champ obligatoire.");
      return;
    }
    await processRows(rawRows, mapping);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (recognizedRows.length === 0 || invalidRows.length > 0 || !selectedFile) return;

    setImportError(null);
    try {
      const fileBuffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
      const fileHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");

      const count = await importConsumptions({
        fileName: selectedFile.name,
        fileHash,
        rows: recognizedRows.map((r) => ({ reference: r.reference, quantity: r.quantity, consumptionDate: r.date })),
      });

      setImportedCount(typeof count === "number" ? count : recognizedRows.length);
      setImportCompleted(true);
    } catch (error: any) {
      const serverMsg = error?.response?.data?.message || error?.message || "";
      setImportError(serverMsg || "Erreur lors de l'import des ventes.");
    }
  };

  const resetImport = () => {
    setRows([]);
    setFileName("");
    setSelectedFile(null);
    setHeaders([]);
    setRawRows([]);
    setNeedsMapping(false);
    setImportedCount(0);
    setImportError(null);
    setImportCompleted(false);
  };

  const canImport = recognizedRows.length > 0 && invalidRows.length === 0 && selectedFile !== null && !productsLoading && !importing && !importCompleted;

  return (
    <div>
      <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Fichier de ventes (Consommations)</p>
            <p className="mt-1 text-xs text-slate-500">CSV contenant la date, la référence produit et la quantité vendue.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">
            Choisir un fichier
            <input type="file" accept=".csv,text/csv" onChange={handleFileChange} className="sr-only" />
          </label>
        </div>
        {fileName && <p className="mt-4 text-sm text-cyan-300">Fichier chargé : {fileName} ({rawRows.length} lignes)</p>}
        {importError && <div className="mt-4 rounded-xl bg-red-400/5 p-4 text-sm text-red-300 border border-red-400/10">{importError}</div>}
      </section>

      {/* Écran de mapping bloquant si les colonnes ne matchent pas toutes */}
      {needsMapping && headers.length > 0 && (
        <section className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-900/90 p-6 shadow-xl">
          <h3 className="text-base font-bold text-white">Correspondance des colonnes</h3>
          <p className="mt-1 text-xs text-slate-400">
            Certaines colonnes n'ont pas pu être reliées automatiquement. Pour que l'import fonctionne, veuillez associer vos en-têtes aux 3 champs obligatoires :
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-cyan-300 font-medium">📅 Une colonne de Date (ex: date, date_transaction)</span>
            <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-cyan-300 font-medium">🏷️ Une Référence produit (ex: reference, ref_sku)</span>
            <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-cyan-300 font-medium">🔢 Une Quantité (ex: quantite, qte)</span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date de vente *</label>
              <select
                value={mapping.date}
                onChange={(e) => setMapping({ ...mapping, date: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-2 text-sm text-white"
              >
                <option value="">-- Choisir --</option>
                {headers.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Référence produit *</label>
              <select
                value={mapping.reference}
                onChange={(e) => setMapping({ ...mapping, reference: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-2 text-sm text-white"
              >
                <option value="">-- Choisir --</option>
                {headers.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quantité *</label>
              <select
                value={mapping.quantity}
                onChange={(e) => setMapping({ ...mapping, quantity: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-2 text-sm text-white"
              >
                <option value="">-- Choisir --</option>
                {headers.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleApplyMapping}
              className="rounded-xl bg-cyan-400 px-5 py-2 text-sm font-bold text-slate-950 cursor-pointer transition hover:bg-cyan-300"
            >
              Appliquer le mapping et analyser
            </button>
          </div>
        </section>
      )}

      {/* Aperçu affiché uniquement si le mapping est résolu et qu'on n'est plus en mode mapping */}
      {rows.length > 0 && !needsMapping && !importCompleted && (
        <section className="mt-6 rounded-2xl border border-white/5 bg-slate-900/70 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Aperçu ({recognizedRows.length} valides, {invalidRows.length} erreurs)</h3>
            <button onClick={handleImport} disabled={!canImport} className={`rounded-xl px-4 py-2 text-sm font-bold ${canImport ? "bg-cyan-400 text-slate-950 cursor-pointer" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
              {importing ? "Import..." : "Valider l'import des ventes"}
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase text-slate-500">
                  <th className="p-3">Date</th>
                  <th className="p-3">Référence</th>
                  <th className="p-3">Produit</th>
                  <th className="p-3 text-right">Quantité</th>
                  <th className="p-3 text-right">Statut</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="p-3">{row.date}</td>
                    <td className="p-3 font-semibold">{row.reference}</td>
                    <td className="p-3">{row.product?.name ?? "Inconnu"}</td>
                    <td className="p-3 text-right">{row.quantity}</td>
                    <td className="p-3 text-right">
                      {row.error ? <span className="text-rose-400 text-xs">{row.error}</span> : <span className="text-emerald-400 text-xs">OK</span>}
                    </td>
                    <td className="p-3 text-right"><button onClick={() => handleRemoveRow(idx)} className="text-slate-500 hover:text-rose-400">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {importCompleted && (
        <section className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-6 text-emerald-300">
          <p className="font-semibold">Import des ventes réussi ({importedCount} lignes enregistrées) !</p>
          <button onClick={resetImport} className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300">Importer un autre fichier</button>
        </section>
      )}
    </div>
  );
}