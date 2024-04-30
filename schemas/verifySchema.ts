import { z } from 'zod';

//verify OTP
export const verifySchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});