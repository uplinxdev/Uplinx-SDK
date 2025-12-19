# @uplinx/sdk

Official TypeScript SDK for the **Uplinx LLM Marketplace API**.

Access 50+ LLM models through a unified API. One integration, all models.

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
  baseUrl: 'https://api.uplinx.io',
  apiKey: 'your-api-key',
});

// List available engines
const engines = await client.listEngines();
console.log(engines);

// Send a message
const response = await client.sendMessage({
  engineId: 'gpt-4o',
  message: 'Explain quantum computing in simple terms',
});

console.log(response.assistantMessage.content);
```

## Features

- **Unified API** - Access OpenAI, Anthropic, Google, Meta, and more through one SDK
- **Type-Safe** - Full TypeScript support with Zod runtime validation
- **Streaming** - Real-time token streaming for chat responses
- **Usage Tracking** - Built-in cost and token usage tracking
- **Error Handling** - Typed errors with detailed context

## API Reference

### Client Configuration

```typescript
const client = new UplinxClient({
  baseUrl: 'https://api.uplinx.io',  // Required: API base URL
  apiKey: 'upx_...',                  // Optional: API key for authentication
  timeout: 30000,                     // Optional: Request timeout in ms (default: 30000)
});
```

### Engines

```typescript
// List all engines
const engines = await client.listEngines();

// Search engines
const gptEngines = await client.listEngines({ q: 'gpt' });

// Filter by category
const productivityEngines = await client.listEngines({ 
  category: 'Productivity' 
});

// Get specific engine
const engine = await client.getEngine('gpt-4o');
```

### Chat Sessions

```typescript
// Create a chat session
const chat = await client.createChat({
  engineId: 'claude-3-opus',
  title: 'Project Discussion',
});

// Get chat details
const chatDetails = await client.getChat(chat.id);

// Get messages
const messages = await client.getMessages(chat.id);
```

### Sending Messages

```typescript
// Send message to existing chat
const response = await client.sendMessage({
  chatSessionId: chat.id,
  message: 'Hello, how can you help me today?',
});

console.log(response.assistantMessage.content);
console.log(`Tokens: ${response.usage.inputTokens} in, ${response.usage.outputTokens} out`);
console.log(`Cost: $${response.usage.costUsd.toFixed(4)}`);
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
      case 'INVALID_ENGINE':
        // Use different engine
        break;
      case 'NETWORK_ERROR':
        // Check connection
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
} from '@uplinx/sdk';
```

Zod schemas are also exported for runtime validation:

```typescript
import { EngineSchema, MessageSchema } from '@uplinx/sdk';

// Validate external data
const engine = EngineSchema.parse(unknownData);
```

## Browser Support

The SDK works in both Node.js and browser environments. It uses the native `fetch` API.

```html
<script type="module">
  import { UplinxClient } from 'https://unpkg.com/@uplinx/sdk';
  
  const client = new UplinxClient({
    baseUrl: 'https://api.uplinx.io',
  });
</script>
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT © Uplinx
