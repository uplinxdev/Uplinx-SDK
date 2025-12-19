import { z } from 'zod';

// ============================================================================
// Engine Types
// ============================================================================

export const EngineSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  provider: z.enum(['openai', 'anthropic', 'google', 'openrouter', 'xai', 'meta', 'mistral', 'deepseek', 'qwen']),
  modelId: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  category: z.string(),
  contextWindow: z.number(),
  latencyClass: z.enum(['fast', 'medium', 'slow']),
  pricingInputPer1M: z.number(),
  pricingOutputPer1M: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Engine = z.infer<typeof EngineSchema>;

// ============================================================================
// Chat Types
// ============================================================================

export const MessageRoleSchema = z.enum(['user', 'assistant', 'system']);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  chatSessionId: z.string(),
  role: MessageRoleSchema,
  content: z.string(),
  createdAt: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

export const ChatSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  engineId: z.string(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  engine: EngineSchema.optional(),
  messages: z.array(MessageSchema).optional(),
});

export type ChatSession = z.infer<typeof ChatSessionSchema>;

// ============================================================================
// Usage Types
// ============================================================================

export const UsageRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  chatSessionId: z.string().optional(),
  engineId: z.string(),
  inputTokens: z.number(),
  outputTokens: z.number(),
  costUsd: z.number(),
  createdAt: z.string(),
});

export type UsageRecord = z.infer<typeof UsageRecordSchema>;

export const UsageSummarySchema = z.object({
  totalInputTokens: z.number(),
  totalOutputTokens: z.number(),
  totalCostUsd: z.number(),
  records: z.array(UsageRecordSchema),
});

export type UsageSummary = z.infer<typeof UsageSummarySchema>;

// ============================================================================
// API Response Types
// ============================================================================

export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });

// ============================================================================
// Request Types
// ============================================================================

export interface ListEnginesParams {
  q?: string;
  category?: string;
  sort?: 'name' | 'price' | 'latency' | 'context';
  page?: number;
  limit?: number;
}

export interface CreateChatParams {
  engineId: string;
  title?: string;
}

export interface SendMessageParams {
  chatSessionId?: string;
  engineId?: string;
  message: string;
  stream?: boolean;
}

export interface SendMessageResponse {
  message: Message;
  assistantMessage: Message;
  usage: {
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
  };
}

export interface GetUsageParams {
  from?: string;
  to?: string;
}

// ============================================================================
// Client Configuration
// ============================================================================

export interface UplinxClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onComplete?: (message: Message) => void;
  onError?: (error: Error) => void;
}

