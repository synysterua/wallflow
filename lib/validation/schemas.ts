import { z } from "zod";

export const TestimonialSchema = z
  .object({
    author_name: z.string().min(1).max(80),
    author_title: z.string().max(120).optional(),
    content: z.string().min(3).max(600),
    rating: z.number().int().min(1).max(5).optional(),
    author_avatar_url: z
      .string()
      .url()
      .startsWith("https://")
      .optional()
      .or(z.literal("").transform(() => undefined)),
  })
  .strict();

export type TestimonialInput = z.infer<typeof TestimonialSchema>;

export const tokenSchema = z
  .string()
  .regex(/^[0-9a-f]{32}$/, "Invalid token format");
