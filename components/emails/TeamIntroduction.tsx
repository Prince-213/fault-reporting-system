
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

interface TeamIntroductionProps {
  teamName: string;
  specialty: string;
}

export const TeamIntroduction = ({
  teamName,
  specialty,
}: TeamIntroductionProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the PowerGrid Team</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-10 max-w-2xl rounded p-4 border border-gray-200">
            <Heading className="text-2xl font-bold text-gray-800 text-center">
              Welcome, {teamName}!
            </Heading>
            <Text className="text-gray-600 text-center text-lg mt-2">
              You identify as a specialized team for <strong>{specialty}</strong>.
            </Text>
            
            <Section className="mt-6">
              <Text className="text-gray-700">
                Your team account has been successfully created in the Fault Reporting System.
                You will receive notifications here when new faults matching your specialty are assigned to you.
              </Text>
              <Text className="text-gray-700 mt-4">
                Please ensure you monitor this inbox for urgent fault assignments.
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

export default TeamIntroduction;
