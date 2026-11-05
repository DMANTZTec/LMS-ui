import { z } from "zod";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
export const MAX_IMAGE_SIZE_MB = 3;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const MIN_IMAGE_DIMENSION_PX = 100;

// Reads the pixel width/height of an image file in the browser; resolves null if it is not a readable image
const getImageDimensions = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });

export const StaffProfileImageSchema = z.object({
  profileImg: z.any().superRefine(async (file, ctx) => {
    if (!(file instanceof File)) {
      ctx.addIssue({ code: "custom", message: "Please select a profile photo to upload." });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      ctx.addIssue({ code: "custom", message: "Only JPEG and PNG formats are supported." });
      return;
    }

    if (file.size === 0) {
      ctx.addIssue({ code: "custom", message: "The selected file is empty." });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      ctx.addIssue({ code: "custom", message: `Photo must be ${MAX_IMAGE_SIZE_MB} MB or smaller.` });
      return;
    }

    const dimensions = await getImageDimensions(file);
    if (!dimensions) {
      ctx.addIssue({ code: "custom", message: "The selected file is not a valid image." });
      return;
    }

    if (dimensions.width < MIN_IMAGE_DIMENSION_PX || dimensions.height < MIN_IMAGE_DIMENSION_PX) {
      ctx.addIssue({
        code: "custom",
        message: `Photo must be at least ${MIN_IMAGE_DIMENSION_PX} x ${MIN_IMAGE_DIMENSION_PX} pixels.`,
      });
    }
  }),
});

// Letters, spaces, dots, hyphens and apostrophes (e.g. "Nalgonda", "St. John's")
const PLACE_NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]*$/;

// Contact & address fields are optional: an empty field is accepted, a filled-in field must be valid
const optionalText = (label, max) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .refine((val) => val !== "NOT_SET", { message: `Please enter a valid ${label.toLowerCase()}.` });

const optionalMatch = (regex, message) =>
  z
    .string()
    .trim()
    .refine((val) => val === "" || regex.test(val), { message });

const placeName = (label) =>
  optionalText(label, 50).refine((val) => val === "" || PLACE_NAME_REGEX.test(val), {
    message: `${label} can contain only letters, spaces, dots, hyphens and apostrophes.`,
  });

export const StaffContactAddressSchema = z.object({
  mobileNum: optionalMatch(/^(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, "Enter a valid 10-digit Indian mobile number."),
  addr1: optionalText("Address line 1", 100),
  addr2: z.string().trim().max(100, "Address line 2 must be 100 characters or fewer."),
  city: placeName("City"),
  state: placeName("State"),
  country: placeName("Country"),
  pin: optionalMatch(/^[1-9]\d{5}$/, "PIN code must be exactly 6 digits and cannot start with 0."),
});

// Emergency contact fields are optional too: an empty field is accepted, a filled-in field must be valid
export const StaffEmergencyContactSchema = z.object({
  emergencyContactNm: z
    .string()
    .trim()
    .max(50, "Contact name must be 50 characters or fewer.")
    .refine((val) => val === "" || val.length >= 2, { message: "Contact name must be at least 2 characters." })
    .refine((val) => val === "" || /^[A-Za-z][A-Za-z\s.'-]*$/.test(val), {
      message: "Contact name can contain only letters, spaces, dots, hyphens and apostrophes.",
    }),
  // Indian mobile (+91 98765 43210) or landline with STD code (040-12345678)
  emergencyContactNum: optionalMatch(
    /^(?:(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}|0\d{2,4}[\s-]?\d{6,8})$/,
    "Enter a valid 10-digit mobile number or a landline number with STD code."
  ),
});
