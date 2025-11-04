import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = (): string => {
  const siteUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://safepass.nard.ca/";

  return siteUrl;
};

export async function sendEmail(name: string, message: string) {
  const email = "econuigbo@gmail.com";

  try {
    const response = await fetch(`${getBaseUrl()}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error sending email:", errorDetails.message);
      return false;
    }

    console.log("Email sent successfully!");
    console.log(response);
    return true;
  } catch (error) {
    console.error("There was a problem sending the email:", error);
    return false;
  }
}

export async function sendUpdateEmail(name: string, email: string, message: string) {
 

  try {
    const response = await fetch(`${getBaseUrl()}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error sending email:", errorDetails.message);
      return false;
    }

    console.log("Email sent successfully!");
    console.log(response);
    return true;
  } catch (error) {
    console.error("There was a problem sending the email:", error);
    return false;
  }
}

export const powerProblems = [
  { issue: "Power Outage", severity: "high" },
  { issue: "Transformer Fault", severity: "high" },
  { issue: "Cable Damage", severity: "medium" },
  { issue: "Voltage Fluctuation", severity: "medium" },
  { issue: "Street Light Issue", severity: "low" },
  { issue: "Overloaded Transformer", severity: "high" },
  { issue: "Frequent Load Shedding", severity: "medium" },
  { issue: "Meter Tampering", severity: "medium" },
  { issue: "Illegal Connections", severity: "high" },
  { issue: "Fuse Damage", severity: "low" },
  { issue: "Pole Collapse", severity: "high" },
  { issue: "Bushfire/Tree Falling on Cables", severity: "high" },
  { issue: "Feeder Trip", severity: "medium" },
  { issue: "Burnt Service Wire", severity: "medium" },
  { issue: "Underground Cable Fault", severity: "high" },
  { issue: "Loose Neutral Wire", severity: "medium" },
  { issue: "Lightning/Storm Damage", severity: "high" },
  { issue: "Old/Worn-out Infrastructure", severity: "medium" },
  { issue: "Generator Backfeed Accident", severity: "high" },
  { issue: "Other", severity: "low" },
];
