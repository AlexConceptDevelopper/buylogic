export type ParsedRow = {
  date: string;
  reference: string;
  quantity: number;
  rawValues: string[];
};

export function parseCsv(content: string, _expectedColumns: string[]): ParsedRow[] {
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

  const aliases: Record<string, string[]> = {
    date: ["date", "date vente", "date de vente", "date of sale", "jour", "sale date", "transaction date"],
    reference: ["reference", "ref", "code article", "code produit", "sku", "article code", "product code"],
    quantity: ["quantity", "quantite", "qte", "qte vendue", "quantite vendue", "quantite vendues", "ventes", "quantity sold", "qty"],
  };

  const findColumn = (columnAliases: string[]) =>
    headers.findIndex((header) => columnAliases.includes(header));

  const dateIndex = findColumn(aliases.date);
  const referenceIndex = findColumn(aliases.reference);
  const quantityIndex = findColumn(aliases.quantity);

  const missingColumns = [
    dateIndex === -1 ? "date" : null,
    referenceIndex === -1 ? "référence produit" : null,
    quantityIndex === -1 ? "quantité" : null,
  ].filter((value): value is string => value !== null);

  if (missingColumns.length > 0) {
    throw new Error(
      `Impossible d'identifier ${missingColumns.length === 1 ? "la colonne" : "les colonnes"} : ${missingColumns.join(", ")}.`,
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

    const shortFrenchDateMatch = trimmedValue.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
    if (shortFrenchDateMatch) {
      const [, day, month, shortYear] = shortFrenchDateMatch;
      const year = Number(shortYear) >= 70 ? `19${shortYear}` : `20${shortYear}`;
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
      rawValues: values,
    };
  });
}