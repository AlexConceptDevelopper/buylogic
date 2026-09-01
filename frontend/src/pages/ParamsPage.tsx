import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/user.api";
import { getCompanies, updateCompany } from "../api/company.api";
import { getCompanyConfiguration } from "../api/companyConfiguration.api";
import useAsync from "../hooks/useAsync";
import type { User, UserCreate, UserUpdate } from "../types/user";
import type { Company } from "../types/company";
import type { CompanyConfiguration } from "../types/companyConfiguration";
import CompanyParamsTab from "../components/params/CompagnyParamTab";
import UsersParamsTab from "../components/params/UsersParamsTab";

export default function ParamsPage() {
  const [activeTab, setActiveTab] = useState<"company" | "users">("company");

  // --- États Entreprise & Configuration ---
  const [company, setCompany] = useState<Company | null>(null);
  const [configuration, setConfiguration] = useState<CompanyConfiguration | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- États Utilisateurs ---
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");

  const { loading: usersLoading, error: usersError, execute: executeUsers } = useAsync<User[]>();
  const { execute: executeCompany } = useAsync<any>();
  const { execute: executeConfig } = useAsync<CompanyConfiguration>();
  const { loading: actionLoading, execute: executeAction } = useAsync<any>();

  useEffect(() => {
    const loadData = async () => {
      const dataUsers = await executeUsers(() => getUsers());
      if (dataUsers) setUsers(dataUsers);

      const dataCompanies = await executeCompany(() => getCompanies());
      if (dataCompanies && dataCompanies.length > 0) {
        setCompany(dataCompanies[0]);
      }

      const dataConfig = await executeConfig(() => getCompanyConfiguration());
      if (dataConfig) {
        setConfiguration(dataConfig);
      }
    };
    void loadData();
  }, [executeUsers, executeCompany, executeConfig]);

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
    setDepartment("");
    setRole("USER");
    setPassword("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEmail(user.email);
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setDepartment(user.department ?? "");
    setRole(user.role ?? "USER");
    setPassword("");
    setIsModalOpen(true);
  };

 const handleSubmitUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (editingUser) {
      // On retire "role" d'ici pour ne pas perturber le backend lors d'une simple modif
      const updateData: UserUpdate = { firstName, lastName, department };
      const updated = await executeAction(() => updateUser(editingUser.idUser, updateData));
      if (updated) {
        setUsers((prev) =>
          prev.map((u) => (u.idUser === editingUser.idUser ? { ...u, ...updateData } : u))
        );
        setIsModalOpen(false);
      }
    } else {
      const currentCompanyId = users[0]?.idCompany ?? company?.idCompany ?? 1;
      const createData: UserCreate = {
        idCompany: currentCompanyId,
        email,
        password,
        firstName,
        lastName,
        department,
        role, // Le rôle reste utile uniquement à la création si besoin
      };
      const created = await executeAction(() => createUser(createData));
      if (created) {
        setUsers((prev) => [...prev, created]);
        setIsModalOpen(false);
      }
    }
  };

  const confirmDeleteUser = async () => {
    if (userToDeleteId === null) return;

    const res = await executeAction(() => deleteUser(userToDeleteId));
    if (res !== null) {
      setUsers((prev) => prev.filter((u) => u.idUser !== userToDeleteId));
    }
    setUserToDeleteId(null);
  };

  const handleSaveCompany = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!company) return;

    const updated = await executeAction(() =>
      updateCompany(company.idCompany, {
        name: company.name,
        email: company.email,
        phone: company.phone,
        siret: company.siret,
        address: company.address,
        receptionHours: company.receptionHours,
        logoUrl: company.logoUrl,
        active: company.active,
      })
    );

    if (updated) {
      setSuccessMessage("Paramètres de l'entreprise enregistrés avec succès !");
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-full bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* En-tête */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Configuration
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Paramètres de l'entreprise
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Gérez les informations légales, logistiques et les membres de votre équipe.
            </p>
          </div>
        </div>

        {/* Message de succès global */}
        {successMessage && activeTab === "company" && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-200 font-bold">
              &times;
            </button>
          </div>
        )}

        {/* Onglets de navigation interne */}
        <div className="mt-8 flex border-b border-white/5 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("company")}
            className={`pb-4 text-sm font-semibold transition border-b-2 cursor-pointer ${
              activeTab === "company"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Informations générales & Logistiques
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`pb-4 text-sm font-semibold transition border-b-2 cursor-pointer ${
              activeTab === "users"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Gestion des utilisateurs ({users.length})
          </button>
        </div>

        {/* Rendu conditionnel des onglets */}
        {activeTab === "company" && (
          <CompanyParamsTab
            company={company}
            setCompany={setCompany}
            configuration={configuration}
            actionLoading={actionLoading}
            onSaveCompany={handleSaveCompany}
            successMessage={successMessage}
          />
        )}

        {activeTab === "users" && (
          <UsersParamsTab
            users={users}
            usersLoading={usersLoading}
            usersError={usersError}
            actionLoading={actionLoading}
            formatRole={formatRole}
            handleOpenCreate={handleOpenCreate}
            handleOpenEdit={handleOpenEdit}
            setUserToDeleteId={setUserToDeleteId}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            editingUser={editingUser}
            email={email}
            setEmail={setEmail}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            department={department}        
            setDepartment={setDepartment}
            role={role}
            setRole={setRole}
            password={password}
            setPassword={setPassword}
            handleSubmitUser={handleSubmitUser}
            userToDeleteId={userToDeleteId}
            confirmDeleteUser={confirmDeleteUser}
          />
        )}
      </div>
    </div>
  );
}