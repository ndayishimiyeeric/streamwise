import * as React from "react";
import {
  Body,
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

interface EmailVerificationEmailProps {
  username: string;
  linkUrl: string;
  email: string;
  verificationDate: Date;
}

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";

export const EmailVerificationEmail = ({
  username,
  linkUrl,
  email,
  verificationDate,
}: EmailVerificationEmailProps) => {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(verificationDate);

  return (
    <Html>
      <Head />
      <Preview>Verify your Streamwise account.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img width={80} src={`${baseUrl}/logo-light.svg`} />
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              Here is your account verification link for your Streamwise account {email} requested
              on {formattedDate}. This link is only valid for 1 hour.
            </Text>
            <Text style={paragraph}>
              To verify your account, please{" "}
              <Link href={linkUrl} style={link}>
                click here.
              </Link>
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

export default EmailVerificationEmail;

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
  backgroundColor: "#ffffff",
};

const sectionsBorders = {
  width: "100%",
  display: "flex",
};

const sectionBorder = {
  borderBottom: "1px solid rgb(238,238,238)",
  width: "249px",
};

const sectionCenter = {
  borderBottom: "1px solid rgb(145,71,255)",
  width: "102px",
};

const link = {
  textDecoration: "underline",
};
