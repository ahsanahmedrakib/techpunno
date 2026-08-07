import * as yup from "yup";

export const contactSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup.string().trim(),
  subject: yup.string().required("Please select a subject"),
  message: yup
    .string()
    .trim()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = yup.InferType<typeof contactSchema>;

export const contactSubjects = [
  "Become a Volunteer",
  "Partnership / Collaboration",
  "Event Inquiry",
  "Press & Media",
  "General Message",
];

export const volunteerSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Full Name is required")
    .min(2, "Name must be at least 2 characters"),
  fatherName: yup
    .string()
    .trim()
    .required("Father's name is required")
    .min(2, "Name must be at least 2 characters"),
  motherName: yup
    .string()
    .trim()
    .required("Mother's name is required")
    .min(2, "Name must be at least 2 characters"),
  dateOfBirth: yup
    .string()
    .trim()
    .required("Date of Birth is required"),
  gender: yup.string().required("Please select a gender"),
  occupation: yup.string().required("Please select your occupation"),
  mobile: yup
    .string()
    .trim()
    .required("Mobile number is required")
    .matches(
      /^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/,
      "Enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX)",
    ),
  email: yup.string().trim().email("Please enter a valid email address"),
  whatsapp: yup.string().trim(),
  guardianName: yup
    .string()
    .trim()
    .required("Guardian's name is required"),
  guardianRelation: yup.string().trim().required("Relation is required"),
  guardianMobile: yup
    .string()
    .trim()
    .required("Guardian mobile number is required"),
  institute: yup
    .string()
    .trim()
    .required("Institution or organization name is required"),
  department: yup.string().trim(),
  designation: yup
    .string()
    .trim()
    .when("occupation", {
      is: "Job Holder",
      then: (s) => s.required("Designation / job title is required"),
      otherwise: (s) => s,
    }),
  educationLevel: yup.string().required("Please select your education level"),
  interestAreas: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one interest area"),
  membershipType: yup.string().required("Please select a membership type"),
  registrationFee: yup.string().trim(),
  paidBy: yup.string().required("Please select a payment method"),
  transactionId: yup
    .string()
    .trim()
    .when("paidBy", {
      is: (v: string | undefined) => v === "bKash" || v === "Nagad",
      then: (s) => s.required("Transaction ID is required for digital payment"),
      otherwise: (s) => s,
    }),
  image: yup.string(),
  declaration: yup
    .boolean()
    .oneOf([true], "You must accept the rules & declaration to register"),
});

export type VolunteerFormValues = yup.InferType<typeof volunteerSchema>;
