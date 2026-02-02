
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

interface ReporterResolutionNotificationProps {
  reporterName: string;
  faultType: string;
}

export const ReporterResolutionNotification = ({
  reporterName,
  faultType,
}: ReporterResolutionNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Fault Resolved: {faultType}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-10 max-w-2xl rounded p-4 border border-gray-200">
            <Heading className="text-2xl font-bold text-green-600 text-center">
              Issue Resolved!
            </Heading>
            <Text className="text-gray-600 text-center mt-2">
              Hello {reporterName}, we are pleased to inform you that the fault has been fixed.
            </Text>
            
            <Section className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
               <Text className="text-lg text-gray-900 text-center">
                 The reported issue <strong>{faultType}</strong> has been marked as RESOLVED.
               </Text>
               <Text className="text-gray-700 text-center mt-2">
                 Thank you for helping us maintain a reliable power grid by reporting this issue.
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

export default ReporterResolutionNotification;
