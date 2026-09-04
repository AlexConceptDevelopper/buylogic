import { useEffect, useState } from "react";
import { adminGetAllUsers, adminUpdateUser, adminDeleteUser, adminGetAllCompanies } from "../../api/super-admin.api";
import type { User, UserUpdate } from "../../types/user";
import type { Company } from "../../types/company";

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  const [formData, setFormData] = useState<UserUpdate>({
    firstName: "",
    lastName: "",
    department: "",
    role: "USER",
    active: true,
  });
  
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, companiesData] = await Promise.all([
          adminGetAllUsers(),
          adminGetAllCompanies()
        ]);
        if (usersData) setUsers(usersData);
        if (companiesData) setCompanies(companiesData);
      } catch (err) {
        console.error("Erreur chargement utilisateurs ou entreprises", err);
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      department: user.department || "",
      role: user.role || "USER",
      active: user.active ?? true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSaving(true);
    try {
      const updatedUser = await adminUpdateUser(selectedUser.idUser, formData);
      
      const finalUser: User = updatedUser 
        ? updatedUser 
        : { ...selectedUser, ...formData } as User;

      setUsers(users.map(u => u.idUser === selectedUser.idUser ? finalUser : u));
      setSelectedUser(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur", err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleClick = (user: User) => {
    if (user.active) {
      setUserToToggle(user);
    } else {
      void executeToggle(user);
    }
  };

  const executeToggle = async (user: User) => {
    setActionId(user.idUser);
    try {
      const newActiveState = !user.active;
      
      if (newActiveState) {
        const updated = await adminUpdateUser(user.idUser, { ...user, active: true });
        if (updated) {
          setUsers(users.map(u => u.idUser === user.idUser ? updated : u));
        }
      } else {
        await adminDeleteUser(user.idUser);
        setUsers(users.map(u => u.idUser === user.idUser ? { ...u, active: false } : u));
        if (selectedUser?.idUser === user.idUser) {
          setSelectedUser(null);
        }
      }
    } catch (err) {
      console.error("Erreur lors du changement de statut de l'utilisateur", err);
    } finally {
      setActionId(null);
      setUserToToggle(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""} ${u.email || ""}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Gestion des Utilisateurs</h2>
          <p className="text-xs text-slate-400">Vue globale des comptes enregistrés sur la plateforme.</p>
        </div>
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Chargement des données...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-8 text-center text-slate-400 text-xs">
          Aucun utilisateur trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const company = companies.find(c => c.idCompany === user.idCompany);
            return (
              <div
                key={user.idUser}
                className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between space-y-4 transition hover:border-red-500/30"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${user.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {user.active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] bg-white/5 text-slate-300 px-2 py-0.5 rounded border border-white/10 uppercase">
                      {user.role}
                    </span>
                    {user.department && (
                      <span className="text-[10px] bg-white/5 text-slate-300 px-2 py-0.5 rounded border border-white/10">
                        {user.department}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 truncate w-full">
                      🏢 {company ? company.name : (user.companyName || "Aucune entreprise")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleToggleClick(user)}
                    disabled={actionId === user.idUser}
                    className={`cursor-pointer text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition disabled:opacity-50 ${
                      user.active
                        ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                    }`}
                  >
                    {actionId === user.idUser ? "..." : user.active ? "Désactiver" : "Réactiver"}
                  </button>

                  <button
                    onClick={() => openEditModal(user)}
                    className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 transition"
                  >
                    Gérer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modale de Confirmation de Désactivation */}
      {userToToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Confirmer la désactivation</h3>
            <p className="text-xs text-slate-400">
              Êtes-vous sûr de vouloir désactiver l'utilisateur <strong className="text-white">{userToToggle.firstName} {userToToggle.lastName}</strong> ? Il ne pourra plus se connecter à la plateforme.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToToggle(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void executeToggle(userToToggle)}
                disabled={actionId === userToToggle.idUser}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-500 transition disabled:opacity-50 cursor-pointer"
              >
                {actionId === userToToggle.idUser ? "Désactivation..." : "Confirmer la désactivation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de Modification */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Modifier l'utilisateur</h3>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-white/5 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Département</label>
                  <input
                    type="text"
                    value={formData.department || ""}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Rôle</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="userActiveToggle"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded bg-slate-950 border-white/10 text-red-500 focus:ring-0"
                />
                <label htmlFor="userActiveToggle" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Utilisateur actif
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}