// import { z } from 'zod';
// const ACCEPTED_IMAGES_TYPES = ["image/jpeg", "image/png"];

// export const StaffProfileSchema = z.object({

//   // TAB 1: Personal 

//   firstNm: z
//     .string()
//     .trim()
//     .min(1, "First name is required")
//     .min(2, { message: "First name must be atleast two charecters long." })
//     .max(50, "First name must be under 50 characters")
//     .regex(/^[a-zA-Z\s'-]+$/, {
//       message: "First name must only contain letters, spaces, hyphens, and apostrophes."
//     }),
    

//   lastNm: z
//     .string()
//     .trim()
//     .min(1, "Last name is required")
//     .min(2, { message: "Last name must be atleast two charecters long." })
//     .regex(/^[a-zA-Z\s'-]+$/, {
//       message: "Last name must only contain letters, spaces, hyphens, and apostrophes."
//     }),

//   email: z
//     .string()
//     .trim()
//     .min(1, "Email address is required")
//     .email("Enter a valid email address"),

//    mobileNum: z
//   .string()
//   .trim()
//   .refine(
//     (val) => val === "" || /^(?:\+91 ?[6-9]\d{4} ?\d{5}|[6-9]\d{4} ?\d{5})$/.test(val),
//     { message: "Enter a valid mobile number" }
//   ),

//   gender: z.string().min(1, "Gender is required"),

//   dob: z.coerce.date({ errorMap: () => ({ message: "date of birth is required" }) })
//     .max(new Date(), { message: "Date of birth cannot be in the future" }),

//   //TAB 2: Employment & Address
//   staffId: z.string()
//     .trim()
//     .min(1, "staff Id is required."),

//   designation: z.string()
//     .trim()
//     //.min(1, "designation is required.")
//       .or(z.literal("")),

//   dateOfJoining: z.coerce.date({ errorMap: () => ({ message: "date of joining is required" }) }),

//   roles: z.array(z.string())
//     //.min(1, "assignedRoles is required.")
//       .or(z.literal("")),
    
//   addr1: z.string().trim()
//     //.min(1, "Adress Line 1 is required.")
//     .refine(value => value !== 'NOT_SET', {
//       message: "Please enter text instead of 'NOT_SET'."
//     })
//     .or(z.literal("")),

//   addr2: z.string()
//           .or(z.literal("")), 

//   city: z.string().trim()
//     //.min(1, "city is required")
//     .regex(/^[A-Za-z\s_]+$/, { message: "City contains only letters, spaces, underscores" })
//     .refine(value => value !== 'NOT_SET', {
//       message: "Please enter text instead of 'NOT_SET'."
//     })
//     .or(z.literal("")),

//   state: z.string()
//   //.min(1, "state is required")
//     .or(z.literal("")),

//   country: z.string()
//   //.min(1, "Country is required")
//     .or(z.literal("")),

//     pin: z.string()
//     //.nonempty("PIN code is required")
//     .regex(/^\d{6}$/, "PIN code must be numbers exactly 6 digits")
//     .or(z.literal("")),

//   // TAB 3: Emergency Contact

//   emergencyContactNm: z.string()
//     //.min(1, "Emergency contact name is required")
//     .min(2, { message: "contact person name must be atleast two charecters long." })
//     .regex(/^[a-zA-Z\s'-]+$/, {
//       message: "contact person name must only contain letters, spaces, hyphens, and apostrophes."
//     })
//     .or(z.literal("")),

//   emergencyContactNum: z
//     .string()
//     .trim()
//    //.min(1, "Emergency Contact Number is required")
//     .regex(/^(?:\+91[\-\s]?)?(?:[6-9]\d{9}|0\d{2,4}[\-\s]?\d{6,8})$/, "Enter a valid Emargency Contact Number")
//     .or(z.literal("")),

// profileImg:  z
//   .custom((value) =>{
  
//   return (value instanceof File || typeof value === "string" || value === null);
//   }, {
//     message: "Image is Required."
//   })
//   .refine(
//     (file) => { 
//       if(file instanceof File || typeof file === "string" || file === null) {
//       if(file instanceof File)
//            return ACCEPTED_IMAGES_TYPES.includes(file.type);
//     else
//       return true;
//     } },
//     {
//       message: "Only JPEG and PNG formats are supported."
//     }
//   )

// });


// // currentStatus: z.string()
// // .trim()
// // .max(200).optional(),

// // profilePicture:  z.any()
// // .optional(),



//__________________________________________________________________


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
    .refine(
      (val) => val === "" || /^(?:\+91 ?[6-9]\d{4} ?\d{5}|[6-9]\d{4} ?\d{5})$/.test(val),
      { message: "Enter a valid mobile number" }
    ),
    gender: z
    .preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string().or(z.literal("")))
    .nullable()
    .optional()
    ,
    dob: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.date()
      .max(new Date(), { message: "Date of Birth can not be in future." })
      .optional()
  ),
  // TAB 2: Employment & Address
  staffId: z.string()
    .trim()
    .min(1, "staff Id is required."),
    designation: z
    .preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string())
    .optional()
    .or(z.literal("")),
    dateOfJoining: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.date().optional()
  ),
  roles: z.preprocess((val) => {
    if (typeof val === 'string') {
      const trimmed = val.trim();
      return trimmed === "" ? [] : [trimmed];
    }
    return val;
  }, z.array(z.string()).optional().or(z.literal(""))),
  addr1: z.preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string())
    .superRefine((val, ctx) => {
      if (val === 'NOT_SET') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter the text instead of 'NOT_SET' . "
        });
      }
    })
    .optional()
    .or(z.literal("")),
    addr2: z.preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string())
    .optional()
    .or(z.literal("")),
    city: z.preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string())
    .superRefine((val, ctx) => {
      if (val === 'NOT_SET') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter the text instead of 'NOT_SET' . "
        });
      } else if (val && val !== "" && !/^[A-Za-z\s_]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City contains only letters, spaces, underscores"
        });
      }
    })
    .optional()
    .or(z.literal("")),
    state: z.preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string())
    .optional()
    .or(z.literal("")),
    country: z.preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string())
    .optional()
    .or(z.literal("")),
    pin: z.preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string())
    .superRefine((val, ctx) => {
      if (val && val !== "" && !/^\d{6}$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Entered Pin code must be numbers exactly 6 digits."
        });
      }
    })
    .optional()
    .or(z.literal("")),
    emergencyContactNm: z.preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string())
    .superRefine((val, ctx) => {
      if (val && val !== "") {
        if (val.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "contact person name must be atleast two charecters long."
          });
        }
        if (!/^[a-zA-Z\s'-]+$/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "contact person name must only contain letters, spaces, hyphens, and apostrophes."
          });
        }
      }
    })
    .optional()
    .or(z.literal("")),
    emergencyContactNum: z.preprocess((val) => (typeof val === 'string' ? val.trim() : val), z.string())
    .superRefine((val, ctx) => {
      if (val && val !== "") {
        if (!/^(?:\+91[\-\s]?)?(?:[6-9]\d{9}|0\d{2,4}[\-\s]?\d{6,8})$/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter a valid Emargency Contact Number"
          });
        }
      }
    })
    .optional()
    .or(z.literal("")),

  profileImg: z
    .custom((value) => {
      return (value instanceof File || typeof value === "string" || value === null);
    }, {
      message: "Image is Required."
    })
    .refine(
      (file) => {
        if (file instanceof File || typeof file === "string" || file === null) {
          if (file instanceof File)
            return ACCEPTED_IMAGES_TYPES.includes(file.type);
          else
            return true;
        }
      },
      {
        message: "Only JPEG and PNG formats are supported."
      }
    )

});





