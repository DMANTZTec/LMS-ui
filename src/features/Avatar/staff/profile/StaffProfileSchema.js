import { z } from 'zod';
const ACCEPTED_IMAGES_TYPES = ["image/jpeg", "image/png"];

export const StaffProfileSchema = z.object({

  // TAB 1: Personal 

  firstNm: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, { message: "First name must be atleast two charecters long." })
    .max(50, "First name must be under 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "First name must only contain letters, spaces, hyphens, and apostrophes."
    }),

  lastNm: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, { message: "Last name must be atleast two charecters long." })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Last name must only contain letters, spaces, hyphens, and apostrophes."
    }),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),

  mobileNum: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    // .regex(/^(?:\+91 ?[6-9]\d{9}|[6-9]\d{9})$/, "Enter a valid mobile number"),
.regex(/^(?:\+91 ?[6-9]\d{4} ?\d{5}|[6-9]\d{4} ?\d{5})$/,"Enter a valid mobile number"),
  gender: z.string().min(1, "Gender is required"),

  dob: z.coerce.date({ errorMap: () => ({ message: "date of birth is required" }) })
    .max(new Date(), { message: "Date of birth cannot be in the future" }),

  //TAB 2: Employment & Address
  staffId: z.string()
    .trim()
    .min(1, "staff Id is required."),

  designation: z.string()
    .trim()
    .min(1, "designation is required."),

  dateOfJoining: z.coerce.date({ errorMap: () => ({ message: "date of joining is required" }) }),

  roles: z.array(z.string())
    .min(1, "assignedRoles is required."),

  addr1: z.string().trim()
    .min(1, "Adress Line 1 is required.")
    .refine(value => value !== 'NOT_SET', {
      message: "Please enter text instead of 'NOT_SET'."
    }),

  addr2: z.string().optional(),

  city: z.string().trim()
    .min(1, "city is required")
    .regex(/^[A-Za-z\s_]+$/, { message: "City contains only letters, spaces, underscores" })
    .refine(value => value !== 'NOT_SET', {
      message: "Please enter text instead of 'NOT_SET'."
    }),

  state: z.string().min(1, "state is required"),

  country: z.string().min(1, "Country is required"),

    pin: z.string()
    .nonempty("PIN code is required")
    .regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),

  // TAB 3: Emergency Contact

  emergencyContactNm: z.string()
    .min(1, "Emergency contact name is required")
    .min(2, { message: "contact person name must be atleast two charecters long." })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "contact person name must only contain letters, spaces, hyphens, and apostrophes."
    }),

  emergencyContactNum: z
    .string()
    .trim()
    .min(1, "Emergency Contact Number is required")
    .regex(/^(?:\+91[\-\s]?)?(?:[6-9]\d{9}|0\d{2,4}[\-\s]?\d{6,8})$/, "Enter a valid Emargency Contact Number"),


profileImg:  z
  .custom((value) =>{
  
  return (value instanceof File || typeof value === "string" || value === null);
  }, {
    message: "Image is Required."
  })
  .refine(
    (file) => { 
      if(file instanceof File || typeof file === "string" || file === null) {
      if(file instanceof File)
           return ACCEPTED_IMAGES_TYPES.includes(file.type);
    else
      return true;
    } },
    {
      message: "Only JPEG and PNG formats are supported."
    }
  )

});


// currentStatus: z.string()
// .trim()
// .max(200).optional(),

// profilePicture:  z.any()
// .optional(),









