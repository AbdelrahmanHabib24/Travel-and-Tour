import { z } from "zod";

export const positiveIntIdSchema = z.coerce
  .number()
  .int("Invalid ID")
  .positive("Invalid ID");

export const packageSearchQuerySchema = z.object({
  city: z.string().trim().max(120).optional().default(""),
  maxPrice: z.coerce.number().finite().positive().max(1_000_000).optional().default(5000),
});
