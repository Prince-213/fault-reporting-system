
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
} from "@react-email/components";
import * as React from "react";

interface ReporterAssignmentNotificationProps {
  reporterName: string;
  faultType: string;
  teamName: string;
}

export const ReporterAssignmentNotification = ({
  reporterName,
  faultType,
  teamName,
}: ReporterAssignmentNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Update on your report: {faultType}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-10 max-w-2xl rounded p-4 border border-gray-200">
            <Heading className="text-2xl font-bold text-gray-800 text-center">
              Good News, {reporterName}!
            </Heading>
            <Text className="text-gray-600 text-center mt-2">
              We have assigned a team to your reported fault.
            </Text>
            
            <Section className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
               <Text className="text-lg text-gray-900 text-center">
                 Team <strong>{teamName}</strong> has been assigned to resolve the issue: <em>{faultType}</em>.
               </Text>
               <Text className="text-gray-700 text-center mt-2">
                 They will be arriving shortly to address the problem. Thank you for your patience.
               </Text>
            </Section>

            <Hr className="my-6 border-gray-200" />
            
            <Text className="text-xs text-center text-gray-500">
             PowerGrid Fault Reporting System
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ReporterAssignmentNotification;
