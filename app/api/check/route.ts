import { Resend } from 'resend';
import * as React from 'react';
import EmailTemplate from '@/components/EmailTemplate';
import VerificationEmail from '@/emails/VerificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request:Request) {
    try {
        const { username,email,otp } = await request.json();
    const { data, error } = await resend.emails.send({
      from: 'NextJS Auth <onboarding@resend.dev>',
      to: [email],
      subject: "Verification Code",
      react: VerificationEmail({username,otp}),
    });

    if (error) {
      return Response.json({ error });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error });
  }
}