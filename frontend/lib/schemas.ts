import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

export const postFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  shortDescription: z
    .string()
    .max(200, "Short description must be 200 characters or fewer."),
  content: z.string().min(1, "Content is required."),
  author: z.string().min(1, "Author is required."),
  category: z.string().min(1, "Category is required."),
  tags: z.string(),
  imageUrl: z.url("Enter a valid image URL."),
  status: z.enum(["on", "off"]),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type PostFormValues = z.infer<typeof postFormSchema>;
