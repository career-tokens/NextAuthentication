import emailjs from '@emailjs/nodejs';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    
    await emailjs
      .send(
        process.env.EMAILJS_SERVICE_ID||"",
        process.env.EMAILJS_TEMPLATE_ID||"",
        {
          username:username,
          to_email: email,
          otp:verifyCode,
        },
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY||"",
          privateKey: process.env.EMAILJS_PRIVATE_KEY||"",
        }
      )
    return { success: true,message: 'Verification email sent successfully.'};
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false,message: 'Failed to send verification email.'};
  }
}