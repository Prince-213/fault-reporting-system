
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

interface AdminComplaintNotificationProps {
  reporterName: string;
  faultType: string;
  location: string;
  description: string;
  severity: string;
  reportId?: string;
}

export const AdminComplaintNotification = ({
  reporterName,
  faultType,
  location,
  description,
  severity,
  reportId,
}: AdminComplaintNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Fault Report: {faultType}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-10 max-w-2xl rounded p-4 border border-gray-200">
            <Heading className="text-2xl font-bold text-gray-800 text-center">
              New Fault Report
            </Heading>
            <Text className="text-gray-600 text-center">
              A new fault has been reported by <strong>{reporterName}</strong>.
            </Text>
            
            <Section className="mt-6 bg-gray-50 p-4 rounded-lg">
               <Text className="text-sm font-semibold text-gray-500 uppercase">Fault Type</Text>
               <Text className="text-lg text-gray-900 mb-4">{faultType}</Text>

               <Text className="text-sm font-semibold text-gray-500 uppercase">Severity</Text>
               <Text className={`text-lg font-medium mb-4 ${
                 severity === "high" ? "text-red-600" : severity === "medium" ? "text-orange-500" : "text-green-600"
               }`}>
                 {severity.charAt(0).toUpperCase() + severity.slice(1)}
               </Text>

               <Text className="text-sm font-semibold text-gray-500 uppercase">Location</Text>
               <Text className="text-lg text-gray-900 mb-4">{location}</Text>

               <Text className="text-sm font-semibold text-gray-500 uppercase">Description</Text>
               <Text className="text-gray-900">{description}</Text>
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

export default AdminComplaintNotification;
