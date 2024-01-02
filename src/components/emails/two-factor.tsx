import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface TwoFactorCodeEmailProps {
  validationCode: string;
}

export const TwoFactorCodeEmail = ({ validationCode }: TwoFactorCodeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              width="200"
              src="https://utfs.io/f/74f7331a-2cfa-4791-a750-8b7f5a54a117-qkt02w.svg"
            />
          </Section>
          <Section style={content}>
            <Heading style={h1}>Confirm your email address</Heading>
            <Text style={heroText}>
              Your confirmation code is below - enter it in your open browser window and we&apos;ll
              help you get signed in.
            </Text>
            <Section style={codeBox}>
              <Text style={confirmationCodeText}>{validationCode}</Text>
            </Section>
            <Text style={text}>
              If you didn&apos;t request this email, there&apos;s nothing to worry about - you can
              safely ignore it.
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

export default TwoFactorCodeEmail;

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

const h1 = {
  color: "#1d1c1d",
  fontSize: "24px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "16px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginRight: "50px",
  marginBottom: "30px",
  padding: "43px 23px",
};

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle",
};
