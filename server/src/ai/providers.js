// AI Providers — HuggingFace, Ollama, vLLM implementations
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Base interface all providers must implement:
 * async generate(systemPrompt, userPrompt, options?) → string (raw text)
 */

// ─── HuggingFace Inference Provider ──────────────────

export class HuggingFaceProvider {
  constructor() {
    this.name = 'huggingface';
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    this.token = env.HF_TOKEN;
  }

  async generate(systemPrompt, userPrompt, options = {}) {
    const model = options.model || env.AI_MODEL_PRIMARY;
    const url = `${this.baseUrl}/${model}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: messages.map(m => `<|${m.role}|>\n${m.content}`).join('\n'),
        parameters: {
          max_new_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.3,
          return_full_text: false,
        },
      }),
      signal: AbortSignal.timeout(options.timeout || 30000),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HuggingFace API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    throw new Error('Unexpected HuggingFace response format');
  }

  isAvailable() {
    return !!this.token && this.token !== 'hf_your_token_here';
  }
}

// ─── Ollama Provider (Local) ─────────────────────────

export class OllamaProvider {
  constructor() {
    this.name = 'ollama';
    this.baseUrl = env.OLLAMA_BASE_URL;
  }

  async generate(systemPrompt, userPrompt, options = {}) {
    const model = options.model || env.AI_MODEL_PRIMARY;

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
        options: {
          temperature: options.temperature || 0.3,
          num_predict: options.maxTokens || 2000,
        },
      }),
      signal: AbortSignal.timeout(options.timeout || 60000),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Ollama error (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.message?.content || '';
  }

  async isAvailable() {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }
}

// ─── vLLM Provider (OpenAI-compatible) ───────────────

export class VLLMProvider {
  constructor() {
    this.name = 'vllm';
    this.baseUrl = env.VLLM_BASE_URL;
  }

  async generate(systemPrompt, userPrompt, options = {}) {
    const model = options.model || env.AI_MODEL_PRIMARY;

    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: options.temperature || 0.3,
        max_tokens: options.maxTokens || 2000,
      }),
      signal: AbortSignal.timeout(options.timeout || 60000),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`vLLM error (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async isAvailable() {
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }
}

// ─── Provider Factory ────────────────────────────────

export function getAIProvider() {
  switch (env.AI_PROVIDER) {
    case 'huggingface':
      return new HuggingFaceProvider();
    case 'ollama':
      return new OllamaProvider();
    case 'vllm':
      return new VLLMProvider();
    case 'fallback':
      return null; // Pipeline will use deterministic fallback
    default:
      logger.warn(`Unknown AI provider: ${env.AI_PROVIDER}, using fallback`);
      return null;
  }
}
