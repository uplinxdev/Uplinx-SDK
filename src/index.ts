// Main client export
export { UplinxClient } from './client';

// Error handling
export { UplinxError } from './error';

// Types
export type {
  Engine,
  Message,
  MessageRole,
  ChatSession,
  UsageRecord,
  UsageSummary,
  ApiError,
  UplinxClientConfig,
  ListEnginesParams,
  CreateChatParams,
  SendMessageParams,
  SendMessageResponse,
  GetUsageParams,
  StreamCallbacks,
} from './types';

// Schemas for runtime validation
export {
  EngineSchema,
  MessageSchema,
  MessageRoleSchema,
  ChatSessionSchema,
  UsageRecordSchema,
  UsageSummarySchema,
  ApiErrorSchema,
} from './types';


