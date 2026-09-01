import { useState } from "react";
import type { User } from "../../types/user";

interface UsersParamsTabProps {
  users: User[];
  usersLoading: boolean;
  usersError: any;
  actionLoading: boolean;
  formatRole: (role: string) => string;
  handleOpenCreate: () => void;
  handleOpenEdit: (user: User) => void;
  setUserToDeleteId: (id: number | null) => void;
  
  // États de la modale d'ajout/édition
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editingUser: User | null;
  email: string;
  setEmail: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  handleSubmitUser: (e: React.SyntheticEvent) => void;

  // États de la suppression
  userToDeleteId: number | null;
  confirmDeleteUser: () => void;
}

export default function UsersParamsTab({
  users,
  usersLoading,
  usersError,
  actionLoading,
  formatRole,
  handleOpenCreate,
  handleOpenEdit,
  setUserToDeleteId,
  isModalOpen,
  setIsModalOpen,
  editingUser,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  department,
  setDepartment,
  role,
  setRole,
  password,
  setPassword,
  handleSubmitUser,
  userToDeleteId,
  confirmDeleteUser,
}: UsersParamsTabProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mt-8 rounded-2xl border border-white/5 bg-slate-900/70 p-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <p className="text-sm font-semibold text-white">Membres de l'équipe</p>
          <p className="mt-0.5 text-xs text-slate-500">{users.length} utilisateur(s) enregistré(s)</p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="cursor-pointer rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          + Ajouter un utilisateur
        </button>
      </div>

      {usersLoading ? (
        <div className="mt-6 space-y-3">
          <div className="h-14 animate-pulse rounded-xl bg-white/5" />
          <div className="h-14 animate-pulse rounded-xl bg-white/5" />
        </div>
      ) : usersError ? (
        <div className="mt-6 rounded-xl border border-red-400/10 bg-red-400/3 p-4 text-sm text-red-300">
          Impossible de charger les utilisateurs.
        </div>
      ) : users.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/5 bg-white/2 px-4 py-8 text-center text-slate-400">
          Aucun utilisateur trouvé.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-150 border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Nom</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Email</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Service</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Rôle</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.idUser} className="border-b border-white/5 last:border-b-0 transition hover:bg-white/2">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-200">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-400">{u.email}</td>
                  <td className="px-4 py-4 text-sm text-slate-300">
                    {u.department || <span className="text-slate-600 italic">Aucun</span>}
                  </td>
                  <td className="px-4 py-4 text-sm text-cyan-300">{formatRole(u.role)}</td>
                  <td className="px-4 py-4 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(u)}
                      className="cursor-pointer text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserToDeleteId(u.idUser)}
                      className="cursor-pointer text-xs font-semibold text-rose-400 hover:text-rose-300"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal d'ajout / modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <p className="text-lg font-bold text-white">
              {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </p>

            <form onSubmit={handleSubmitUser} className="mt-6 space-y-4">
              {!editingUser && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nouvel@utilisateur.com"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Prénom</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Nom</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Service / Département</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Ex: Achats, Logistique..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Rôle</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="USER">Utilisateur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Mot de passe initial</label>
                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Définir un mot de passe"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 pr-10 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="cursor-pointer rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
                >
                  {actionLoading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {userToDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-center">
            <p className="text-base font-bold text-white">Confirmer la suppression</p>
            <p className="mt-2 text-xs text-slate-400">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setUserToDeleteId(null)}
                className="cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={confirmDeleteUser}
                className="cursor-pointer rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-400 disabled:opacity-50"
              >
                {actionLoading ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}