import { z } from 'zod';

// ============================================================================
// Engine Types
// ============================================================================

export const EngineSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  provider: z.string(),
  modelId: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  category: z.string(),
  contextWindow: z.number(),
  latencyClass: z.string(),
  priceInputPer1M: z.number(),
  priceOutputPer1M: z.number(),
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

export const EngineRefSchema = z.object({
  id: z.string().optional(),
  slug: z.string(),
  name: z.string(),
  provider: z.string().optional(),
});

export type EngineRef = z.infer<typeof EngineRefSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  chatSessionId: z.string().optional(),
  role: MessageRoleSchema,
  content: z.string(),
  engine: EngineRefSchema.optional().nullable(),
  createdAt: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

export const ChatSessionSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  title: z.string(),
  defaultEngineId: z.string().optional().nullable(),
  defaultEngine: EngineRefSchema.optional().nullable(),
  messageCount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  lastMessageAt: z.string().optional().nullable(),
  messages: z.array(MessageSchema).optional(),
});

export type ChatSession = z.infer<typeof ChatSessionSchema>;

// ============================================================================
// Usage Types
// ============================================================================

export const UsageRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  chatSessionId: z.string().optional().nullable(),
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
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CreateChatParams {
  engineId?: string;
  title?: string;
}

export interface SendMessageParams {
  chatSessionId?: string;
  engineId?: string;
  message: string;
  stream?: boolean;
}

export interface SendMessageResponse {
  chatSessionId: string;
  engine: {
    id: string;
    slug: string;
    name: string;
  };
  message: string;
  usage?: {
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
// Chat List Response
// ============================================================================

export interface ListChatsResponse {
  chats: ChatSession[];
}

export interface ListEnginesResponse {
  engines: Engine[];
}

export interface GetMessagesResponse {
  messages: Message[];
}

// ============================================================================
// Client Configuration
// ============================================================================

export interface UplinxClientConfig {
  baseUrl?: string;
  apiKey: string;
  timeout?: number;
}

export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onComplete?: (message: Message) => void;
  onError?: (error: Error) => void;
}
