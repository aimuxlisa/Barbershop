import { z } from "zod";

export const aiBlockSchema = z.object({
  type: z.string().min(1).max(64),
  variant: z.string().max(64).optional(),
  content: z.record(z.unknown()).optional(),
});

export const aiPageSchema = z.object({
  blocks: z.array(aiBlockSchema).min(1).max(30),
});

export const aiRequestSchema = z.object({
  prompt: z.string().min(3).max(2000),
  allowedBlockTypes: z.array(z.string().min(1).max(64)).min(1).max(50),
});

export type AIBlockSpec = z.infer<typeof aiBlockSchema>;
export type AIPageResponse = z.infer<typeof aiPageSchema>;
export type AIRequest = z.infer<typeof aiRequestSchema>;
