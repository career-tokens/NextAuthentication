import { z } from 'zod'

//verify the signIn form
export const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});
