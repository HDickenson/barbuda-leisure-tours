/**
 * Simple test to verify Claude Code OAuth token works
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from project root
config({ path: resolve(process.cwd(), '../../.env') });

import Anthropic from '@anthropic-ai/sdk';

const oauthToken = process.env.CLAUDE_CODE_OAUTH_TOKEN;

if (!oauthToken) {
  console.error('❌ No CLAUDE_CODE_OAUTH_TOKEN found');
  process.exit(1);
}

console.log('✅ OAuth token loaded');
console.log(`Token prefix: ${oauthToken.substring(0, 20)}...`);

// Try using it with Anthropic SDK
const client = new Anthropic({
  apiKey: oauthToken
});

async function test() {
  try {
    console.log('\n🧪 Testing OAuth token with Anthropic SDK...\n');

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: 'Say "Hello from Claude Code subscription!" in one sentence.'
      }]
    });

    console.log('✅ Success! Response:');
    console.log(message.content[0].type === 'text' ? message.content[0].text : message.content);
    console.log(`\n📊 Usage: ${message.usage.input_tokens} in, ${message.usage.output_tokens} out`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.status) {
      console.error(`Status: ${error.status}`);
    }
    process.exit(1);
  }
}

test();
