import { sendEmail } from "@/lib/utils";

export class ReminderService {
  private static instance: ReminderService;
  private interval: NodeJS.Timeout | null = null;
  private static readonly SUPER_ADMIN_EMAIL = "princolosh@gmail.com";
  private static readonly ADMIN_EMAIL = "princolosh@gmail.com";

  private constructor() {
    if (typeof window === "undefined") {
      return;
    }
    this.startReminderCheck();
  }

  public static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService();
    }
    return ReminderService.instance;
  }

  private startReminderCheck() {
    if (typeof window !== "undefined") {
      this.interval = setInterval(() => {
        this.checkForAlerts();
      }, 2000); // Check every 2 seconds

      // Cleanup on window unload
      window.addEventListener("beforeunload", () => {
        if (this.interval) {
          clearInterval(this.interval);
        }
      });
    }
  }

  private async checkForAlerts() {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const savedReports = JSON.parse(
          localStorage.getItem("faultReports") || "[]"
        );
        const now = new Date();

        savedReports.forEach((report: any) => {
          const reportTime = new Date(report.timestamp);
          const timeSinceReport =
            (now.getTime() - reportTime.getTime()) / (1000 * 60); // in minutes

          // Check for delegation overdue (more than 1 minute without delegation)
          if (
            report.status === "pending" &&
            timeSinceReport > 1 &&
            !report.delegatedWarning
          ) {
            const alertMessage = `ALERT: Report ${report.id} at ${report.location} has not been delegated for ${Math.floor(timeSinceReport)} minutes!`;
            console.log(`🚨 DELEGATION OVERDUE: ${alertMessage}`);

            // Send email to super admin if not already warned
            if (!report.delegatedWarning) {
              const emailSubject = `Delegation Overdue: Report ${report.id}`;
              const emailBody = `
                Report ID: ${report.id}\n
                Location: ${report.location}\n
                This report has not been delegated for ${Math.floor(timeSinceReport)} minutes.\n
                Please assign an admin to handle this report as soon as possible.
              `;

              sendEmail("Super Admin", emailBody).then(() => {
                // Update the report's delegatedWarning flag
                const updatedReports = savedReports.map((r) =>
                  r.id === report.id ? { ...r, delegatedWarning: true } : r
                );
                localStorage.setItem(
                  "faultReports",
                  JSON.stringify(updatedReports)
                );
              });
            }
          }

          // Check for resolution overdue (delegated but not resolved)
          if (
            report.status === "delegated" &&
            report.delegatedAt &&
            !report.resolutionWarning
          ) {
            const delegationTime = new Date(report.delegatedAt);
            const timeSinceDelegation =
              (now.getTime() - delegationTime.getTime()) / (1000 * 60); // in minutes

            // Alert if delegated for more than 5 minutes without resolution
            if (timeSinceDelegation > 2) {
              const alertMessage = `ALERT: Report ${report.id} delegated to ${report.delegatedTo} has not been resolved for ${Math.floor(timeSinceDelegation)} minutes!`;
              console.log(`🚨 RESOLUTION OVERDUE: ${alertMessage}`);

              // Send email to admin if not already warned
              if (!report.resolutionWarning) {
                const emailSubject = `Resolution Overdue: Report ${report.id}`;
                const emailBody = `
                  Report ID: ${report.id}\n
                  Location: ${report.location}\n
                  This report has not been resolved for ${Math.floor(timeSinceDelegation)} minutes.\n
                  Please confirm the resolution status of this report.
                `;

                sendEmail("Admin", emailBody).then(() => {
                  // Update the report's resolutionWarning flag
                  const updatedReports = savedReports.map((r) =>
                    r.id === report.id ? { ...r, resolutionWarning: true } : r
                  );
                  localStorage.setItem(
                    "faultReports",
                    JSON.stringify(updatedReports)
                  );
                });
              }
            }
          }
        });
      } catch (error) {
        console.error("Error checking alerts:", error);
      }
    }
  }

  public stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
