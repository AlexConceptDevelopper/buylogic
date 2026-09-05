export interface AuditLog {
  id: number;
  timestamp: string;
  action: string;
  actor: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "CRITICAL";
  details: string;
}