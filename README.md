# @uplinx SDK

Official TypeScript SDK for the **Uplinx LLM Marketplace API**.

Access 20+ LLM models through OpenRouter via a unified API. One integration, all models.

## Installation

```bash
npm install @uplinx/sdk
# or
pnpm add @uplinx/sdk
# or
yarn add @uplinx/sdk
```

## Quick Start

```typescript
import { UplinxClient } from '@uplinx/sdk';

const client = new UplinxClient({
  apiKey: 'upx_your-api-key',
  baseUrl: 'http://localhost:3001', // Optional, defaults to localhost
});

// List available engines
const engines = await client.listEngines();
console.log(`${engines.length} engines available`);

// Send a message (auto-creates chat session)
const response = await client.sendMessage({
  engineId: engines[0].id,
  message: 'Explain quantum computing in simple terms',
});

console.log(response.message);
console.log(`Chat session: ${response.chatSessionId}`);
```

## Features

- **Unified API** - Access OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek and more through OpenRouter
- **Type-Safe** - Full TypeScript support with Zod runtime validation
- **Chat Sessions** - Persistent conversations with message history
- **Engine Switching** - Switch models mid-conversation
- **Usage Tracking** - Built-in cost and token usage tracking
- **Error Handling** - Typed errors with detailed context

## API Reference

### Client Configuration

```typescript
const client = new UplinxClient({
  apiKey: 'upx_...',           // Required: API key for authentication
  baseUrl: 'http://localhost:3001', // Optional: API base URL
  timeout: 60000,               // Optional: Request timeout in ms (default: 60000)
});
```

### Engines

```typescript
// List all engines
const engines = await client.listEngines();

// Search engines
const gptEngines = await client.listEngines({ q: 'gpt' });

// Filter by category
const codingEngines = await client.listEngines({ 
  category: 'Coding' 
});

// Sort by price
const cheapestFirst = await client.listEngines({
  sort: 'price-low'
});

// Get specific engine by slug
const engine = await client.getEngine('gpt-4o');
console.log(`${engine.name}: $${engine.priceInputPer1M} per 1M input tokens`);
```

### Chat Sessions

```typescript
// List all your chat sessions
const chats = await client.listChats();
console.log(`You have ${chats.length} conversations`);

// Create a new chat session
const chat = await client.createChat({
  engineId: 'claude-3-5-sonnet',
  title: 'Project Discussion',
});

// Get chat details
const chatDetails = await client.getChat(chat.id);

// Get messages from a chat
const messages = await client.getMessages(chat.id);
messages.forEach(m => console.log(`${m.role}: ${m.content}`));
```

### Sending Messages

```typescript
// Send message to existing chat
const response = await client.sendMessage({
  chatSessionId: chat.id,
  message: 'Hello, how can you help me today?',
});

console.log(response.message);
console.log(`Engine: ${response.engine.name}`);
console.log(`Tokens: ${response.usage?.inputTokens} in, ${response.usage?.outputTokens} out`);
console.log(`Cost: $${response.usage?.costUsd.toFixed(4)}`);

// Switch engines mid-conversation
const switchedResponse = await client.sendMessage({
  chatSessionId: chat.id,
  engineId: 'gpt-4o', // Use a different engine for this message
  message: 'Now respond using GPT-4o',
});

// Create a new chat automatically
const newChatResponse = await client.sendMessage({
  engineId: 'deepseek-v3',
  message: 'Start a new conversation',
});
console.log(`New chat created: ${newChatResponse.chatSessionId}`);
```

### Streaming Responses

```typescript
await client.sendMessageStream(
  {
    chatSessionId: chat.id,
    message: 'Write a haiku about programming',
  },
  {
    onToken: (token) => process.stdout.write(token),
    onComplete: (message) => console.log('\n\nStream complete!'),
    onError: (error) => console.error('Stream error:', error),
  }
);
```

### Usage Tracking

```typescript
// Get all usage
const usage = await client.getUsage();

// Get usage for date range
const monthlyUsage = await client.getUsage({
  from: '2024-01-01',
  to: '2024-01-31',
});

console.log(`Total cost: $${usage.totalCostUsd.toFixed(2)}`);
console.log(`Total tokens: ${usage.totalInputTokens + usage.totalOutputTokens}`);
```

## Error Handling

```typescript
import { UplinxClient, UplinxError } from '@uplinx/sdk';

try {
  const response = await client.sendMessage({
    engineId: 'invalid-engine',
    message: 'Hello',
  });
} catch (error) {
  if (error instanceof UplinxError) {
    console.error(`Error ${error.status}: ${error.message}`);
    console.error(`Code: ${error.code}`);
    
    // Handle specific error codes
    switch (error.code) {
      case 'RATE_LIMITED':
        // Wait and retry
        break;
      case 'NOT_FOUND':
        // Resource doesn't exist
        break;
      case 'NETWORK_ERROR':
        // Check connection
        break;
      case 'TIMEOUT':
        // Request took too long
        break;
    }
  }
}
```

## Types

All types are exported and can be used for type annotations:

```typescript
import type { 
  Engine, 
  ChatSession, 
  Message, 
  UsageRecord,
  UplinxClientConfig,
  SendMessageResponse,
} from '@uplinx/sdk';
```

Zod schemas are also exported for runtime validation:

```typescript
import { EngineSchema, MessageSchema } from '@uplinx/sdk';

// Validate external data
const engine = EngineSchema.parse(unknownData);
```

## Available Engines

The SDK provides access to 20+ models including:

| Engine | Provider | Category |
|--------|----------|----------|
| claude-3-5-sonnet | Anthropic | Reasoning |
| claude-3-opus | Anthropic | Analysis |
| gpt-4o | OpenAI | Multimodal |
| gpt-4o-mini | OpenAI | Speed |
| gemini-1-5-pro | Google | Multimodal |
| llama-3-1-405b | Meta | Open Source |
| deepseek-v3 | DeepSeek | Coding |
| mistral-large | Mistral | Reasoning |
| qwen-2-5-72b | Alibaba | Reasoning |

See the full list with `client.listEngines()`.

## Browser Support

The SDK works in both Node.js and browser environments. It uses the native `fetch` API.

## License

MIT © Uplinx
