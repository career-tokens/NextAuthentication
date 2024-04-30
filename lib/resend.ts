import { Resend } from 'resend';

//this can be used in many places and hence we have segregated this
export const resend = new Resend(process.env.RESEND_API_KEY);