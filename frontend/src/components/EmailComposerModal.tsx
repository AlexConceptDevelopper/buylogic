import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/user.api";

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (emailData: { to: string; cc: string[]; subject: string; body: string }) => Promise<void>;
  supplierEmail?: string;
  supplierName?: string;
  orderNumber?: string;
  totalAmount?: number;
  companyName?: string;
  userFirstName?: string;
  userLastName?: string;
  userDepartment?: string;
  loading: boolean;
}

export function EmailComposerModal({
  isOpen,
  onClose,
  onSend,
  supplierEmail = "",
  supplierName = "",
  orderNumber = "",
  totalAmount = 0,
  companyName = "",
  userFirstName = "",
  userLastName = "",
  userDepartment = "",
  loading,
}: EmailComposerModalProps) {
  const [to, setTo] = useState(supplierEmail);
  const [ccInput, setCcInput] = useState("");
  const [ccList, setCcList] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [firstName, setFirstName] = useState(userFirstName);
  const [lastName, setLastName] = useState(userLastName);
  const [department, setDepartment] = useState(userDepartment);

  useEffect(() => {
    if (isOpen) {
      setTo(supplierEmail);
      setSubject(`Bon de commande - ${orderNumber}`);

      if (!userFirstName && !userLastName) {
        getCurrentUser()
          .then((user) => {
            if (user) {
              setFirstName(user.firstName || "");
              setLastName(user.lastName || "");
              setDepartment(user.department || "");
            }
          })
          .catch((err) => {
            console.error("Impossible de récupérer l'utilisateur connecté", err);
          });
      } else {
        setFirstName(userFirstName);
        setLastName(userLastName);
        setDepartment(userDepartment);
      }
    }
  }, [isOpen, supplierEmail, orderNumber, userFirstName, userLastName, userDepartment]);

  useEffect(() => {
    if (!isOpen) return;

    const userNameFormatted = [firstName, lastName].filter(Boolean).join(" ");
    const formattedAmount = totalAmount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

    setBody(
      `Bonjour ${supplierName || "Madame, Monsieur"},

Veuillez trouver ci-joint notre bon de commande n° ${orderNumber} d'un montant total de ${formattedAmount} HT.

Merci de nous retourner par retour de mail l'Accusé de Réception de Commande (ARC) ainsi que la date prévisionnelle de livraison.

Cordialement,
${userNameFormatted}
${department ? `Département : ${department}` : ""}
${companyName ? `Société : ${companyName}` : ""}`
    );
  }, [isOpen, firstName, lastName, department, supplierName, orderNumber, totalAmount, companyName]);

  const handleAddCc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && ccInput.trim()) {
      e.preventDefault();
      if (!ccList.includes(ccInput.trim())) {
        setCcList([...ccList, ccInput.trim()]);
      }
      setCcInput("");
    }
  };

  const removeCc = (emailToRemove: string) => {
    setCcList(ccList.filter((email) => email !== emailToRemove));
  };

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSend({
      to,
      cc: ccList,
      subject,
      body,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-base font-semibold text-slate-800">
            ✉️ Envoyer le bon de commande par e-mail
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSendSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <label className="w-20 text-xs font-medium text-slate-500">À :</label>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-800 focus:outline-none"
              placeholder="fournisseur@email.com"
            />
          </div>

          <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
            <label className="w-20 pt-1 text-xs font-medium text-slate-500">CC :</label>
            <div className="flex-1 flex flex-wrap items-center gap-1.5">
              {ccList.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeCc(email)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="email"
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                onKeyDown={handleAddCc}
                placeholder={ccList.length === 0 ? "Ajouter un destinataire en CC (Entrée)..." : "Ajouter..."}
                className="flex-1 min-w-37.5 bg-transparent text-sm text-slate-800 focus:outline-none py-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <label className="w-20 text-xs font-medium text-slate-500">Objet :</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-800 focus:outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <label className="w-20 text-xs font-medium text-slate-500">Pièce jointe :</label>
            <div className="inline-flex items-center gap-2 rounded-lg bg-cyan-50 border border-cyan-100 px-3 py-1.5 text-xs text-cyan-800">
              <span>📎 Bon_de_commande_{orderNumber}.pdf</span>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-500 mb-2">Message :</label>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-cyan-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-cyan-700 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? "Envoi en cours..." : "🚀 Envoyer l'e-mail"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}