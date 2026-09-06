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
  
  // Sélection multiple et pagination
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Modales et actions
  const [logToDelete, setLogToDelete] = useState<AuditLog | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    adminGetAuditLogs()
      .then((res: any) => {
        // Gère si l'API renvoie un tableau direct ou un objet paginé (ex: Spring Boot Page)
        const logsData = Array.isArray(res) ? res : res?.content || [];
        setLogs(logsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des logs d'audit :", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [filter, itemsPerPage]);

  const handleDeleteClick = (e: React.MouseEvent, log: AuditLog) => {
    e.stopPropagation();
    setLogToDelete(log);
  };

  const executeDelete = async (log: AuditLog) => {
    setActionId(log.id);
    try {
      await adminDeleteAuditLog(log.id);
      setLogs((prev) => prev.filter((l) => l.id !== log.id));
      setSelectedIds((prev) => prev.filter((id) => id !== log.id));
      if (selectedLog?.id === log.id) setSelectedLog(null);
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

  const executeBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => adminDeleteAuditLog(id)));
      setLogs((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
      if (selectedLog && selectedIds.includes(selectedLog.id)) setSelectedLog(null);
      
      setActionMessage({ 
        type: 'success', 
        text: `${selectedIds.length} journal(aux) d'audit ont été supprimés avec succès.` 
      });
      setSelectedIds([]);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression groupée :", err);
      setActionMessage({ type: 'error', text: "Impossible de supprimer certains journaux d'audit." });
      setTimeout(() => setActionMessage(null), 4000);
    } finally {
      setIsBulkDeleting(false);
      setIsBulkDeleteModalOpen(false);
    }
  };

  const filteredLogs = filter === "ALL" ? logs : logs.filter((log) => log.status === filter);

  // Pagination locale
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAllCurrentPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = currentLogs.map((l) => l.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = currentLogs.map((l) => l.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item_id) => item_id !== id));
    }
  };

  const isAllCurrentPageSelected = 
    currentLogs.length > 0 && currentLogs.every((l) => selectedIds.includes(l.id));

  return (
    <div className="space-y-6">
      {actionMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center justify-between ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-current opacity-70 hover:opacity-100 font-bold ml-4">✕</button>
        </div>
      )}

      {/* En-tête & Filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Journaux d'Audit & Sécurité</h2>
          <p className="text-xs text-slate-400 mt-1">
            Traçabilité en temps réel des actions système et tentatives d'accès critiques.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
          {["ALL", "SUCCESS", "CRITICAL"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === st ? "bg-red-500 text-slate-950 shadow-md shadow-red-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              {st === "ALL" ? "Tous" : st === "SUCCESS" ? "Succès" : "Critique"}
            </button>
          ))}
        </div>
      </div>

      {/* Barre d'actions groupées */}
      {selectedIds.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="text-xs text-red-300 font-medium">
            <strong className="text-white">{selectedIds.length}</strong> journal(aux) sélectionné(s)
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => setSelectedIds([])} className="text-xs text-slate-400 hover:text-white transition cursor-pointer">
              Tout désélectionner
            </button>
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Supprimer la sélection ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Chargement des journaux de sécurité...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">Aucun journal ne correspond à ce filtre.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAllCurrentPage}
                      className="rounded border-white/20 bg-slate-900 text-red-500 focus:ring-red-500 cursor-pointer"
                    />
                  </th>
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
                {currentLogs.map((log) => {
                  const isSelected = selectedIds.includes(log.id);
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`hover:bg-slate-900/50 transition cursor-pointer group ${isSelected ? "bg-red-500/5" : ""}`}
                    >
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(e, log.id)}
                          className="rounded border-white/20 bg-slate-900 text-red-500 focus:ring-red-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-4 font-bold text-white group-hover:text-red-400 transition">{log.action}</td>
                      <td className="p-4 text-slate-300">{log.actor}</td>
                      <td className="p-4 font-mono text-slate-400">{log.ipAddress}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 max-w-xs truncate">{log.details}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => handleDeleteClick(e, log)}
                          disabled={actionId === log.id}
                          className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition text-xs font-semibold cursor-pointer disabled:opacity-50"
                        >
                          {actionId === log.id ? "..." : "Supprimer"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredLogs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-white/10 bg-slate-900/30 gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span>Afficher</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>sur {filteredLogs.length} résultats</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition disabled:opacity-30 cursor-pointer"
              >
                Précédent
              </button>
              <span className="px-2 font-mono text-white">Page {currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition disabled:opacity-30 cursor-pointer"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modale Suppression Unique */}
      {logToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Confirmer la suppression</h3>
            <p className="text-xs text-slate-400">
              Êtes-vous sûr de vouloir supprimer le log <strong className="text-white font-mono">#{logToDelete.id}</strong> ?
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setLogToDelete(null)} className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer">Annuler</button>
              <button onClick={() => void executeDelete(logToDelete)} className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-xl hover:bg-red-500 cursor-pointer">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Suppression Groupée */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Confirmer la suppression multiple</h3>
            <p className="text-xs text-slate-400">
              Supprimer <strong className="text-white">{selectedIds.length}</strong> journaux sélectionnés ?
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setIsBulkDeleteModalOpen(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer">Annuler</button>
              <button onClick={() => void executeBulkDelete()} disabled={isBulkDeleting} className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-xl hover:bg-red-500 cursor-pointer">
                {isBulkDeleting ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de détails */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-950/40">
              <h3 className="text-lg font-bold text-white font-mono">{selectedLog.action}</h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1 rounded-lg bg-white/5 cursor-pointer">✕</button>
            </div>
            <div className="p-6 space-y-4 text-sm text-slate-300">
              <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                <div><span className="text-xs text-slate-500 block">Horodatage</span>{selectedLog.timestamp}</div>
                <div><span className="text-xs text-slate-500 block">Adresse IP</span>{selectedLog.ipAddress}</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/10 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedLog.details}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-white/10 bg-slate-950/40">
              <button onClick={() => setSelectedLog(null)} className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs cursor-pointer">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}