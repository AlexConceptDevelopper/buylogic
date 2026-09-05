import { useState, useEffect } from "react";
import {
  adminGetAuditLogs,
  adminDeleteAuditLog,
} from "../../api/super-admin.api";
import type { AuditLog } from "../../types/auditLog";

export default function SecurityLogsManager() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  
  // État pour stocker le log en attente de confirmation de suppression
  const [logToDelete, setLogToDelete] = useState<AuditLog | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    adminGetAuditLogs()
      .then((data) => {
        setLogs(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des logs d'audit :", err);
        setLoading(false);
      });
  }, []);

  const handleDeleteClick = (e: React.MouseEvent, log: AuditLog) => {
    e.stopPropagation();
    setLogToDelete(log); // Ouvre la modale de confirmation
  };

  const executeDelete = async (log: AuditLog) => {
    setActionId(log.id);
    try {
      await adminDeleteAuditLog(log.id);
      setLogs(logs.filter((l) => l.id !== log.id));
      if (selectedLog?.id === log.id) {
        setSelectedLog(null);
      }
      setActionMessage({ type: 'success', text: "Le journal d'audit a été supprimé avec succès." });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression du log :", err);
      setActionMessage({ type: 'error', text: "Impossible de supprimer le journal d'audit." });
      setTimeout(() => setActionMessage(null), 4000);
    } finally {
      setActionId(null);
      setLogToDelete(null);
    }
  };

  const filteredLogs =
    filter === "ALL" ? logs : logs.filter((log) => log.status === filter);

  return (
    <div className="space-y-6">
      {/* Alerte de notification intégrée */}
      {actionMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center justify-between animate-fadeIn ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-current opacity-70 hover:opacity-100 font-bold ml-4">✕</button>
        </div>
      )}

      {/* En-tête de section & Filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Journaux d'Audit & Sécurité
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Traçabilité en temps réel des actions système et tentatives d'accès
            critiques. (Clique sur une ligne pour voir les détails)
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
          {["ALL", "SUCCESS", "CRITICAL"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === st
                  ? "bg-red-500 text-slate-950 shadow-md shadow-red-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st === "ALL" ? "Tous" : st === "SUCCESS" ? "Succès" : "Critique"}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des logs */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Chargement des journaux de sécurité...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Aucun journal ne correspond à ce filtre.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="p-4">Horodatage</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Acteur</th>
                  <th className="p-4">Adresse IP</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Détails</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-900/50 transition cursor-pointer group"
                  >
                    <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-4 font-bold text-white group-hover:text-red-400 transition">
                      {log.action}
                    </td>
                    <td className="p-4 text-slate-300">{log.actor}</td>
                    <td className="p-4 font-mono text-slate-400">
                      {log.ipAddress}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => handleDeleteClick(e, log)}
                        disabled={actionId === log.id}
                        className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition text-xs font-semibold cursor-pointer disabled:opacity-50"
                        title="Supprimer ce log"
                      >
                        {actionId === log.id ? "..." : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modale de Confirmation de Suppression */}
      {logToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Confirmer la suppression</h3>
            <p className="text-xs text-slate-400">
              Êtes-vous sûr de vouloir supprimer le journal d'audit <strong className="text-white font-mono">#{logToDelete.id} ({logToDelete.action})</strong> ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setLogToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void executeDelete(logToDelete)}
                disabled={actionId === logToDelete.id}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-500 transition disabled:opacity-50 cursor-pointer"
              >
                {actionId === logToDelete.id ? "Suppression..." : "Confirmer la suppression"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de détails du log */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-950/40">
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${
                    selectedLog.status === "SUCCESS"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {selectedLog.status}
                </span>
                <h3 className="text-lg font-bold text-white font-mono">
                  {selectedLog.action}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-300">
              <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-semibold">
                    Horodatage
                  </span>
                  <span className="font-mono text-slate-200">
                    {selectedLog.timestamp}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-semibold">
                    Adresse IP
                  </span>
                  <span className="font-mono text-slate-200">
                    {selectedLog.ipAddress}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/5">
                  <span className="text-xs text-slate-500 block uppercase font-semibold">
                    Acteur / Origine
                  </span>
                  <span className="text-slate-200 font-medium">
                    {selectedLog.actor}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 block uppercase font-semibold mb-1">
                  Détails complets de l'événement
                </span>
                <div className="bg-slate-950 p-4 rounded-xl border border-white/10 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedLog.details}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-white/10 bg-slate-950/40">
              <button
                onClick={(e) => {
                  setSelectedLog(null);
                  setLogToDelete(selectedLog);
                }}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-semibold transition text-xs cursor-pointer"
              >
                Supprimer ce log
              </button>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}