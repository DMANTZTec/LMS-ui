import z from 'zod';


const ACCEPTED_IMAGES_TYPES = ["image/jpeg","image/png"]; 

// 1. Zod Validation Schema
export const staffFormSchema = z.object({
  firstName: z.string()
    .trim()
    .min(1, "First name is required")
    .min(2, { message: "First name must be atleast two charecters long."})
    .max(50, "First name must be under 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, { 
      message: "First name must only contain letters, spaces, hyphens, and apostrophes." 
    }),
  lastName: z.string()
    .trim()
    .min(1, "Last name is required")
    .min(2, { message: "Last name must be atleast two charecters long."})
    .regex(/^[a-zA-Z\s'-]+$/, { 
      message: "Last name must only contain letters, spaces, hyphens, and apostrophes." 
    }),
  email: z.string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),

  mobileNumber: z
      .string()
      .trim()
      .min(1, { message: 'MobileNumber is required'})
      .regex(/^(?:\+91 ?[6-9]\d{9}|[6-9]\d{9})$/,{ message: 'Enter a valid mobile number'}),

  dateOfBirth:z
    .string()
    .min(1, "Date of birth is required")
    .refine(
        value => {
          const selected =new Date(value);
          const today = new Date();
          today.setHours(0,0,0,0);
          return selected <= today;   
        },
        {
            message: "Date of birth cannot be in the future"
        }
    ),
  
      gender: z.string()
      .min(1, "please select gender"),

  dateOfJoining: z
    .string()
    .min(1, "Date of joining is required")
    .refine(
        value => {

            const selected = new Date(value);

            const today = new Date();


            today.setHours(0,0,0,0);

            return selected >= today;
        },
        {
            message:"Date of joining cannot be in the past"
        }
    ),
  role: z.string().min(1, "Please select a role"),

  photo: z
  .custom((value) =>{console.log("in first refine validation and the file type is: ",value);
    return value instanceof File;}, {
    message: "Image is Required."
  })
  .refine(
    (file) => {console.log("in second refine validation and the type is: ",file.type);
        return ACCEPTED_IMAGES_TYPES.includes(file.type);},
    {
      message: "Only JPEG and PNG formats are supported."
    }
  )
});
