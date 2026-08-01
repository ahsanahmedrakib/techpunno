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
