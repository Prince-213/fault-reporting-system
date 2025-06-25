export interface FaultReport {
  id: string;
  reporterName: string;
  phoneNumber: string;
  location: string;
  faultType: string;
  description: string;
  severity: string;
  timestamp: string;
  status: 'pending' | 'delegated' | 'resolved';
  delegatedTo: string | null;
  delegatedAt: string | null;
  resolvedAt: string | null;
  delegatedWarning: boolean;
  resolutionWarning: boolean;
}
