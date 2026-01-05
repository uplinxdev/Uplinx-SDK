import { UplinxError } from './error';
import {
  Engine,
  EngineSchema,
  ChatSession,
  ChatSessionSchema,
  Message,
  MessageSchema,
  UsageSummary,
  UsageSummarySchema,
  UplinxClientConfig,
  ListEnginesParams,
  CreateChatParams,
  SendMessageParams,
  SendMessageResponse,
  GetUsageParams,
  StreamCallbacks,
} from './types';
import { z } from 'zod';

const DEFAULT_BASE_URL = 'http://localhost:3001';

/**
 * Uplinx API Client
 * 
 * A TypeScript SDK for interacting with the Uplinx LLM Marketplace API.
 * 
 * @example
 * ```typescript
 * import { UplinxClient } from '@uplinx/sdk';
 * 
 * const client = new UplinxClient({
 *   apiKey: 'upx_your-api-key',
 * });
 * 
 * // List available engines
 * const engines = await client.listEngines();
 * 
 * // Create a chat and send a message
 * const chat = await client.createChat({ engineId: 'gpt-4o' });
 * const response = await client.sendMessage({
 *   chatSessionId: chat.id,
 *   message: 'Hello, world!',
 * });
 * ```
 */
export class UplinxClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  constructor(config: UplinxClientConfig) {
    this.baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 60000;
  }

  /**
   * Make an authenticated request to the API
   */
  private async request<T>(
    method: string,
    path: string,
    options: {
      body?: unknown;
      params?: Record<string, string | number | undefined>;
      schema?: z.ZodType<T>;
    } = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    
    // Add query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = await response.text();
        }
        throw UplinxError.fromResponse(response.status, errorBody);
      }

      const data = await response.json();
      
      // Validate response with schema if provided
      if (options.schema) {
        const result = options.schema.safeParse(data);
        if (!result.success) {
          throw new UplinxError(
            'Invalid response from server',
            500,
            'VALIDATION_ERROR',
            result.error.errors
          );
        }
        return result.data;
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof UplinxError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw UplinxError.timeoutError();
        }
        if (UplinxError.isNetworkError(error)) {
          throw UplinxError.networkError(error);
        }
      }
      
      throw new UplinxError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
        'UNKNOWN_ERROR'
      );
    }
  }

  // ==========================================================================
  // Engine Methods
  // ==========================================================================

  /**
   * List available LLM engines
   * 
   * @param params - Filter and pagination options
   * @returns Array of engines
   * 
   * @example
   * ```typescript
   * // List all engines
   * const engines = await client.listEngines();
   * 
   * // Search for GPT models
   * const gptEngines = await client.listEngines({ q: 'gpt' });
   * 
   * // Filter by category
   * const codingEngines = await client.listEngines({ category: 'Coding' });
   * ```
   */
  async listEngines(params: ListEnginesParams = {}): Promise<Engine[]> {
    const response = await this.request<{ engines: Engine[] }>('GET', '/engines', {
      params: {
        q: params.q,
        category: params.category,
        sort: params.sort,
        page: params.page,
        limit: params.limit,
      },
    });
    
    return z.array(EngineSchema).parse(response.engines);
  }

  /**
   * Get a specific engine by slug
   * 
   * @param slug - The engine slug (e.g., 'gpt-4o', 'claude-3-opus')
   * @returns The engine details
   * 
   * @example
   * ```typescript
   * const engine = await client.getEngine('gpt-4o');
   * console.log(engine.name, engine.priceInputPer1M);
   * ```
   */
  async getEngine(slug: string): Promise<Engine> {
    const response = await this.request<{ engine: Engine }>('GET', `/engines/${slug}`);
    return EngineSchema.parse(response.engine);
  }

  // ==========================================================================
  // Chat Methods
  // ==========================================================================

  /**
   * List all chat sessions
   * 
   * @returns Array of chat sessions
   * 
   * @example
   * ```typescript
   * const chats = await client.listChats();
   * console.log(`You have ${chats.length} conversations`);
   * ```
   */
  async listChats(): Promise<ChatSession[]> {
    const response = await this.request<{ chats: ChatSession[] }>('GET', '/chats');
    return z.array(ChatSessionSchema).parse(response.chats);
  }

  /**
   * Create a new chat session
   * 
   * @param params - Chat creation parameters
   * @returns The created chat session
   * 
   * @example
   * ```typescript
   * const chat = await client.createChat({
   *   engineId: 'gpt-4o',
   *   title: 'My conversation',
   * });
   * ```
   */
  async createChat(params: CreateChatParams = {}): Promise<ChatSession> {
    const response = await this.request<{ chat: ChatSession }>('POST', '/chats', {
      body: params,
    });
    return ChatSessionSchema.parse(response.chat);
  }

  /**
   * Get a chat session by ID
   * 
   * @param chatSessionId - The chat session ID
   * @returns The chat session
   * 
   * @example
   * ```typescript
   * const chat = await client.getChat('chat_abc123');
   * console.log(chat.title);
   * ```
   */
  async getChat(chatSessionId: string): Promise<ChatSession> {
    const response = await this.request<{ chat: ChatSession }>('GET', `/chats/${chatSessionId}`);
    return ChatSessionSchema.parse(response.chat);
  }

  /**
   * Get messages for a chat session
   * 
   * @param chatSessionId - The chat session ID
   * @returns Array of messages
   * 
   * @example
   * ```typescript
   * const messages = await client.getMessages('chat_abc123');
   * messages.forEach(m => console.log(`${m.role}: ${m.content}`));
   * ```
   */
  async getMessages(chatSessionId: string): Promise<Message[]> {
    const response = await this.request<{ messages: Message[] }>(
      'GET',
      `/chats/${chatSessionId}/messages`
    );
    return z.array(MessageSchema).parse(response.messages);
  }

  /**
   * Send a message to a chat session
   * 
   * @param params - Message parameters
   * @returns The assistant response and usage info
   * 
   * @example
   * ```typescript
   * // Send to existing chat
   * const response = await client.sendMessage({
   *   chatSessionId: 'chat_abc123',
   *   message: 'Explain quantum computing',
   * });
   * console.log(response.message);
   * 
   * // Create new chat and send (auto-creates session)
   * const response = await client.sendMessage({
   *   engineId: 'gpt-4o',
   *   message: 'Hello!',
   * });
   * console.log('Chat ID:', response.chatSessionId);
   * ```
   */
  async sendMessage(params: SendMessageParams): Promise<SendMessageResponse> {
    return this.request<SendMessageResponse>('POST', '/v1/chat', {
      body: {
        chatSessionId: params.chatSessionId,
        engineId: params.engineId,
        message: params.message,
      },
    });
  }

  /**
   * Send a message with streaming response
   * 
   * @param params - Message parameters
   * @param callbacks - Stream event callbacks
   * 
   * @example
   * ```typescript
   * await client.sendMessageStream(
   *   { chatSessionId: 'chat_abc123', message: 'Tell me a story' },
   *   {
   *     onToken: (token) => process.stdout.write(token),
   *     onComplete: (message) => console.log('\nDone!'),
   *     onError: (error) => console.error(error),
   *   }
   * );
   * ```
   */
  async sendMessageStream(
    params: SendMessageParams,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const url = new URL(`${this.baseUrl}/v1/chat`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          chatSessionId: params.chatSessionId,
          engineId: params.engineId,
          message: params.message,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw UplinxError.fromResponse(response.status, errorBody);
      }

      if (!response.body) {
        throw new UplinxError('No response body', 500, 'STREAM_ERROR');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              if (callbacks.onComplete) {
                callbacks.onComplete({
                  id: '',
                  chatSessionId: params.chatSessionId || '',
                  role: 'assistant',
                  content: fullContent,
                  createdAt: new Date().toISOString(),
                });
              }
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                fullContent += parsed.token;
                callbacks.onToken?.(parsed.token);
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      if (callbacks.onError) {
        callbacks.onError(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }

  // ==========================================================================
  // Usage Methods
  // ==========================================================================

  /**
   * Get usage statistics
   * 
   * @param params - Date range filters
   * @returns Usage summary with records
   * 
   * @example
   * ```typescript
   * // Get all usage
   * const usage = await client.getUsage();
   * 
   * // Get usage for a date range
   * const usage = await client.getUsage({
   *   from: '2024-01-01',
   *   to: '2024-01-31',
   * });
   * 
   * console.log(`Total cost: $${usage.totalCostUsd.toFixed(4)}`);
   * ```
   */
  async getUsage(params: GetUsageParams = {}): Promise<UsageSummary> {
    return this.request<UsageSummary>('GET', '/profile/usage', {
      params: {
        from: params.from,
        to: params.to,
      },
      schema: UsageSummarySchema,
    });
  }
}
