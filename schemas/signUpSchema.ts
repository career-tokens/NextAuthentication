import { z } from 'zod';

//here zod can be used to validate username whether it is a string,
//has min 2 characters,
//max 20 characters,
//and follows a regex (small task for you:chatgpt what this regex means)
export const usernameValidation = z
    .string()
    .min(2, "Username must have minimum 2 characters")
    .max(20, "Username must have a maximum of 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

//here zod is used to validate the signup form whether the data from it
//has a username which is valid using the earlier validation
//,has email which follows the format of a mail and a string
//,has password with minimum 6 characters
export const signUpSchema = z.object({
        username: usernameValidation,
      
        email: z.string().email({ message: 'Invalid email address' }),
        password: z
          .string()
          .min(6, { message: 'Password must be at least 6 characters' }),
      });
