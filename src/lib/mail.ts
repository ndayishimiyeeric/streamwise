import { Resend } from "resend";

import { EmailVerificationEmail } from "@/components/emails/verification-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, code: string, name: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/new-verification?code=${code}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your account",
    react: EmailVerificationEmail({
      email: email,
      linkUrl: confirmLink,
      username: name,
      verificationDate: new Date(),
    }),
  });
};
