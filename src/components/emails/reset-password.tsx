import * as React from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  username: string;
  linkUrl: string;
}

export const PasswordResetEmail = ({ username, linkUrl }: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Streamwise password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              width="200"
              src="https://utfs.io/f/74f7331a-2cfa-4791-a750-8b7f5a54a117-qkt02w.svg"
            />
          </Section>
          <Section style={content}>
            <Text style={text}>Hi {username},</Text>
            <Text style={text}>
              Someone recently requested a password change for your Streamwise account. If this was
              you, you can set a new password here:
            </Text>
            <Button style={button} href={linkUrl}>
              Reset password
            </Button>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t request this, just
              ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email to anyone.
            </Text>
            <Text style={paragraph}>
              Thanks,
              <br />
              Streamwise Support Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Text style={{ textAlign: "center", color: "#706a7b" }}>
            © 2023 Streamwise, All Rights Reserved <br />
          </Text>
        </Section>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  width: "580px",
  margin: "30px auto",
  backgroundColor: "#ffffff",
};

const footer = {
  width: "580px",
  margin: "0 auto",
};

const content = {
  padding: "5px 50px 10px 60px",
};

const logo = {
  display: "flex",
  justifyContent: "center",
  alingItems: "center",
  padding: 30,
  backgroundColor: "#007ee6",
};

const text = {
  fontSize: "16px",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};
