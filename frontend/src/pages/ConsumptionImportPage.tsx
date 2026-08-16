import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../api/product.api";
import { importConsumptions } from "../api/consumption.api";
import useAsync from "../hooks/useAsync";

import type { Product } from "../types/product";

type ImportRow = {
  date: string;
  reference: string;
  quantity: number;
  product: Product | null;
  error?: string;
};

function parseCsv(content: string): ImportRow[] {
  const lines = content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const firstLine = lines[0];
  const separatorCandidates = [",", ";", "\t"];

  const separator = separatorCandidates.reduce((best, candidate) => {
    const bestCount = firstLine.split(best).length - 1;
    const candidateCount = firstLine.split(candidate).length - 1;

    return candidateCount > bestCount ? candidate : best;
  }, ",");

  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");

  const parseLine = (line: string) => {
    const values: string[] = [];
    let current = "";
    let quoted = false;

    for (let index = 0; index < line.length; index += 1) {
      const character = line[index];

      if (character === '"') {
        if (quoted && line[index + 1] === '"') {
          current += '"';
          index += 1;
          continue;
        }

        quoted = !quoted;
        continue;
      }

      if (character === separator && !quoted) {
        values.push(current.trim());
        current = "";
        continue;
      }

      current += character;
    }

    values.push(current.trim());

    return values;
  };

  const headers = parseLine(lines[0]).map(normalize);

  const aliases = {
    date: [
      "date",
      "date vente",
      "date de vente",
      "date of sale",
      "jour",
      "sale date",
      "transaction date",
    ],
    reference: [
      "reference",
      "ref",
      "code article",
      "code produit",
      "sku",
      "article code",
      "product code",
    ],
    quantity: [
      "quantity",
      "quantite",
      "qte",
      "qte vendue",
      "quantite vendue",
      "quantite vendues",
      "ventes",
      "quantity sold",
      "qty",
    ],
  };

  const findColumn = (columnAliases: string[]) =>
    headers.findIndex((header) => columnAliases.includes(header));

  const dateIndex = findColumn(aliases.date);
  const referenceIndex = findColumn(aliases.reference);
  const quantityIndex = findColumn(aliases.quantity);

  const missingColumns = [
    dateIndex === -1 ? "date" : null,
    referenceIndex === -1 ? "référence produit" : null,
    quantityIndex === -1 ? "quantité vendue" : null,
  ].filter((value): value is string => value !== null);

  if (missingColumns.length > 0) {
    throw new Error(
      `BuyLogic n'a pas pu identifier ${missingColumns.length === 1 ? "la colonne" : "les colonnes"} : ${missingColumns.join(", ")}. Noms de colonnes acceptés : date, date de vente, date of sale, jour ; référence, ref, code article, code produit, SKU ; quantité, qte, quantité vendue, quantity sold, qty.`,
    );
  }

  const normalizeDate = (value: string) => {
    const trimmedValue = value.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
      return trimmedValue;
    }

    const frenchDateMatch = trimmedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (frenchDateMatch) {
      const [, day, month, year] = frenchDateMatch;

      return `${year}-${month}-${day}`;
    }

    const shortFrenchDateMatch = trimmedValue.match(
      /^(\d{2})\/(\d{2})\/(\d{2})$/,
    );

    if (shortFrenchDateMatch) {
      const [, day, month, shortYear] = shortFrenchDateMatch;
      const year =
        Number(shortYear) >= 70 ? `19${shortYear}` : `20${shortYear}`;

      return `${year}-${month}-${day}`;
    }

    return trimmedValue;
  };

  return lines.slice(1).map((line) => {
    const values = parseLine(line);

    return {
      date: normalizeDate(values[dateIndex] ?? ""),
      reference: values[referenceIndex] ?? "",
      quantity: Number(values[quantityIndex] ?? ""),
      product: null,
    };
  });
}

export default function ConsumptionImportPage() {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importedCount, setImportedCount] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);
  const [importCompleted, setImportCompleted] = useState(false);

  const {
    loading: productsLoading,
    error: productsError,
    execute: executeProducts,
  } = useAsync<Product[]>();

  const { loading: importing, execute: executeImport } = useAsync<number>();

  const recognizedRows = useMemo(
    () => rows.filter((row) => row.product !== null && !row.error),
    [rows],
  );

  const invalidRows = useMemo(
    () => rows.filter((row) => row.product === null || !!row.error),
    [rows],
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setRows([]);
    setFileName("");
    setSelectedFile(null);
    setImportedCount(0);
    setImportError(null);
    setImportCompleted(false);

    if (!file) {
      return;
    }

    setFileName(file.name);
    setSelectedFile(file);

    try {
      const content = await file.text();
      const parsedRows = parseCsv(content);

      if (parsedRows.length === 0) {
        setImportError("Le fichier ne contient aucune ligne exploitable.");
        return;
      }

      const products = await executeProducts(() => getProducts());

      if (!products) {
        setImportError("Impossible de récupérer les produits BuyLogic.");
        return;
      }

      const enrichedRows = parsedRows.map((row) => {
        const normalizedReference = row.reference.toLowerCase().trim();

        const product =
          products.find(
            (item) =>
              item.reference.toLowerCase().trim() === normalizedReference,
          ) ?? null;

        if (!product) {
          return {
            ...row,
            product: null,
            error: "Référence produit inconnue",
          };
        }

        if (!Number.isFinite(row.quantity)) {
          return {
            ...row,
            product,
            error: "Quantité invalide",
          };
        }

        if (row.quantity <= 0) {
          return {
            ...row,
            product,
            error: "La quantité doit être supérieure à 0",
          };
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
          return {
            ...row,
            product,
            error: "Date invalide",
          };
        }

        return {
          ...row,
          product,
        };
      });

      setRows(enrichedRows);
    } catch (error) {
      setImportError(
        error instanceof Error
          ? error.message
          : "Impossible de lire ce fichier CSV.",
      );
    }
  };

  const handleImport = async () => {
    if (
      recognizedRows.length === 0 ||
      invalidRows.length > 0 ||
      !selectedFile
    ) {
      return;
    }

    setImportError(null);
    setImportedCount(0);

    try {
      const fileBuffer = await selectedFile.arrayBuffer();

      const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);

      const fileHash = Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      const result = await executeImport(() =>
        importConsumptions({
          fileName: selectedFile.name,
          fileHash,
          rows: recognizedRows.map((row) => ({
            reference: row.reference,
            quantity: row.quantity,
            consumptionDate: row.date,
          })),
        }),
      );

      if (!result) {
        setImportError(
          "Impossible de terminer l'import. Le fichier a peut-être déjà été importé ou une erreur est survenue côté serveur.",
        );
        return;
      }

      setImportedCount(result);
      setImportCompleted(true);
    } catch {
      setImportError(
        "Impossible de calculer l'identifiant sécurisé du fichier ou de terminer l'import.",
      );
    }
  };

  const resetImport = () => {
    setRows([]);
    setFileName("");
    setSelectedFile(null);
    setImportedCount(0);
    setImportError(null);
    setImportCompleted(false);
  };

  const canImport =
    recognizedRows.length > 0 &&
    invalidRows.length === 0 &&
    selectedFile !== null &&
    !productsLoading &&
    !productsError &&
    !importing &&
    !importCompleted;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        to="/dashboard"
        className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-cyan-300"
      >
        ← Dashboard
      </Link>

      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Import des ventes
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Importer une journée de ventes
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          BuyLogic détecte automatiquement le séparateur, l'ordre et les noms
          courants des colonnes nécessaires à l'import.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-white/5 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Fichier de ventes
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              CSV avec une date de vente, une référence produit et une quantité
              vendue. Leur ordre et leur nom peuvent varier.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white">
            Choisir un fichier
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>

        {fileName && (
          <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-3">
            <p className="text-sm font-semibold text-cyan-300">{fileName}</p>

            <p className="mt-1 text-xs text-slate-500">
              {rows.length} ligne
              {rows.length > 1 ? "s" : ""} détectée
              {rows.length > 1 ? "s" : ""}
            </p>
          </div>
        )}

        {productsLoading && (
          <p className="mt-5 text-sm text-slate-500">
            Vérification des références produits...
          </p>
        )}

        {importError && (
          <div className="mt-5 rounded-xl border border-red-400/10 bg-red-400/5 p-4">
            <p className="text-sm font-semibold text-red-300">{importError}</p>
          </div>
        )}
      </section>

      {rows.length > 0 && (
        <>
          {importCompleted ? (
            <section className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-lg font-bold text-emerald-300">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    Import terminé avec succès
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {importedCount} consommation
                    {importedCount > 1 ? "s" : ""} ont été créées à partir de ce
                    fichier.
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Ce fichier est verrouillé sur cette page pour éviter un
                    double import accidentel.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetImport}
                className="mt-5 cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                Importer un autre fichier
              </button>
            </section>
          ) : (
            <>
              <section className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
                  <p className="text-xs text-slate-500">Lignes détectées</p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    {rows.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">
                  <p className="text-xs text-slate-500">Produits reconnus</p>

                  <p className="mt-2 text-2xl font-bold text-emerald-300">
                    {recognizedRows.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-5">
                  <p className="text-xs text-slate-500">Lignes à vérifier</p>

                  <p className="mt-2 text-2xl font-bold text-amber-300">
                    {invalidRows.length}
                  </p>
                </div>
              </section>

              <section className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70">
                <div className="border-b border-white/5 px-6 py-4">
                  <p className="text-sm font-semibold text-white">
                    Aperçu de l'import
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Vérifiez les lignes avant leur création dans BuyLogic.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-187.5 border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-left">
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                          Date
                        </th>

                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                          Référence
                        </th>

                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                          Produit
                        </th>

                        <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                          Quantité
                        </th>

                        <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                          Statut
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {rows.map((row, index) => (
                        <tr
                          key={`${row.reference}-${row.date}-${index}`}
                          className="border-b border-white/5 last:border-b-0"
                        >
                          <td className="px-5 py-4 text-sm text-slate-400">
                            {row.date}
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-slate-300">
                            {row.reference}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-slate-200">
                              {row.product?.name ?? "Produit inconnu"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-right text-sm font-semibold text-slate-200">
                            {row.quantity.toLocaleString("fr-FR")}
                          </td>

                          <td className="px-5 py-4 text-right">
                            {row.error ? (
                              <span className="inline-flex rounded-full border border-rose-400/20 bg-rose-400/5 px-2.5 py-1 text-[10px] font-semibold text-rose-300">
                                {row.error}
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                                Prête à importer
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {importedCount > 0 && (
                      <p className="text-sm font-semibold text-emerald-300">
                        {importedCount} consommation
                        {importedCount > 1 ? "s" : ""} créée
                        {importedCount > 1 ? "s" : ""}.
                      </p>
                    )}

                    {invalidRows.length > 0 && (
                      <p className="mt-1 text-xs text-slate-500">
                        Les lignes invalides seront bloquées avant l'import.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetImport}
                      className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                    >
                      Réinitialiser
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleImport()}
                      disabled={!canImport}
                      className={[
                        "rounded-xl px-4 py-3 text-sm font-bold transition",
                        canImport
                          ? "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                          : "cursor-not-allowed bg-slate-700 text-slate-500",
                      ].join(" ")}
                    >
                      {importing ? "Import en cours..." : "Importer les ventes"}
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
