
interface AIModelConfig {
  provider: string;
  model: string;
  apiKey?: string;
  endpoint?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIResponse {
  response: string;
  usage?: {
    tokens: number;
    cost?: number;
  };
  provider: string;
  model: string;
}

export class AIService {
  static async callAI(config: AIModelConfig, systemPrompt: string, userInput: string): Promise<AIResponse> {
    const { provider, model, apiKey, temperature = 0.7, maxTokens = 1000 } = config;

    if (!apiKey && provider.toLowerCase() !== 'custom') {
      throw new Error(`API key is required for ${provider}`);
    }

    switch (provider.toLowerCase()) {
      case 'openai':
        return this.callOpenAI(config, systemPrompt, userInput);
      case 'anthropic':
      case 'claude':
        return this.callAnthropic(config, systemPrompt, userInput);
      case 'custom':
        return this.callCustomEndpoint(config, systemPrompt, userInput);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  private static async callOpenAI(config: AIModelConfig, systemPrompt: string, userInput: string): Promise<AIResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      response: data.choices[0]?.message?.content || 'No response generated',
      usage: {
        tokens: data.usage?.total_tokens || 0,
        cost: this.calculateOpenAICost(config.model || 'gpt-4o-mini', data.usage?.total_tokens || 0)
      },
      provider: 'OpenAI',
      model: config.model || 'gpt-4o-mini'
    };
  }

  private static async callAnthropic(config: AIModelConfig, systemPrompt: string, userInput: string): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-haiku-20240307',
        max_tokens: config.maxTokens || 1000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userInput}` }
        ],
        temperature: config.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      response: data.content[0]?.text || 'No response generated',
      usage: {
        tokens: data.usage?.input_tokens + data.usage?.output_tokens || 0,
      },
      provider: 'Anthropic',
      model: config.model || 'claude-3-haiku-20240307'
    };
  }

  private static async callCustomEndpoint(config: AIModelConfig, systemPrompt: string, userInput: string): Promise<AIResponse> {
    if (!config.endpoint) {
      throw new Error('Custom endpoint URL is required');
    }

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.choices?.[0]?.message?.content || data.response || 'No response generated',
      usage: {
        tokens: data.usage?.total_tokens || 0,
      },
      provider: 'Custom',
      model: config.model || 'custom'
    };
  }

  private static calculateOpenAICost(model: string, tokens: number): number {
    // Rough cost estimation (prices may vary)
    const costPerToken: Record<string, number> = {
      'gpt-4o': 0.00003,
      'gpt-4o-mini': 0.00000015,
      'gpt-4': 0.00003,
      'gpt-3.5-turbo': 0.000002,
    };

    return (costPerToken[model] || 0.00001) * tokens;
  }
}
