import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { render } from "@react-email/render";
import { Hospital } from "lucide-react";

interface GithubAccessTokenEmailProps {
  name?: string;
  email?: string;
  message?: string;
}

export const EmailTemplate = ({
  name,
  email,
  message,
}: GithubAccessTokenEmailProps) => (
  <Html>
    <Head />
    <Preview>
      A new notification in EEDC Fault Reporting System {name || ""}{" "}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <div className=" text-4xl text-blue-500 flex items-center space-x-2">
          <Hospital size={50} color="blue" />
          <h1>EEDC Fault Report</h1>
        </div>

        <Text style={title}>
          <strong>@{email}</strong>
          account.
        </Text>

        <Section style={section}>
          <Text style={text}>Greetings!</Text>
          <Text style={text}>{message}</Text>
          {/* 
          <Button style={button}>View your token</Button> */}
          <Link href="http://localhost:3000/">Go to Website</Link>
        </Section>

        <Text style={footer}>EEDC Fault Reporting System &copy;</Text>
      </Container>
    </Body>
  </Html>
);

export default EmailTemplate;

export const emailHTML = async ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) =>
  await render(<EmailTemplate name={name} email={email} message={message} />);

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const title = {
  fontSize: "24px",
  lineHeight: 1.25,
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

/* const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px"
}; */

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
};
