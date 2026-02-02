interface FaultReport {
  id: string;
  reporter_name: string;
  email: string;
  phone_number: string;
  location: string;
  fault_type: string;
  description: string;
  severity: string;
  timestamp: string;
  status: "pending" | "delegated" | "resolved";
  delegated_to: string | null;
  delegated_at: string | null;
  resolved_at: string | null;
}

interface User {
  email: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  specialty: string;
  email: string;
  description: string;
  createdAt: string;
}
