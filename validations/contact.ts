import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  subject: z.string().min(3, "Please add a subject"),
  message: z.string().min(10, "Tell us a bit more (min 10 characters)").max(2000, "Message is too long"),
});
export type ContactInput = z.infer<typeof contactSchema>;