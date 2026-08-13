import { z } from 'zod';

export const ContactUsSchema = z.object({
    fullName: z
    .string()
    .trim()
    .min(1,{ message: "FullName is required" })
    .max(50, { message: "First name must be under 50 characters"})
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "First name must only contain letters, spaces, hyphens, and apostrophes."
    }),
    mobileNum: z
    .string()
    .trim()
    .min(1, { message: 'MobileNumber is required'})
    .regex(/^(?:\+91 ?[6-9]\d{9}|[6-9]\d{9})$/,{ message: 'Enter a valid mobile number'}),
    emailId: z
    .string()
    .trim()
    .min(1, { message: 'Email is required'})
    .email('Invalid email address'),
    currentPosition: z
    .string()
    .trim()
    .min(1,{ message: 'Current Position is required'}),
    location: z
    .string()
    .trim()
    // .min(1, { message: 'Location is required'})
    // .max(100, { message: "Location must be under 100 characters." })        ,
    


});
