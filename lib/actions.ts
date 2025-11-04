"use server";

import { error } from "console";
import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

interface Report {
  reporterName: string;
  email: string;
  phoneNumber: string;
  location: string;
  faultType: string;
  description: string;
  severity: string;
}

interface Team {
  name: string;
  specialty: string;
  email: string;
}

export async function addReport({ reportData }: { reportData: Report }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("fault_reports").insert({
      reporter_name: reportData.reporterName,
      phone_number: reportData.phoneNumber,
      email: reportData.email,
      location: reportData.location,
      fault_type: reportData.faultType,
      description: reportData.description,
      severity: reportData.severity,
    });

    console.log(data);

    if (error) {
      console.log(error);
      new Error();
    }
  } catch {
    new Error();
  }
}

export async function addTeam({ reportData }: { reportData: Team }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("report_team").insert({
      name: reportData.name,
      specialty: reportData.specialty,
      email: reportData.email,
    });

    console.log(data);

    revalidatePath("/admin");

    if (error) {
      console.log(error);
      new Error();
    }
  } catch {
    new Error();
  }
}

export async function delegateStaffToReport({
  reportId,
  delegatedTo,
}: {
  reportId: string;
  delegatedTo: string;
}) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("fault_reports")
      .update({
        status: "delegated",
        delegated_to: delegatedTo,
        delegated_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    console.log("Staff delegated");

    revalidatePath("/admin");

    if (error) {
      return new Error();
    }
  } catch {
    return new Error();
  }
}

export async function confirmResolutionOfReport({
  reportId,
}: {
  reportId: string;
}) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("fault_reports")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    console.log("Report resolved");

    revalidatePath("/admin");

    if (error) {
      return new Error();
    }
  } catch {
    return new Error();
  }
}
