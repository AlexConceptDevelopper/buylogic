import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/user.api";
import useAsync from "../hooks/useAsync";
import type { User, UserCreate, UserUpdate } from "../types/user";

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");

  const { loading, error, execute } = useAsync<User[]>();
  const { loading: actionLoading, execute: executeAction } = useAsync<any>();

  useEffect(() => {
    const loadUsers = async () => {
      const data = await execute(() => getUsers());
      if (data) {
        setUsers(data);
      }
    };
    loadUsers();
  }, [execute]);

  // Fonction pour afficher le rôle en français
  const formatRole = (roleValue: string) => {
    switch (roleValue?.toUpperCase()) {
      case "OWNER":
      case "ADMIN":
        return "Administrateur";
      case "USER":
      default:
        return "Utilisateur";
    }
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setEmail("");
    setFirstName("");
    setLastName("");
    setRole("USER");
    setPassword("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEmail(user.email);
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setRole(user.role ?? "USER");
    setPassword("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      const updateData: UserUpdate = { firstName, lastName, role };
      const updated = await executeAction(() => updateUser(editingUser.idAppUser, updateData));
      if (updated) {
        setUsers((prev) =>
          prev.map((u) => (u.idAppUser === editingUser.idAppUser ? { ...u, ...updateData } : u))
        );
        setIsModalOpen(false);
      }
    } else {
      const currentCompanyId = users[0]?.idCompany ?? 1; 
      const createData: UserCreate = {
        idCompany: currentCompanyId,
        email,
        password,
        firstName,
        lastName,
        role,
      };
      const created = await executeAction(() => createUser(createData));
      if (created) {
        setUsers((prev) => [...prev, created]);
        setIsModalOpen(false);
      }
    }
  };

  const handleDelete = async (idAppUser: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    const res = await executeAction(() => deleteUser(idAppUser));
    if (res !== null) {
      setUsers((prev) => prev.filter((u) => u.idAppUser !== idAppUser));
    }
  };

  return (
    <div className="min-h-full bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Paramètres
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Gestion des utilisateurs
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Gérez les accès et les rôles des membres de votre entreprise.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="cursor-pointer rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Ajouter un utilisateur
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-white/5 bg-slate-900/70 p-6">
          <div className="border-b border-white/5 pb-4">
            <p className="text-sm font-semibold text-white">Membres de l'équipe</p>
            <p className="mt-0.5 text-xs text-slate-500">{users.length} utilisateur(s) enregistré(s)</p>
          </div>

          {loading ? (
            <div className="mt-6 space-y-3">
              <div className="h-14 animate-pulse rounded-xl bg-white/5" />
              <div className="h-14 animate-pulse rounded-xl bg-white/5" />
            </div>
          ) : error ? (
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
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Rôle</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.idAppUser} className="border-b border-white/5 last:border-b-0 transition hover:bg-white/2">
                      <td className="px-4 py-4 text-sm font-semibold text-slate-200">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400">{u.email}</td>
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
                          onClick={() => handleDelete(u.idAppUser)}
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
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
              <p className="text-lg font-bold text-white">
                {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {!editingUser && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Définir un mot de passe"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    />
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
      </div>
    </div>
  );
}