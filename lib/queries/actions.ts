"use server";

import { error } from "console";
import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { AdminComplaintNotification } from "@/components/emails/AdminComplaintNotification";
import { TeamIntroduction } from "@/components/emails/TeamIntroduction";
import { TeamAssignmentNotification } from "@/components/emails/TeamAssignmentNotification";
import { ReporterAssignmentNotification } from "@/components/emails/ReporterAssignmentNotification";
import { ReporterResolutionNotification } from "@/components/emails/ReporterResolutionNotification";
import { ReporterSubmissionNotification } from "@/components/emails/ReporterSubmissionNotification";
import { ADMIN_EMAIL, SENDER_EMAIL } from "../constants";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function fetchFaultReports() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("fault_reports").select();

    console.log(data);

    return data;
  } catch (error) {
    throw new Error("Failed to fetch fault reports");
  }
}

export async function addReport({ reportData }: { reportData: Report }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("fault_reports")
      .insert({
        reporter_name: reportData.reporterName,
        phone_number: reportData.phoneNumber,
        email: reportData.email,
        location: reportData.location,
        fault_type: reportData.faultType,
        description: reportData.description,
        severity: reportData.severity,
      })
      .select()
      .single();

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    const reportId = data.id;

    try {
      // Email to Admin
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: ADMIN_EMAIL,
        subject: "New Fault Report Submitted",
        react: AdminComplaintNotification({
          reporterName: reportData.reporterName,
          faultType: reportData.faultType,
          location: reportData.location,
          description: reportData.description,
          severity: reportData.severity,
          reportId: reportId,
        }) as React.ReactElement,
      });

      // Email to Reporter
      if (reportData.email) {
        await resend.emails.send({
          from: SENDER_EMAIL,
          to: reportData.email,
          subject: "Fault Report Submitted Successfully",
          react: ReporterSubmissionNotification({
            reporterName: reportData.reporterName,
            faultType: reportData.faultType,
            reportId: reportId,
          }) as React.ReactElement,
        });
      }
    } catch (emailError) {
      console.error("Failed to send notification emails:", emailError);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to submit report");
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
      throw new Error(error.message);
    }

    // Send email to Team
    try {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: reportData.email,
        subject: "Welcome to PowerGrid Fault Reporting System",
        react: TeamIntroduction({
          teamName: reportData.name,
          specialty: reportData.specialty,
        }) as React.ReactElement,
      });
    } catch (emailError) {
      console.error("Failed to send team email:", emailError);
    }
  } catch (err) {
    console.error(err);
    throw new Error("Failed to add team");
  }
}

/* export async function delegateStaffToReport({
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
} */

export async function fetchReportTeams() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("report_team").select();

    console.log(data);

    return data;
  } catch (error) {
    throw new Error("Failed to fetch fault reports");
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

    revalidatePath("/admin");

    if (error) {
      console.error("Error delegating staff:", error);
      return { success: false, error: error.message };
    }

    // Fetch Report & Team Details to send emails
    try {
      const { data: report } = await supabase
        .from("fault_reports")
        .select("*")
        .eq("id", reportId)
        .single();
      const { data: team } = await supabase
        .from("report_team")
        .select("*")
        .eq("name", delegatedTo)
        .single();

      if (report && team) {
        // Email to Team
        await resend.emails.send({
          from: SENDER_EMAIL,
          to: team.email,
          subject: `New Fault Assignment: ${report.fault_type}`,
          react: TeamAssignmentNotification({
            teamName: team.name,
            faultType: report.fault_type,
            location: report.location,
            description: report.description,
            priority: report.severity,
            reportId: report.id,
            reporterPhone: report.phone_number,
          }) as React.ReactElement,
        });

        // Email to Reporter
        if (report.email) {
          await resend.emails.send({
            from: SENDER_EMAIL,
            to: report.email,
            subject: "Update on your Fault Report",
            react: ReporterAssignmentNotification({
              reporterName: report.reporter_name,
              faultType: report.fault_type,
              teamName: team.name,
            }) as React.ReactElement,
          });
        }
      }
    } catch (emailError) {
      console.error("Failed to send assignment emails:", emailError);
    }

    return { success: true };
  } catch (error) {
    console.error("Exception in delegateStaffToReport:", error);
    return { success: false, error: "Failed to delegate staff" };
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

    revalidatePath("/admin");

    if (error) {
      console.error("Error confirming resolution:", error);
      return { success: false, error: error.message };
    }

    // Fetch Report details to send email
    try {
      const { data: report } = await supabase
        .from("fault_reports")
        .select("*")
        .eq("id", reportId)
        .single();
      if (report && report.email) {
        await resend.emails.send({
          from: SENDER_EMAIL,
          to: report.email,
          subject: "Fault Report Resolved",
          react: ReporterResolutionNotification({
            reporterName: report.reporter_name,
            faultType: report.fault_type,
          }) as React.ReactElement,
        });
      }
    } catch (emailError) {
      console.error("Failed to send resolution email:", emailError);
    }

    return { success: true };
  } catch (error) {
    console.error("Exception in confirmResolutionOfReport:", error);
    return { success: false, error: "Failed to confirm resolution" };
  }
}

export async function fetchComplaintById(complaintId: string) {
  const supabase = await createClient();

  try {
    const { data: complaint, error: complaintError } = await supabase
      .from("fault_reports")
      .select("*")
      .eq("id", complaintId)
      .single();

    if (complaintError) {
      console.error("Error fetching complaint:", complaintError);
      return { complaint: null, team: null, error: "Complaint ID not found." };
    }

    let team = null;
    if (complaint.delegated_to) {
      const { data: teamData, error: teamError } = await supabase
        .from("report_team")
        .select("*")
        .eq("name", complaint.delegated_to)
        .single();

      if (!teamError) {
        team = teamData;
      }
    }

    return { complaint, team, error: null };
  } catch (err) {
    console.error("Exception in fetchComplaintById:", err);
    return {
      complaint: null,
      team: null,
      error: "An unexpected error occurred.",
    };
  }
}
