
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
  Button,
} from "@react-email/components";
import * as React from "react";

interface TeamAssignmentNotificationProps {
  teamName: string;
  faultType: string;
  location: string;
  description: string;
  priority: string;
  reportId: string;
  reporterPhone: string;
}

export const TeamAssignmentNotification = ({
  teamName,
  faultType,
  location,
  description,
  priority,
  reportId,
  reporterPhone
}: TeamAssignmentNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Assignment: {faultType} at {location}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-10 max-w-2xl rounded p-4 border border-gray-200">
            <Heading className="text-2xl font-bold text-gray-800 text-center">
              New Fault Assigned
            </Heading>
            <Text className="text-gray-600 text-center mt-2">
              Hello {teamName}, a new fault has been assigned to you.
            </Text>
            
            <Section className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
               <Text className="text-sm font-bold text-yellow-800 uppercase">Action Required</Text>
               <Text className="text-gray-900 mt-1">Please mobilize to the location below.</Text>
            </Section>

            <Section className="mt-6">
               <Text className="text-sm font-semibold text-gray-500 uppercase">Fault Type</Text>
               <Text className="text-lg text-gray-900 mb-4">{faultType}</Text>

               <Text className="text-sm font-semibold text-gray-500 uppercase">Location</Text>
               <Text className="text-lg text-gray-900 mb-4">{location}</Text>
               
               <Text className="text-sm font-semibold text-gray-500 uppercase">Reporter Contact</Text>
               <Text className="text-lg text-gray-900 mb-4">{reporterPhone}</Text>

               <Text className="text-sm font-semibold text-gray-500 uppercase">Description</Text>
               <Text className="text-gray-900 mb-4">{description}</Text>
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

export default TeamAssignmentNotification;
