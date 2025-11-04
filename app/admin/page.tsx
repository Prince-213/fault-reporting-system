import React from "react";
import AdminDashboard from "./_admin-page";
import { createClient } from "@/lib/supabase/server";

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
const AdminPage = async () => {
  const supabase = await createClient();

  const { data: reports } = await supabase.from("fault_reports").select();
  const { data: team } = await supabase.from("report_team").select();


  console.log(reports);

  return (
    <div>
      <AdminDashboard reportsData={reports as FaultReport[] | null} teamData={team} />
    </div>
  );
};

export default AdminPage;
