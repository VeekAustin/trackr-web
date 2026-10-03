import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type SignupFormData = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const trackSchema = z.object({
  name: z.string().min(1, "Track name is required").max(30, "Keep it under 30 characters"),
  color: z.string().min(1),
});
export type TrackFormData = z.infer<typeof trackSchema>;

export const entrySchema = z.object({
  track: z.string().min(1, "Select a track"),
  title: z.string().min(1, "Title is required").max(200, "Keep it under 200 characters"),
  notes: z.string().max(1000, "Keep notes under 1000 characters").optional(),
  date: z.string().min(1, "Date is required"),
});
export type EntryFormData = z.infer<typeof entrySchema>;