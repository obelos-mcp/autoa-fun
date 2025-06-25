import { FlowExecutionService, FlowNode } from './flowExecutionService';

export interface APIEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  flowTemplate: {
    nodes: FlowNode[];
    edges: any[];
  };
  isActive: boolean;
  createdAt: string;
  executionCount: number;
}

export interface APIRequest {
  method: string;
  path: string;
  query: Record<string, string>;
  body: any;
  headers: Record<string, string>;
}

export interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  executionId: string;
}

export class APIService {
  private static endpoints: Map<string, APIEndpoint> = new Map();
  private static isServerRunning = false;
  private static serverPort = 3001;
  private static baseUrl = `http://localhost:${this.serverPort}`;

  // YouTube AI Summarizer Template
  static getYouTubeAISummarizerTemplate(): { nodes: FlowNode[], edges: any[] } {
    return {
      nodes: [
        {
          id: "youtube-1",
          type: "youtubeinput",
          position: { x: 100, y: 100 },
          data: {
            label: "YouTube URL Input",
            description: "Enter YouTube video URL to analyze",
          },
        },
        {
          id: "ai-1",
          type: "aimodel",
          position: { x: 100, y: 250 },
          data: {
            label: "AI Content Processor",
            description: "Process video content with custom instructions",
            instructions: "Summarize the video content in 5 bullet points highlighting the main topics and key insights.",
          },
        },
        {
          id: "output-1",
          type: "output",
          position: { x: 100, y: 400 },
          data: {
            label: "Summary Output",
            description: "Return the AI-generated summary",
            outputName: "summary"
          },
        },
      ],
      edges: [
        {
          id: "e1",
          source: "youtube-1",
          target: "ai-1",
          type: "smoothstep",
        },
        {
          id: "e2",
          source: "ai-1",
          target: "output-1",
          type: "smoothstep",
        },
      ],
    };
  }

  // Deploy YouTube AI Summarizer API
  static async deployYouTubeAISummarizer(): Promise<APIEndpoint> {
    const template = this.getYouTubeAISummarizerTemplate();
    
    const endpoint: APIEndpoint = {
      id: 'youtube-ai-summarizer',
      name: 'YouTube AI Summarizer',
      path: '/api/youtube/summarize',
      method: 'POST',
      description: 'Analyze and summarize YouTube videos using AI',
      flowTemplate: template,
      isActive: true,
      createdAt: new Date().toISOString(),
      executionCount: 0
    };

    this.endpoints.set(endpoint.id, endpoint);
    console.log('✅ YouTube AI Summarizer API deployed:', endpoint.path);
    
    return endpoint;
  }

  // Execute API request by endpoint ID (convenience method)
  static async executeAPIRequest(endpointId: string, data: any): Promise<APIResponse>;
  // Execute API request with full request object
  static async executeAPIRequest(request: APIRequest): Promise<APIResponse>;
  // Implementation
  static async executeAPIRequest(requestOrEndpointId: APIRequest | string, data?: any): Promise<APIResponse> {
    const startTime = Date.now();
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      let endpoint: APIEndpoint | undefined;
      let requestData: any;

      // Handle both overloaded signatures
      if (typeof requestOrEndpointId === 'string') {
        // Called with endpoint ID and data
        const endpointId = requestOrEndpointId;
        endpoint = this.endpoints.get(endpointId);
        requestData = data;

        if (!endpoint) {
          return {
            success: false,
            error: `Endpoint not found: ${endpointId}`,
            executionTime: Date.now() - startTime,
            executionId
          };
        }
      } else {
        // Called with full APIRequest object
        const request = requestOrEndpointId;
        endpoint = Array.from(this.endpoints.values()).find(
          ep => ep.path === request.path && ep.method === request.method && ep.isActive
        );

        if (!endpoint) {
          return {
            success: false,
            error: `Endpoint not found: ${request.method} ${request.path}`,
            executionTime: Date.now() - startTime,
            executionId
          };
        }

        // Extract data from request
        if (request.method === 'POST' && request.body) {
          requestData = request.body;
        } else if (request.method === 'GET' && request.query) {
          requestData = request.query;
        }
      }

      // Extract YouTube URL from request data
      let youtubeUrl = '';
      if (requestData) {
        youtubeUrl = requestData.url || requestData.youtube_url || requestData.youtubeUrl;
      }

      if (!youtubeUrl) {
        return {
          success: false,
          error: 'YouTube URL is required. Provide it as "url" in the request data.',
          executionTime: Date.now() - startTime,
          executionId
        };
      }

      // Validate YouTube URL
      if (!this.isValidYouTubeUrl(youtubeUrl)) {
        return {
          success: false,
          error: 'Invalid YouTube URL format. Please provide a valid YouTube video URL.',
          executionTime: Date.now() - startTime,
          executionId
        };
      }

      console.log(`🚀 Executing API request for YouTube URL: ${youtubeUrl}`);

      // Execute the flow
      const result = await this.executeYouTubeFlow(youtubeUrl, endpoint.flowTemplate);

      // Update execution count
      endpoint.executionCount++;
      this.endpoints.set(endpoint.id, endpoint);

      return {
        success: true,
        data: result,
        executionTime: Date.now() - startTime,
        executionId
      };

    } catch (error) {
      console.error('API execution error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: Date.now() - startTime,
        executionId
      };
    }
  }

  // Execute YouTube flow
  private static async executeYouTubeFlow(youtubeUrl: string, template: { nodes: FlowNode[], edges: any[] }): Promise<any> {
    const { nodes, edges } = template;
    const processedResults: Record<string, any> = {};

    // Mock setNodes and setExecutionResults functions for API execution
    const mockSetNodes = () => {};
    const mockSetExecutionResults = () => {};

    // Get API keys from window (stored during deployment)
    const youtubeApiKey = (window as any).YOUTUBE_API_KEY;
    const aiApiKey = (window as any).AI_API_KEY;
    const aiProvider = (window as any).AI_PROVIDER || 'OpenAI';
    const aiModel = (window as any).AI_MODEL || 'gpt-4o-mini';

    if (!youtubeApiKey) {
      throw new Error('YouTube API key is required but not configured');
    }

    if (!aiApiKey) {
      throw new Error(`${aiProvider} API key is required but not configured`);
    }

    try {
      // Step 1: Process YouTube input
      const youtubeNode = nodes.find(n => n.type === 'youtubeinput');
      if (youtubeNode) {
        console.log('📺 Processing YouTube input...');
        
        // Enhanced YouTube processing with API key
        const youtubeResult = await FlowExecutionService.processNodeWithCustomInput(
          youtubeNode,
          youtubeUrl,
          mockSetNodes,
          mockSetExecutionResults,
          { youtubeApiKey } // Pass API key as context
        );
        processedResults[youtubeNode.id] = youtubeResult;
        console.log('✅ YouTube analysis complete');
      }

      // Step 2: Process AI model with real AI API
      const aiNode = nodes.find(n => n.type === 'aimodel');
      if (aiNode && processedResults[youtubeNode!.id]) {
        console.log('🤖 Processing AI model with real AI API...');
        
        // Configure AI node with API credentials
        const enhancedAiNode = {
          ...aiNode,
          data: {
            ...aiNode.data,
            provider: aiProvider,
            model: aiModel,
            apiKey: aiApiKey,
            useRealAI: true // Flag to use real AI processing
          }
        };
        
        const aiInputs = { [youtubeNode!.id]: processedResults[youtubeNode!.id] };
        const aiResult = await FlowExecutionService.processNode(
          enhancedAiNode,
          aiInputs,
          mockSetNodes,
          nodes,
          edges,
          mockSetExecutionResults
        );
        processedResults[aiNode.id] = aiResult;
        console.log('✅ AI processing complete');
      }

      // Step 3: Process output
      const outputNode = nodes.find(n => n.type === 'output');
      if (outputNode && processedResults[aiNode!.id]) {
        console.log('📤 Processing output...');
        const outputInputs = { [aiNode!.id]: processedResults[aiNode!.id] };
        const outputResult = await FlowExecutionService.processNode(
          outputNode,
          outputInputs,
          mockSetNodes,
          nodes,
          edges,
          mockSetExecutionResults
        );
        processedResults[outputNode.id] = outputResult;
        console.log('✅ Output processing complete');
      }

      // Format final response
      const aiResult = processedResults[aiNode!.id];
      const youtubeResult = processedResults[youtubeNode!.id];

      return {
        summary: {
          content: aiResult?.processedContent || 'Summary not available',
          word_count: aiResult?.wordCount || 0,
          content_type: aiResult?.contentType || 'video',
          instructions_used: aiResult?.instructions || 'Default processing',
          ai_provider: aiProvider,
          ai_model: aiModel
        },
        video_info: {
          title: youtubeResult?.videoDetails?.title || 'Video title not available',
          description: youtubeResult?.videoDetails?.description?.substring(0, 500) + '...' || 'Description not available',
          duration: youtubeResult?.videoDetails?.duration || 0,
          channel: youtubeResult?.videoDetails?.channelTitle || 'Unknown channel',
          url: youtubeUrl,
          thumbnail: youtubeResult?.videoDetails?.thumbnailUrl || null,
          view_count: youtubeResult?.videoDetails?.viewCount || 0,
          published_at: youtubeResult?.videoDetails?.publishedAt || null
        },
        processing_info: {
          execution_id: `exec_${Date.now()}`,
          processed_at: new Date().toISOString(),
          api_version: '1.0',
          flow_template: 'YouTube AI Summarizer',
          youtube_api_used: true,
          ai_api_used: true,
          ai_provider: aiProvider,
          ai_model: aiModel
        }
      };

    } catch (error) {
      console.error('Flow execution error:', error);
      throw new Error(`Flow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate YouTube URL
  private static isValidYouTubeUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  }

  // Get all deployed endpoints
  static getDeployedEndpoints(): APIEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  // Get endpoint by ID
  static getEndpoint(id: string): APIEndpoint | undefined {
    return this.endpoints.get(id);
  }

  // Remove endpoint
  static removeEndpoint(id: string): boolean {
    return this.endpoints.delete(id);
  }

  // Get API documentation
  static getAPIDocumentation(): any {
    const endpoints = this.getDeployedEndpoints();
    
    return {
      title: 'AUTOA.FUN API Documentation',
      version: '1.0.0',
      description: 'REST API for AI-powered automation flows',
      base_url: this.baseUrl,
      endpoints: endpoints.map(endpoint => ({
        path: endpoint.path,
        method: endpoint.method,
        name: endpoint.name,
        description: endpoint.description,
        parameters: this.getEndpointParameters(endpoint),
        example_request: this.getExampleRequest(endpoint),
        example_response: this.getExampleResponse(endpoint)
      }))
    };
  }

  // Get endpoint parameters
  private static getEndpointParameters(endpoint: APIEndpoint): any {
    if (endpoint.id === 'youtube-ai-summarizer') {
      return {
        url: {
          type: 'string',
          required: true,
          description: 'YouTube video URL to analyze and summarize',
          example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      };
    }
    return {};
  }

  // Get example request
  private static getExampleRequest(endpoint: APIEndpoint): any {
    if (endpoint.id === 'youtube-ai-summarizer') {
      return {
        method: 'POST',
        url: `${this.baseUrl}${endpoint.path}`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      };
    }
    return {};
  }

  // Get example response
  private static getExampleResponse(endpoint: APIEndpoint): any {
    if (endpoint.id === 'youtube-ai-summarizer') {
      return {
        success: true,
        data: {
          summary: {
            content: "• Main topic 1: Overview of the subject\n• Key insight 2: Important findings\n• Conclusion 3: Final thoughts",
            word_count: 45,
            content_type: "video",
            instructions_used: "Summarize the video content in 5 bullet points"
          },
          video_info: {
            title: "Example Video Title",
            description: "Video description...",
            duration: 300,
            channel: "Example Channel",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
          },
          processing_info: {
            execution_id: "exec_1234567890_abc123",
            processed_at: "2024-01-15T10:30:00Z",
            api_version: "1.0",
            flow_template: "YouTube AI Summarizer"
          }
        },
        executionTime: 3500,
        executionId: "exec_1234567890_abc123"
      };
    }
    return {};
  }

  // Start mock API server
  static async startAPIServer(): Promise<string> {
    if (this.isServerRunning) {
      return `API server already running at ${this.baseUrl}`;
    }

    console.log('🚀 Starting API server...');
    
    // Remove automatic deployment - let users deploy manually
    // await this.deployYouTubeAISummarizer();
    
    this.isServerRunning = true;
    
    const message = `✅ API Server started successfully!
    
🌐 Base URL: ${this.baseUrl}
📚 Documentation: ${this.baseUrl}/docs

${this.endpoints.size > 0 ? `📋 Available Endpoints:
${this.getDeployedEndpoints().map(ep => `  ${ep.method} ${ep.path} - ${ep.description}`).join('\n')}` : '📋 No endpoints deployed yet. Deploy your first API endpoint to get started!'}

💡 Ready to accept API deployments and requests.`;

    return message;
  }

  // Stop API server
  static stopAPIServer(): string {
    if (!this.isServerRunning) {
      return 'API server is not running';
    }

    this.isServerRunning = false;
    return '🛑 API server stopped';
  }

  // Get server status
  static getServerStatus(): { running: boolean, url: string, endpoints: number, uptime?: string } {
    return {
      running: this.isServerRunning,
      url: this.baseUrl,
      endpoints: this.endpoints.size,
      uptime: this.isServerRunning ? 'Running since startup' : undefined
    };
  }
} 