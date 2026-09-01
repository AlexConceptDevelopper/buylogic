import { Link } from "react-router-dom";
import SalesImportTab from "../components/import/SalesImportTab";

export default function ImportHubPage() {
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
          Centre d'import
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Importation de données en masse
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Importez vos journées de ventes et consommations via des fichiers CSV.
        </p>
      </div>

      <div className="mt-8">
        <SalesImportTab />
      </div>
    </div>
  );
}