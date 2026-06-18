import { z } from 'zod';

export const StudentProfileSchema = z.object({
    // section 1 : personal information.
    firstNm: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, { message: "First name must be atleast two charecters long."})
    .max(50, "First name must be under 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, { 
      message: "First name must only contain letters, spaces, hyphens, and apostrophes." 
    }),
    
    lastNm: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, { message: "Last name must be atleast two charecters long."})
    .regex(/^[a-zA-Z\s'-]+$/, { 
      message: "Last name must only contain letters, spaces, hyphens, and apostrophes." 
    }),

    gender: z.string().min(1, "Gender is required"),
    
    dateOfBirth: z.string().min(1, "date of birth is required"),
    
    currentStatus: z.string()
    .trim()
    .max(200).optional(),

    profilePicture: z.any().optional(),

    // section 2 : Contact and Address.
    emailId:  z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),


    mobileNum: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Enter a valid mobile number"),

    addressLine1: z.string().min(1, "Adress Line 1 is required."),

    addressLine2: z.string().optional(),

    city: z.string().min(1, "city is required"),

    state: z.string().min(1, "state is required"),

    pinCode: z.string().min(1, "Enter a valid pin or zip code"),

    country: z.string().min(1, "Country is required"),

    // Section 3: Security & Emergency Contact
  password: z
    .string()
    .min(1, "Password is required")
    // Enforces length between 8 and 12 characters
    .min(8, "Password must be at least 8 characters long")
    .max(12, "Password cannot exceed 12 characters")
    // Enforces at least one uppercase, one lowercase, one number, and one special character(unlimited number of chareters)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``])[A-Za-z\d@$!%*?&#^()\-_\=+\[\]{}|;:',.<>\/\?~``]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  
  confirm_password: z.string().min(1, "Confirm password is required"),
  
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  
  emergencyContactNumber: z
    .string()
    .trim()
    .min(1, "Emergency Contact Number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Enter a valid Emargency Contact Number"), 

}).refine((data) => data.password === data.confirm_password , {
    message: "password and confirm password do not match",
    path: ["confirm_password"],
});

