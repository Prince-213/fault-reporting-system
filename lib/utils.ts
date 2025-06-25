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
