import { z } from "zod";

export const createCommentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Comment text is required")
    .max(2000, "Comment text is too long"),
  avatarUrl: z.string().url().optional().nullable(),
});

export const editCommentSchema = z.object({
  commentId: z.coerce.number().int().positive("Invalid comment ID"),
  text: z
    .string()
    .trim()
    .min(1, "Comment text is required")
    .max(2000, "Comment text is too long"),
});

export const deleteCommentSchema = z.object({
  commentId: z.coerce.number().int().positive("Invalid comment ID"),
});
