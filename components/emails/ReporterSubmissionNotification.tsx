import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface ReporterSubmissionNotificationProps {
  reporterName: string;
  faultType: string;
  reportId: string;
}

export const ReporterSubmissionNotification = ({
  reporterName,
  faultType,
  reportId,
}: ReporterSubmissionNotificationProps) => {
  const trackingUrl = `https://fault-reporting-system-prince-213.vercel.app/track`; // Replace with actual URL or use a constant

  return (
    <Html>
      <Head />
      <Preview>Fault Report Submitted: {faultType}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-10 max-w-2xl rounded p-6 border border-gray-200 shadow-sm">
            <Heading className="text-2xl font-bold text-gray-800 text-center">
              Fault Report Submitted
            </Heading>
            <Text className="text-gray-600 mt-4">
              Hello <strong>{reporterName}</strong>,
            </Text>
            <Text className="text-gray-600">
              Your report for <strong>{faultType}</strong> has been successfully
              submitted and is being processed by our team.
            </Text>

            <Section className="my-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <Text className="text-sm font-semibold text-blue-800 uppercase mb-2">
                Your Complaint ID
              </Text>
              <Text className="text-2xl font-mono font-bold text-blue-700 tracking-wider">
                {reportId}
              </Text>
              <Hr className="my-4 border-blue-100" />
              <Text className="text-gray-700 font-medium">
                How to track your report:
              </Text>
              <Text className="text-gray-600 text-sm mt-2">
                1. Go to the tracking page.
                <br />
                2. Paste your ID: <strong>{reportId}</strong>
                <br />
                3. Click "Track" to see the latest updates.
              </Text>
              <Section className="mt-6 text-center">
                <Link
                  href={trackingUrl}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold no-underline inline-block"
                >
                  Go to Tracking Page
                </Link>
              </Section>
            </Section>

            <Text className="text-gray-600">
              We will notify you via email as soon as a team is assigned to your
              report or if there are any updates.
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-center text-gray-400">
              PowerGrid Fault Reporting System • This is an automated
              notification.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ReporterSubmissionNotification;
