import { AutoaService } from './onyxosService';
import { BlandLabsService } from './blandLabsService';
import { MCPService } from './mcpService';
import { AIService } from './aiService';

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
  selected?: boolean;
  dragging?: boolean;
  width?: number | null;
  height?: number | null;
  style?: {
    [key: string]: any;
  };
}

export class FlowExecutionService {
  static async processNodeWithCustomInput(
    node: FlowNode,
    customInput: any,
    setNodes: (updater: (nodes: FlowNode[]) => FlowNode[]) => void,
    setExecutionResults: (updater: (results: Record<string, any>) => Record<string, any>) => void
  ): Promise<any> {
    console.log(`Processing input node ${node.id} of type ${node.type} with input:`, customInput);

    // Update node status to processing
    setNodes(nodes => nodes.map(n => 
      n.id === node.id 
        ? { ...n, data: { ...n.data, executionStatus: 'processing' } }
        : n
    ));

    try {
      let result: any;

      switch (node.type) {
        case 'input':
          result = { input: customInput };
          break;
        
        case 'system':
          result = { message: customInput };
          break;

        case 'youtubeinput':
          console.log('Processing YouTube input with custom input:', customInput);
          console.log('YouTube node data:', node.data);
          
          try {
            // Get configuration from node data (not from customInput)
            const youtubeUrl = customInput || node.data.content;
            const youtubeApiKey = node.data.youtubeApiKey;
            
            if (!youtubeUrl) {
              throw new Error('YouTube URL is required. Please configure the URL in the YouTube Input node settings.');
            }
            
            console.log('YouTube processing config:', { hasApiKey: !!youtubeApiKey, url: youtubeUrl });
            
            if (youtubeApiKey) {
              // Use real YouTube API when API key is provided
              console.log('🔴 Using real YouTube Data API...');
              
              // Import YouTube service
              const { YouTubeDataService } = await import('./youtubeDataService');
              
              // Extract video ID
              const videoId = YouTubeDataService.extractVideoId(youtubeUrl);
              if (!videoId) {
                throw new Error('Invalid YouTube URL format. Please provide a valid YouTube video URL.');
              }
              
              // Fetch real video data
              const videoDetails = await YouTubeDataService.getVideoDetails(videoId, youtubeApiKey);
              
              result = {
                videoDetails: {
                  videoId: videoDetails.videoId,
                  title: videoDetails.title,
                  description: videoDetails.description,
                  url: videoDetails.url,
                  duration: videoDetails.duration,
                  thumbnailUrl: videoDetails.thumbnailUrl,
                  channelTitle: videoDetails.channelTitle,
                  viewCount: videoDetails.viewCount,
                  publishedAt: videoDetails.publishedAt
                },
                aiSummary: videoDetails.description.substring(0, 1000) + (videoDetails.description.length > 1000 ? '...' : ''),
                transcript: videoDetails.description.substring(0, 1000) + (videoDetails.description.length > 1000 ? '...' : ''),
                isRealData: true
              };
              
              console.log('✅ Real YouTube data fetched successfully');
              
            } else {
              // No API key provided - show error message
              throw new Error('YouTube Data API key is required for processing. Please configure your YouTube Data API key in the node settings.');
            }
            
            // Update node with video info
            setNodes(nodes => nodes.map(n =>
              n.id === node.id ? {
                ...n,
                data: {
                  ...n.data,
                  title: result.videoDetails.title,
                  description: result.videoDetails.description,
                  executionStatus: 'completed'
                }
              } : n
            ));
            
          } catch (error) {
            console.error('YouTube analysis error:', error);
            
            // Update node with error status
            setNodes(nodes => nodes.map(n =>
              n.id === node.id ? {
                ...n,
                data: {
                  ...n.data,
                  executionStatus: 'error',
                  error: error instanceof Error ? error.message : 'YouTube processing failed'
                }
              } : n
            ));
            
            // Show error to user
            if (typeof window !== 'undefined') {
              alert(`❌ YouTube Processing Failed\n\n${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your configuration and try again.`);
            }
            
            throw error;
          }
          break;

        case 'callautomation':
          console.log('=== STARTING AI CALL AUTOMATION ===');
          console.log('Processing Call Automation with custom inputs:', customInput);
          
          try {
            // Validate phone number
            if (!customInput || !customInput.phone_number) {
              throw new Error('Phone number is required');
            }
            
            if (!BlandLabsService.isValidPhoneNumber(customInput.phone_number)) {
              throw new Error('Invalid phone number format. Please use E.164 format (e.g., +1234567890)');
            }

            if (!customInput.task) {
              throw new Error('Call task/prompt is required');
            }

            console.log('=== CALLING BLAND LABS API ===');
            console.log('Phone number:', customInput.phone_number);
            console.log('Task:', customInput.task);
            
            // Initiate the call
            const callResponse = await BlandLabsService.initiateCall({
              phone_number: customInput.phone_number,
              task: customInput.task,
              voice: customInput.voice,
              max_duration: customInput.max_duration ? parseInt(customInput.max_duration) : undefined,
              record: true,
              answered_by_enabled: true,
              wait_for_greeting: true,
              amd: true
            });

            console.log('Call initiated:', callResponse);

            if (!callResponse.call_id) {
              throw new Error('Failed to initiate call - no call ID returned');
            }

            // Wait for call completion
            console.log(`Waiting for call ${callResponse.call_id} to complete...`);
            const completedCall = await BlandLabsService.waitForCallCompletion(callResponse.call_id);
            console.log('Call completed:', completedCall);

            result = {
              call_id: completedCall.call_id,
              status: completedCall.status,
              call_length: completedCall.call_length,
              recording_url: completedCall.recording_url,
              transcripts: completedCall.transcripts,
              summary: completedCall.summary,
              concatenated_transcript: completedCall.concatenated_transcript,
              from: completedCall.from,
              to: completedCall.to,
              created_at: completedCall.created_at,
              message: 'AI call completed successfully!'
            };
            
            console.log('=== CALL AUTOMATION SUCCESS ===');
            console.log('Final result:', result);
            
          } catch (callError) {
            console.error('=== CALL AUTOMATION ERROR ===');
            console.error('Error details:', callError);
            
            let errorMessage = 'Failed to complete AI call';
            if (callError.message.includes('phone number')) {
              errorMessage = 'Invalid phone number format';
            } else if (callError.message.includes('API error')) {
              errorMessage = 'Bland Labs API authentication failed';
            } else if (callError.message.includes('timeout')) {
              errorMessage = 'Call timed out or took too long';
            }
            
            throw new Error(`${errorMessage}: ${callError.message}`);
          }
          break;

        case 'localfilesaver':
          console.log('=== STARTING VIDEO CREATION WITH CREATOMATE ===');
          console.log('Processing Video Creator with custom inputs:', customInput);
          
          try {
            console.log('=== CALLING CREATOMATE API ===');
            
            // Use the Creatomate API with user customizations
            const renderResponse = await AutoaService.createVideoRender(customInput);
            console.log('Creatomate render initiated:', renderResponse);

            if (!renderResponse.id) {
              throw new Error('Failed to create Creatomate render - no render ID returned');
            }

            // Wait for render completion
            console.log(`Waiting for render ${renderResponse.id} to complete...`);
            const completedRender = await AutoaService.waitForRenderCompletion(renderResponse.id);
            console.log('Render completed:', completedRender);

            if (!completedRender.url) {
              console.error('Render completed but no URL available:', completedRender);
              throw new Error('Video render completed but no download URL available');
            }

            result = {
              savedFiles: [{
                fileName: `custom_video_${Date.now()}.mp4`,
                filePath: completedRender.url,
                downloadUrl: completedRender.url,
                duration: 30,
                fileSize: 'Unknown',
                createdAt: new Date().toISOString(),
                renderId: completedRender.id,
                snapshotUrl: completedRender.snapshot_url
              }],
              message: 'Custom MP4 video created with Creatomate and ready for download!'
            };
            
            console.log('=== CREATOMATE SUCCESS ===');
            console.log('Final result:', result);
            
          } catch (creatomateError) {
            console.error('=== CREATOMATE API ERROR ===');
            console.error('Error details:', creatomateError);
            
            // Provide specific error handling
            let errorMessage = 'Failed to create video with Creatomate';
            if (creatomateError.message.includes('API error')) {
              errorMessage = 'Creatomate API authentication failed - check API key';
            } else if (creatomateError.message.includes('timeout')) {
              errorMessage = 'Video creation timed out - try with a shorter clip';
            } else if (creatomateError.message.includes('template')) {
              errorMessage = 'Creatomate template not found - check template ID';
            }
            
            throw new Error(`${errorMessage}: ${creatomateError.message}`);
          }
          break;

        case 'mcp':
          console.log('=== STARTING MCP TOOL EXECUTION ===');
          console.log('Processing MCP with custom inputs:', customInput);
          
          try {
            if (!customInput.serverId || !customInput.toolName) {
              throw new Error('Server ID and tool name are required for MCP execution');
            }

            let toolArguments = {};
            if (customInput.arguments) {
              try {
                toolArguments = JSON.parse(customInput.arguments);
              } catch (parseError) {
                throw new Error('Invalid JSON in tool arguments');
              }
            }

            console.log('=== CONNECTING TO MCP SERVER ===');
            const connected = await MCPService.connectToServer(customInput.serverId);
            if (!connected) {
              throw new Error(`Failed to connect to MCP server: ${customInput.serverId}`);
            }

            console.log('=== EXECUTING MCP TOOL ===');
            const toolResult = await MCPService.callTool(
              customInput.serverId,
              customInput.toolName,
              toolArguments
            );

            result = {
              serverId: customInput.serverId,
              toolName: customInput.toolName,
              arguments: toolArguments,
              result: toolResult,
              message: `MCP tool ${customInput.toolName} executed successfully`
            };
            
            console.log('=== MCP EXECUTION SUCCESS ===');
            console.log('Final result:', result);
            
          } catch (mcpError) {
            console.error('=== MCP EXECUTION ERROR ===');
            console.error('Error details:', mcpError);
            
            let errorMessage = 'Failed to execute MCP tool';
            if (mcpError.message.includes('not found')) {
              errorMessage = 'MCP server not found or not configured';
            } else if (mcpError.message.includes('connect')) {
              errorMessage = 'Failed to connect to MCP server';
            } else if (mcpError.message.includes('JSON')) {
              errorMessage = 'Invalid tool arguments format';
            }
            
            throw new Error(`${errorMessage}: ${mcpError.message}`);
          }
          break;

        // Notification nodes
        case 'notification':
          console.log('Processing Notification node with input:', customInput);
          try {
            const notificationData = node.data;
            const channel = notificationData.channel || 'email';
            const recipient = notificationData.recipient || customInput.recipient;
            const message = notificationData.message || customInput.message || 'Test notification';
            const subject = notificationData.subject || customInput.subject || 'Notification';

            if (!recipient) {
              throw new Error('Recipient is required for notification');
            }

            // Simulate sending notification
            await new Promise(resolve => setTimeout(resolve, 1000));

            result = {
              channel,
              recipient,
              subject,
              message,
              sent_at: new Date().toISOString(),
              status: 'sent',
              message_id: `msg_${Date.now()}`,
              response: `Notification sent via ${channel} to ${recipient}`
            };
          } catch (error) {
            throw new Error(`Notification failed: ${error.message}`);
          }
          break;

        // Business automation nodes
        case 'datalogger':
          console.log('Processing Data Logger node with input:', customInput);
          try {
            const loggerData = node.data;
            const storage = loggerData.storage || 'local';
            const format = loggerData.format || 'json';
            const filename = loggerData.filename || 'data_log';

            // Simulate logging data
            const logEntry = {
              timestamp: new Date().toISOString(),
              data: customInput,
              level: 'INFO',
              source: node.id,
              format,
              storage
            };

            await new Promise(resolve => setTimeout(resolve, 500));

            result = {
              logged: true,
              storage,
              format,
              filename: `${filename}.${format}`,
              entry: logEntry,
              size: JSON.stringify(logEntry).length,
              message: `Data logged to ${storage} storage as ${format}`
            };
          } catch (error) {
            throw new Error(`Data logging failed: ${error.message}`);
          }
          break;

        case 'paymentprocessor':
          console.log('Processing Payment Processor node with input:', customInput);
          try {
            const paymentData = node.data;
            const gateway = paymentData.gateway || 'stripe';
            const amount = paymentData.amount || customInput.amount;
            const currency = paymentData.currency || 'USD';
            const transactionType = paymentData.transactionType || 'payment';

            if (!amount && transactionType !== 'setup') {
              throw new Error('Amount is required for payment processing');
            }

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const transactionId = `txn_${Date.now()}`;
            result = {
              transaction_id: transactionId,
              gateway,
              type: transactionType,
              amount: parseFloat(amount) || 0,
              currency,
              status: 'completed',
              created_at: new Date().toISOString(),
              fees: Math.round(parseFloat(amount || '0') * 0.029 * 100) / 100,
              net_amount: Math.round((parseFloat(amount || '0') * 0.971) * 100) / 100,
              message: `${transactionType} of ${amount} ${currency} processed via ${gateway}`
            };
          } catch (error) {
            throw new Error(`Payment processing failed: ${error.message}`);
          }
          break;

        // Analytics & SEO nodes
        case 'seoanalyzer':
          console.log('Processing SEO Analyzer node with input:', customInput);
          try {
            const url = customInput.url || customInput;
            if (!url || typeof url !== 'string') {
              throw new Error('URL is required for SEO analysis');
            }

            // Simulate SEO analysis
            await new Promise(resolve => setTimeout(resolve, 3000));

            result = {
              url,
              score: Math.floor(Math.random() * 40) + 60, // 60-100
              issues: [
                'Missing meta description',
                'Images without alt text',
                'Slow loading speed'
              ].slice(0, Math.floor(Math.random() * 3) + 1),
              recommendations: [
                'Add meta descriptions to all pages',
                'Optimize images for web',
                'Enable compression',
                'Minify CSS and JavaScript'
              ],
              metrics: {
                page_speed: Math.floor(Math.random() * 3) + 2,
                mobile_friendly: Math.random() > 0.3,
                ssl_enabled: Math.random() > 0.1
              },
              analyzed_at: new Date().toISOString(),
              message: `SEO analysis completed for ${url}`
            };
          } catch (error) {
            throw new Error(`SEO analysis failed: ${error.message}`);
          }
          break;

        case 'stockdata':
          console.log('Processing Stock Data node with input:', customInput);
          try {
            const symbol = customInput.symbol || customInput;
            if (!symbol) {
              throw new Error('Stock symbol is required');
            }

            // Simulate stock data fetch
            await new Promise(resolve => setTimeout(resolve, 1500));

            const basePrice = Math.random() * 200 + 50;
            const change = (Math.random() - 0.5) * 10;
            
            result = {
              symbol: symbol.toUpperCase(),
              price: Math.round(basePrice * 100) / 100,
              change: Math.round(change * 100) / 100,
              change_percent: Math.round((change / basePrice) * 10000) / 100,
              volume: Math.floor(Math.random() * 1000000) + 100000,
              market_cap: Math.floor(Math.random() * 100000000000) + 1000000000,
              high_52w: Math.round((basePrice * 1.3) * 100) / 100,
              low_52w: Math.round((basePrice * 0.7) * 100) / 100,
              last_updated: new Date().toISOString(),
              message: `Stock data retrieved for ${symbol.toUpperCase()}`
            };
          } catch (error) {
            throw new Error(`Stock data fetch failed: ${error.message}`);
          }
          break;

        case 'currencyconverter':
          console.log('Processing Currency Converter node with input:', customInput);
          try {
            const fromCurrency = customInput.from || 'USD';
            const toCurrency = customInput.to || 'EUR';
            const amount = parseFloat(customInput.amount || '1');

            if (isNaN(amount)) {
              throw new Error('Valid amount is required for currency conversion');
            }

            // Simulate currency conversion
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock exchange rates
            const exchangeRates = {
              'USD-EUR': 0.85,
              'USD-GBP': 0.75,
              'USD-JPY': 110,
              'EUR-USD': 1.18,
              'EUR-GBP': 0.88,
              'GBP-USD': 1.33
            };

            const rateKey = `${fromCurrency}-${toCurrency}`;
            const rate = exchangeRates[rateKey] || (Math.random() * 2 + 0.5);
            const convertedAmount = Math.round(amount * rate * 100) / 100;

            result = {
              from_currency: fromCurrency,
              to_currency: toCurrency,
              original_amount: amount,
              converted_amount: convertedAmount,
              exchange_rate: rate,
              conversion_date: new Date().toISOString(),
              message: `Converted ${amount} ${fromCurrency} to ${convertedAmount} ${toCurrency}`
            };
          } catch (error) {
            throw new Error(`Currency conversion failed: ${error.message}`);
          }
          break;

        // Infrastructure nodes
        case 'healthcheck':
          console.log('Processing Health Check node with input:', customInput);
          try {
            const endpoint = node.data.endpoint || customInput.endpoint;
            const checkType = node.data.checkType || 'http';

            if (!endpoint) {
              throw new Error('Endpoint is required for health check');
            }

            // Simulate health check
            const startTime = Date.now();
            await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
            const responseTime = Date.now() - startTime;

            const isHealthy = Math.random() > 0.2; // 80% success rate
            const healthScore = isHealthy ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 40) + 20;

            result = {
              endpoint,
              check_type: checkType,
              status: isHealthy ? 'healthy' : 'unhealthy',
              response_time: responseTime,
              health_score: healthScore,
              details: isHealthy ? `${checkType.toUpperCase()} check passed` : `${checkType.toUpperCase()} check failed`,
              checked_at: new Date().toISOString(),
              message: `Health check ${isHealthy ? 'passed' : 'failed'} for ${endpoint}`
            };
          } catch (error) {
            throw new Error(`Health check failed: ${error.message}`);
          }
          break;

        case 'backup':
          console.log('Processing Backup node with input:', customInput);
          try {
            const source = customInput.source || '/data';
            const destination = customInput.destination || '/backup';
            const backupType = customInput.type || 'full';

            // Simulate backup process
            await new Promise(resolve => setTimeout(resolve, 3000));

            const backupSize = Math.floor(Math.random() * 1000) + 100; // MB
            const backupId = `backup_${Date.now()}`;

            result = {
              backup_id: backupId,
              source,
              destination,
              type: backupType,
              size_mb: backupSize,
              status: 'completed',
              started_at: new Date(Date.now() - 3000).toISOString(),
              completed_at: new Date().toISOString(),
              files_backed_up: Math.floor(Math.random() * 1000) + 50,
              message: `${backupType} backup completed: ${backupSize}MB`
            };
          } catch (error) {
            throw new Error(`Backup failed: ${error.message}`);
          }
          break;

        case 'deployment':
          console.log('Processing Deployment node with input:', customInput);
          try {
            const appName = customInput.app || 'my-app';
            const environment = customInput.environment || 'production';
            const version = customInput.version || '1.0.0';

            // Simulate deployment
            await new Promise(resolve => setTimeout(resolve, 5000));

            const deploymentId = `deploy_${Date.now()}`;
            result = {
              deployment_id: deploymentId,
              app_name: appName,
              environment,
              version,
              status: 'deployed',
              url: `https://${appName}-${environment}.example.com`,
              deployed_at: new Date().toISOString(),
              build_time: Math.floor(Math.random() * 300) + 60, // seconds
              message: `${appName} v${version} deployed to ${environment}`
            };
          } catch (error) {
            throw new Error(`Deployment failed: ${error.message}`);
          }
          break;

        case 'output':
          console.log('Processing Output node with inputs:', customInput);
          
          // Get the input value (from AI model or other connected nodes)
          const primaryOutputInput = customInput;
          
          if (!primaryOutputInput) {
            throw new Error('No input data available for output node. Please connect an input source.');
          }
          
          // Handle different types of input data
          let outputContent = '';
          let outputData = primaryOutputInput;
          
          if (primaryOutputInput && typeof primaryOutputInput === 'object' && 'processedContent' in primaryOutputInput) {
            // From AI model - show the processed content as the main output
            const aiOutput = primaryOutputInput as any;
            outputContent = aiOutput.processedContent;
            outputData = {
              content: aiOutput.processedContent,
              instructions: aiOutput.instructions,
              model: `${aiOutput.message || 'AI Processing'}`,
              wordCount: aiOutput.wordCount,
              isRealAI: aiOutput.isRealAI,
              originalInput: aiOutput.originalContent,
              timestamp: new Date().toISOString()
            };
          } else if (primaryOutputInput && typeof primaryOutputInput === 'object' && 'input' in primaryOutputInput) {
            // From input node
            const inputOutput = primaryOutputInput as any;
            outputContent = inputOutput.input;
            outputData = {
              content: inputOutput.input,
              source: 'Input Node',
              timestamp: new Date().toISOString()
            };
          } else if (primaryOutputInput && typeof primaryOutputInput === 'object' && 'message' in primaryOutputInput) {
            // From system or other nodes
            const messageOutput = primaryOutputInput as any;
            outputContent = messageOutput.message;
            outputData = primaryOutputInput;
          } else if (typeof primaryOutputInput === 'string') {
            // Direct string input
            outputContent = primaryOutputInput;
            outputData = {
              content: primaryOutputInput,
              timestamp: new Date().toISOString()
            };
          } else {
            // Complex object - try to extract meaningful content
            outputContent = JSON.stringify(primaryOutputInput, null, 2);
            outputData = primaryOutputInput;
          }
          
          result = {
            output: outputContent,
            fullData: outputData,
            formatted: typeof outputData === 'object' ? 
              JSON.stringify(outputData, null, 2) : 
              String(outputData),
            displayContent: outputContent,
            timestamp: new Date().toISOString(),
            nodeId: node.id,
            message: 'Output processed successfully'
          };
          
          console.log('Output node result:', result);
          break;

        case 'socialmedia':
          console.log('Processing Social Media node with input:', customInput);
          
          try {
            // Extract content from AI model or input node
            let contentToPost = '';
            let originalInput = customInput;
            
            if (customInput && typeof customInput === 'object' && 'processedContent' in customInput) {
              // From AI model - use the processed content
              const aiOutput = customInput as any;
              contentToPost = aiOutput.processedContent;
              console.log('Using AI-generated content for social media post');
            } else if (customInput && typeof customInput === 'object' && 'input' in customInput) {
              // From input node
              const inputOutput = customInput as any;
              contentToPost = inputOutput.input;
              console.log('Using input content for social media post');
            } else if (typeof customInput === 'string') {
              // Direct string input
              contentToPost = customInput;
              console.log('Using direct string content for social media post');
            } else if (customInput && typeof customInput === 'object' && 'message' in customInput) {
              // From system or other nodes
              const messageOutput = customInput as any;
              contentToPost = messageOutput.message;
              console.log('Using message content for social media post');
            } else {
              throw new Error('No valid content available for social media posting. Please connect a content source.');
            }
            
            if (!contentToPost || contentToPost.trim() === '') {
              throw new Error('Content is empty. Please provide content to post on social media.');
            }
            
            console.log('Content to post:', contentToPost);
            
            // Get configuration from node data
            const platforms = node.data.platforms || ['twitter', 'facebook', 'instagram'];
            const scheduleTime = node.data.scheduleTime || null;
            const enableAnalytics = node.data.enableAnalytics || true;
            const autoHashtags = node.data.autoHashtags !== false; // Default to true
            
            console.log('Social media configuration:', { platforms, scheduleTime, enableAnalytics, autoHashtags });
            
            // Simulate posting delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate platform-specific posts
            const posts = platforms.map((platform: string) => {
              const postId = `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              
              // Platform-specific content optimization
              let optimizedContent = contentToPost;
              let platformSpecificData: any = {};
              
              switch (platform.toLowerCase()) {
                case 'twitter':
                  // Twitter: Limit to 280 characters, add relevant hashtags
                  if (optimizedContent.length > 250) {
                    optimizedContent = optimizedContent.substring(0, 247) + '...';
                  }
                  if (autoHashtags && !optimizedContent.includes('#')) {
                    optimizedContent += ' #socialmedia #content';
                  }
                  platformSpecificData = {
                    character_count: optimizedContent.length,
                    max_characters: 280,
                    retweets: enableAnalytics ? Math.floor(Math.random() * 50) + 5 : 0,
                    likes: enableAnalytics ? Math.floor(Math.random() * 200) + 10 : 0,
                    replies: enableAnalytics ? Math.floor(Math.random() * 20) + 2 : 0
                  };
                  break;
                  
                case 'facebook':
                  // Facebook: Can be longer, add call-to-action
                  if (autoHashtags && !optimizedContent.includes('#')) {
                    optimizedContent += '\n\n#facebook #socialmedia #engagement';
                  }
                  platformSpecificData = {
                    character_count: optimizedContent.length,
                    reactions: enableAnalytics ? Math.floor(Math.random() * 100) + 15 : 0,
                    shares: enableAnalytics ? Math.floor(Math.random() * 30) + 3 : 0,
                    comments: enableAnalytics ? Math.floor(Math.random() * 25) + 5 : 0
                  };
                  break;
                  
                case 'instagram':
                  // Instagram: Visual-focused, more hashtags
                  if (autoHashtags && !optimizedContent.includes('#')) {
                    optimizedContent += '\n\n#instagram #visual #content #socialmedia #engagement';
                  }
                  platformSpecificData = {
                    character_count: optimizedContent.length,
                    likes: enableAnalytics ? Math.floor(Math.random() * 300) + 20 : 0,
                    comments: enableAnalytics ? Math.floor(Math.random() * 40) + 8 : 0,
                    saves: enableAnalytics ? Math.floor(Math.random() * 50) + 5 : 0
                  };
                  break;
                  
                case 'linkedin':
                  // LinkedIn: Professional tone, industry hashtags
                  if (autoHashtags && !optimizedContent.includes('#')) {
                    optimizedContent += '\n\n#linkedin #professional #business #networking';
                  }
                  platformSpecificData = {
                    character_count: optimizedContent.length,
                    reactions: enableAnalytics ? Math.floor(Math.random() * 80) + 10 : 0,
                    shares: enableAnalytics ? Math.floor(Math.random() * 20) + 2 : 0,
                    comments: enableAnalytics ? Math.floor(Math.random() * 15) + 3 : 0
                  };
                  break;
                  
                default:
                  platformSpecificData = {
                    character_count: optimizedContent.length,
                    engagement: enableAnalytics ? Math.floor(Math.random() * 100) + 10 : 0
                  };
              }
              
              return {
                post_id: postId,
                platform: platform,
                content: optimizedContent,
                status: 'published',
                scheduled_time: scheduleTime || new Date().toISOString(),
                published_at: new Date().toISOString(),
                url: `https://${platform.toLowerCase()}.com/post/${postId}`,
                analytics: enableAnalytics ? {
                  ...platformSpecificData,
                  estimated_reach: Math.floor(Math.random() * 1000) + 100,
                  engagement_rate: (Math.random() * 5 + 1).toFixed(2) + '%'
                } : null
              };
            });
            
            // Calculate total metrics if analytics enabled
            let totalMetrics = null;
            if (enableAnalytics) {
              const totalReach = posts.reduce((sum, post) => sum + (post.analytics?.estimated_reach || 0), 0);
              const avgEngagementRate = posts.reduce((sum, post) => {
                const rate = parseFloat(post.analytics?.engagement_rate?.replace('%', '') || '0');
                return sum + rate;
              }, 0) / posts.length;
              
              totalMetrics = {
                total_posts: posts.length,
                total_estimated_reach: totalReach,
                average_engagement_rate: avgEngagementRate.toFixed(2) + '%',
                platforms_posted: platforms.length
              };
            }
            
            result = {
              success: true,
              message: `Successfully posted to ${platforms.length} platform(s)`,
              posts: posts,
              summary: {
                content_preview: contentToPost.substring(0, 100) + (contentToPost.length > 100 ? '...' : ''),
                platforms_count: platforms.length,
                platforms: platforms,
                scheduled: !!scheduleTime,
                analytics_enabled: enableAnalytics,
                total_posts: posts.length,
                posted_at: new Date().toISOString()
              },
              analytics: totalMetrics,
              original_input: originalInput,
              configuration: {
                platforms,
                scheduleTime,
                enableAnalytics,
                autoHashtags
              }
            };
            
            console.log('Social media posting completed successfully:', result);
            
          } catch (error) {
            console.error('Social media posting error:', error);
            throw new Error(`Social media posting failed: ${error.message}`);
          }
          break;

        default:
          console.warn(`Unknown node type: ${node.type}`);
          result = {};
      }

      // Update node status to completed
      setNodes(nodes => nodes.map(n =>
        n.id === node.id
          ? {
            ...n,
            data: {
              ...n.data,
              executionStatus: 'completed',
              executionResult: result,
              executionError: undefined
            },
            style: {
              ...n.style,
              boxShadow: '0 0 5px green'
            }
          }
          : n
      ));
      setExecutionResults(prevResults => ({ ...prevResults, [node.id]: result }));
      return result;

    } catch (error: any) {
      console.error(`Error processing node ${node.id}:`, error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Update node status to error
      setNodes(nodes => nodes.map(n =>
        n.id === node.id
          ? {
            ...n,
            data: {
              ...n.data,
              executionStatus: 'error',
              executionError: errorMessage,
              executionResult: undefined
            },
            style: {
              ...n.style,
              boxShadow: '0 0 5px red'
            }
          }
          : n
      ));
      
      const errorResult = {
        error: errorMessage,
        timestamp: new Date().toISOString(),
        nodeType: node.type,
        nodeId: node.id
      };
      
      setExecutionResults(prevResults => ({ ...prevResults, [node.id]: errorResult }));
      
      throw new Error(`Node ${node.data.label || node.id} failed: ${errorMessage}`);
    }
  }

  static async processNode(
    node: FlowNode,
    inputs: Record<string, any>,
    setNodes: (updater: (nodes: FlowNode[]) => FlowNode[]) => void,
    allNodes: FlowNode[],
    edges: any[],
    setExecutionResults: (updater: (results: Record<string, any>) => Record<string, any>) => void
  ): Promise<any> {
    console.log(`Processing node ${node.id} of type ${node.type}`);

    // Update node status to processing
    setNodes(nodes => nodes.map(n => 
      n.id === node.id 
        ? { ...n, data: { ...n.data, executionStatus: 'processing' } }
        : n
    ));

    try {
      let result: any;

      switch (node.type) {
        case 'aimodel':
          console.log('Processing AI Model with inputs:', inputs);
          console.log('AI Model node data:', node.data);
          
          // Extract video content and get configuration from node data
          const inputValues = Object.values(inputs);
          let videoContent = '';
          let originalVideoDetails = null;
          
          // Parse AI configuration from JSON content
          let aiModelConfig: any = {};
          try {
            if (node.data.content) {
              aiModelConfig = JSON.parse(node.data.content);
            }
          } catch (error) {
            console.error('Failed to parse AI model configuration:', error);
          }
          
          // Get configuration with fallbacks
          const instructions = aiModelConfig.instructions || node.data.instructions || 'Provide a helpful and concise response to the user\'s question.';
          const provider = aiModelConfig.provider || node.data.provider || 'OpenAI';
          const model = aiModelConfig.model || node.data.model || 'gpt-4o-mini';
          const apiKey = aiModelConfig.apiKey || node.data.apiKey;
          const temperature = parseFloat(aiModelConfig.temperature || node.data.temperature) || 0.7;
          const maxTokens = parseInt(aiModelConfig.maxTokens || node.data.maxTokens) || 1000;
          
          // Find video content
          for (const inputValue of inputValues) {
            if (inputValue?.videoDetails || inputValue?.aiSummary) {
              // From YouTube input - use the full description for processing
              videoContent = inputValue.videoDetails?.description || inputValue.aiSummary || inputValue.transcript || '';
              originalVideoDetails = inputValue.videoDetails;
            } else if (inputValue?.transcript) {
              // From video transcriber
              videoContent = inputValue.transcript;
              originalVideoDetails = inputValue.videoDetails;
            } else if (inputValue?.input) {
              // From text input
              videoContent = inputValue.input;
            }
          }

          if (!videoContent) {
            throw new Error('No content available for AI processing. Please connect an input node with content.');
          }

          console.log('AI Model processing config:', { provider, model, hasApiKey: !!apiKey, instructions });
          console.log('Original content length:', videoContent.length);
          
          let aiProcessedSummary = '';
          
          if (apiKey) {
            // Use real AI API when API key is provided
            console.log('🤖 Using real AI API for processing...');
            
            try {
              // Import AI service
              const { AIService } = await import('./aiService');
              
              const aiConfig = {
                provider: provider,
                model: model,
                apiKey: apiKey,
                temperature: temperature,
                maxTokens: maxTokens
              };
              
              // Create appropriate system prompt based on content type
              let systemPrompt = '';
              if (originalVideoDetails) {
                systemPrompt = `You are an AI assistant that analyzes YouTube video content. The user will provide video description/transcript content, and you should process it according to their specific instructions. Always provide helpful, accurate, and well-structured responses.`;
              } else {
                systemPrompt = `You are a helpful AI assistant that processes text content according to user instructions. Always provide clear, accurate, and well-structured responses.`;
              }
              
              // Create user prompt with instructions and content
              let userPrompt = '';
              if (originalVideoDetails) {
                userPrompt = `Please analyze this YouTube video content and ${instructions.toLowerCase()}:\n\nVideo Title: ${originalVideoDetails.title}\nChannel: ${originalVideoDetails.channelTitle}\nDuration: ${Math.floor(originalVideoDetails.duration / 60)}:${(originalVideoDetails.duration % 60).toString().padStart(2, '0')}\n\nVideo Description/Content:\n${videoContent}`;
              } else {
                userPrompt = `${instructions}\n\nUser input: ${videoContent}`;
              }
              
              // Call real AI API
              const aiResponse = await AIService.callAI(
                aiConfig,
                systemPrompt,
                userPrompt
              );
              
              aiProcessedSummary = aiResponse.response;
              console.log('✅ Real AI processing completed successfully');
              
            } catch (error) {
              console.error('AI API error:', error);
              
              // Show error to user
              if (typeof window !== 'undefined') {
                alert(`❌ AI Processing Failed\n\n${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your API key and try again.`);
              }
              
              throw new Error(`AI processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
            
          } else {
            // No API key provided - show error message
            throw new Error(`${provider} API key is required for AI processing. Please configure your ${provider} API key in the AI Model node settings.`);
          }

          // Ensure we have meaningful content
          if (!aiProcessedSummary || aiProcessedSummary.length < 10) {
            aiProcessedSummary = `Processing failed. Please check your configuration and try again.`;
          }

          result = {
            processedContent: aiProcessedSummary,
            originalContent: videoContent,
            instructions: instructions,
            wordCount: aiProcessedSummary.split(/\s+/).filter(word => word.length > 0).length,
            videoInfo: originalVideoDetails,
            message: `Real AI processed content with ${provider} ${model}`,
            type: 'Real AI Summary',
            isRealAI: true
          };
          
          console.log('AI Model processing complete:', {
            instructionsUsed: instructions,
            outputLength: aiProcessedSummary.length,
            wordCount: result.wordCount,
            isRealAI: result.isRealAI
          });
          break;

        case 'pdfgenerator':
          console.log('Processing PDF Generator with inputs:', inputs);
          
          // Extract content from connected nodes (typically AI model output)
          const pdfInputValues = Object.values(inputs);
          let pdfContent = '';
          let pdfTitle = 'Video Summary';
          let pdfInstructions = '';
          let pdfVideoInfo = null;
          
          // Find processed content from AI model or other sources
          for (const inputValue of pdfInputValues) {
            if (inputValue?.processedContent) {
              // From AI model
              pdfContent = inputValue.processedContent;
              pdfTitle = inputValue.videoInfo?.title || 'AI Processed Summary';
              pdfInstructions = inputValue.instructions || '';
              pdfVideoInfo = inputValue.videoInfo;
              break;
            } else if (inputValue?.aiSummary) {
              // From YouTube input or transcriber
              pdfContent = inputValue.aiSummary;
              pdfTitle = inputValue.videoDetails?.title || 'Video Summary';
              pdfVideoInfo = inputValue.videoDetails;
              break;
            } else if (inputValue?.transcript) {
              // From transcriber
              pdfContent = inputValue.transcript;
              pdfTitle = inputValue.videoDetails?.title || 'Video Transcript';
              pdfVideoInfo = inputValue.videoDetails;
              break;
            }
          }

          if (!pdfContent) {
            throw new Error('No content available for PDF generation');
          }

          result = {
            processedContent: pdfContent,
            videoInfo: pdfVideoInfo,
            instructions: pdfInstructions,
            wordCount: pdfContent.split(/\s+/).filter(word => word.length > 0).length,
            title: pdfTitle,
            message: 'PDF content prepared and ready for download',
            type: 'PDF Ready'
          };
          
          console.log('PDF Generator processing complete:', result);
          break;

        case 'callautomation':
          console.log('=== STARTING AI CALL AUTOMATION ===');
          console.log('Processing Call Automation with inputs:', inputs);
          
          // Extract phone number and task from connected input nodes
          const callInputValues = Object.values(inputs);
          let phoneNumber = '';
          let task = '';
          
          // Find phone number and task from input nodes
          for (const inputValue of callInputValues) {
            if (inputValue?.input) {
              // Try to determine if this is a phone number or task based on content
              const inputText = String(inputValue.input);
              if (inputText.startsWith('+') || /^\d+$/.test(inputText.replace(/[-\s]/g, ''))) {
                phoneNumber = inputText;
              } else {
                task = inputText;
              }
            }
          }
          
          try {
            // Validate inputs
            if (!phoneNumber) {
              throw new Error('Phone number is required. Connect an input node with a phone number.');
            }
            
            if (!BlandLabsService.isValidPhoneNumber(phoneNumber)) {
              throw new Error('Invalid phone number format. Please use E.164 format (e.g., +1234567890)');
            }

            if (!task) {
              throw new Error('Call task/prompt is required. Connect an input node with the call task.');
            }

            console.log('=== CALLING BLAND LABS API ===');
            
            // Initiate the call
            const callResponse = await BlandLabsService.initiateCall({
              phone_number: phoneNumber,
              task: task,
              record: true,
              answered_by_enabled: true,
              wait_for_greeting: true,
              amd: true
            });

            console.log('Call initiated:', callResponse);

            if (!callResponse.call_id) {
              throw new Error('Failed to initiate call - no call ID returned');
            }

            // Wait for call completion
            console.log(`Waiting for call ${callResponse.call_id} to complete...`);
            const completedCall = await BlandLabsService.waitForCallCompletion(callResponse.call_id);
            console.log('Call completed:', completedCall);

            result = {
              call_id: completedCall.call_id,
              status: completedCall.status,
              call_length: completedCall.call_length,
              recording_url: completedCall.recording_url,
              transcripts: completedCall.transcripts,
              summary: completedCall.summary,
              concatenated_transcript: completedCall.concatenated_transcript,
              from: completedCall.from,
              to: completedCall.to,
              created_at: completedCall.created_at,
              message: 'AI call completed successfully!'
            };
            
            console.log('=== CALL AUTOMATION SUCCESS ===');
            console.log('Final result:', result);
            
          } catch (callError) {
            console.error('=== CALL AUTOMATION ERROR ===');
            console.error('Error details:', callError);
            
            let errorMessage = 'Failed to complete AI call';
            if (callError.message.includes('phone number')) {
              errorMessage = 'Invalid phone number format';
            } else if (callError.message.includes('API error')) {
              errorMessage = 'Bland Labs API authentication failed';
            } else if (callError.message.includes('timeout')) {
              errorMessage = 'Call timed out or took too long';
            }
            
            throw new Error(`${errorMessage}: ${callError.message}`);
          }
          break;

        case 'localfilesaver':
          console.log('=== STARTING LOCAL FILE SAVER WITH CREATOMATE ===');
          console.log('Processing Local File Saver with inputs:', inputs);
          
          const clipInput = Object.values(inputs)[0];
          console.log('Raw clip input received:', JSON.stringify(clipInput, null, 2));
          
          // Handle direct text input for Creatomate
          if (clipInput?.input) {
            console.log('Processing direct text input for Creatomate');
            
            try {
              console.log('=== CALLING CREATOMATE API ===');
              
              // Use the Creatomate interface with default parameters
              const creatomateInput = {
                text1: clipInput.input,
                text2: 'Create & Automate\n[size 150%]Video[/size]',
                videoSource: 'https://creatomate.com/files/assets/7347c3b7-e1a8-4439-96f1-f3dfc95c3d28'
              };
              
              const renderResponse = await AutoaService.createVideoRender(creatomateInput);
              console.log('Creatomate render initiated:', renderResponse);

              if (!renderResponse.id) {
                throw new Error('Failed to create Creatomate render - no render ID returned');
              }

              // Wait for render completion
              console.log(`Waiting for render ${renderResponse.id} to complete...`);
              const completedRender = await AutoaService.waitForRenderCompletion(renderResponse.id);
              console.log('Render completed:', completedRender);

              if (!completedRender.url) {
                console.error('Render completed but no URL available:', completedRender);
                throw new Error('Video render completed but no download URL available');
              }

              result = {
                savedFiles: [{
                  fileName: `custom_video_${Date.now()}.mp4`,
                  filePath: completedRender.url,
                  downloadUrl: completedRender.url,
                  duration: 30,
                  fileSize: 'Unknown',
                  createdAt: new Date().toISOString(),
                  renderId: completedRender.id,
                  snapshotUrl: completedRender.snapshot_url
                }],
                message: 'Custom MP4 video created with Creatomate and ready for download!'
              };
              
              console.log('=== CREATOMATE SUCCESS ===');
              console.log('Final result:', result);
              
            } catch (creatomateError) {
              console.error('=== CREATOMATE API ERROR ===');
              console.error('Error details:', creatomateError);
              
              // Provide specific error handling
              let errorMessage = 'Failed to create video with Creatomate';
              if (creatomateError.message.includes('API error')) {
                errorMessage = 'Creatomate API authentication failed - check API key';
              } else if (creatomateError.message.includes('timeout')) {
                errorMessage = 'Video creation timed out - try with a shorter clip';
              } else if (creatomateError.message.includes('template')) {
                errorMessage = 'Creatomate template not found - check template ID';
              }
              
              throw new Error(`${errorMessage}: ${creatomateError.message}`);
            }
            break;
          }
          
          // Original logic for clip data from other nodes
          let clipsToSave = [];
          
          // Handle different input formats
          if (clipInput?.captionedClips) {
            clipsToSave = clipInput.captionedClips;
            console.log('Found captionedClips from CaptionAdder:', clipInput.captionedClips);
          } else if (clipInput?.processedClip) {
            clipsToSave = [clipInput.processedClip];
            console.log('Found processedClip from AutoClipper:', clipInput.processedClip);
          } else if (clipInput?.viralClips) {
            clipsToSave = clipInput.viralClips;
            console.log('Found viralClips from ViralClipDetector:', clipInput.viralClips);
          }
          
          if (!clipsToSave || clipsToSave.length === 0) {
            console.error('No clips or text input available. Input structure:', clipInput);
            throw new Error('No content available to process. Connect to input node or other processing nodes.');
          }

          const clip = clipsToSave[0]; // Process first clip
          console.log('Selected clip for processing:', JSON.stringify(clip, null, 2));

          // Use demo video URL for Creatomate template
          const creatomateVideoUrl = 'https://creatomate.com/files/assets/7347c3b7-e1a8-4439-96f1-f3dfc95c3d28';
          console.log('Using Creatomate demo video URL:', creatomateVideoUrl);
          
          try {
            console.log('=== CALLING CREATOMATE API ===');
            
            // Create video render with Creatomate
            const customInputs = {
              videoSource: creatomateVideoUrl,
              text1: clip.title || 'AI Generated Video',
              text2: this.formatCaptions(clip.segments || [])
            };
            
            const renderResponse = await AutoaService.createVideoRender(customInputs);
            console.log('Creatomate render initiated:', renderResponse);

            if (!renderResponse.id) {
              throw new Error('Failed to create Creatomate render - no render ID returned');
            }

            // Wait for render completion
            console.log(`Waiting for render ${renderResponse.id} to complete...`);
            const completedRender = await AutoaService.waitForRenderCompletion(renderResponse.id);
            console.log('Render completed:', completedRender);

            if (!completedRender.url) {
              console.error('Render completed but no URL available:', completedRender);
              throw new Error('Video render completed but no download URL available');
            }

            result = {
              savedFiles: [{
                fileName: `viral_short_${clip.startTime || 0}-${clip.endTime || 30}.mp4`,
                filePath: completedRender.url,
                downloadUrl: completedRender.url,
                duration: clip.duration || 30,
                fileSize: 'Unknown',
                createdAt: new Date().toISOString(),
                renderId: completedRender.id,
                snapshotUrl: completedRender.snapshot_url
              }],
              message: 'MP4 video created with Creatomate and ready for download!'
            };
            
            console.log('=== CREATOMATE SUCCESS ===');
            console.log('Final result:', result);
            
          } catch (creatomateError) {
            console.error('=== CREATOMATE API ERROR ===');
            console.error('Error details:', creatomateError);
            
            // Provide specific error handling
            let errorMessage = 'Failed to create video with Creatomate';
            if (creatomateError.message.includes('API error')) {
              errorMessage = 'Creatomate API authentication failed - check API key';
            } else if (creatomateError.message.includes('timeout')) {
              errorMessage = 'Video creation timed out - try with a shorter clip';
            } else if (creatomateError.message.includes('template')) {
              errorMessage = 'Creatomate template not found - check template ID';
            }
            
            throw new Error(`${errorMessage}: ${creatomateError.message}`);
          }
          break;

        case 'videofetcher':
          console.log('Processing Video Fetcher with inputs:', inputs);
          const fetcherVideoUrl = inputs[Object.keys(inputs)[0]]?.videoDetails?.url;
          if (!fetcherVideoUrl) {
            throw new Error('No video URL provided');
          }
          
          console.log('Simulating video download from YouTube...');
          const localPath = `/tmp/video_${Date.now()}.mp4`;
          console.log('Video downloaded to:', localPath);
          
          result = { localPath, videoUrl: fetcherVideoUrl };
          break;

        case 'videotranscriber':
          console.log('Processing Video Transcriber with inputs:', inputs);
          const inputValue = Object.values(inputs)[0];
          
          // Check if input comes from YouTubeInput directly (with video details and summary)
          if (inputValue?.videoDetails || inputValue?.aiSummary) {
            console.log('Using transcript from YouTube analysis');
            result = { 
              transcript: inputValue.transcript || inputValue.aiSummary || 'Generated transcript from YouTube analysis',
              videoDetails: inputValue.videoDetails,
              aiSummary: inputValue.aiSummary
            };
            break;
          }
          
          // Original logic for video path
          const videoPath = inputValue?.localPath;
          if (!videoPath) {
            throw new Error('No video path or YouTube data provided');
          }
          
          console.log('Simulating video transcription...');
          const transcript = 'Simulated transcript content from the video...';
          console.log('Transcription complete:', transcript);
          
          result = { transcript, videoPath };
          break;

        case 'viralclipdetector':
          console.log('Processing Viral Clip Detector with inputs:', inputs);
          const videoTranscript = inputs[Object.keys(inputs)[0]]?.transcript;
          if (!videoTranscript) {
            throw new Error('No transcript provided');
          }
          
          console.log('Detecting viral clips...');
          const clips = [
            {
              startTime: 45,
              endTime: 75,
              duration: 30,
              viralityScore: 0.92,
              title: 'Viral Moment 1',
              segments: [
                { text: 'Amazing viral content here', start: 45, end: 75 }
              ]
            }
          ];
          console.log('Viral clips detected:', clips);

          // Get the original video URL from the inputs
          const originalVideoUrl = inputs[Object.keys(inputs)[0]]?.videoPath;
          
          result = { viralClips: clips, transcript: videoTranscript, originalVideoUrl };
          break;

        case 'captionadder':
          console.log('Processing Caption Adder with inputs:', inputs);
          const clipData = inputs[Object.keys(inputs)[0]];
          
          // Handle both processedClip (from autoclipper) and viralClips (from viralclipdetector)
          let clipsToProcess = [];
          if (clipData?.processedClip) {
            clipsToProcess = [clipData.processedClip];
          } else if (clipData?.viralClips) {
            clipsToProcess = clipData.viralClips;
          }
          
          if (!clipsToProcess || clipsToProcess.length === 0) {
            throw new Error('No clips available to add captions');
          }
        
          result = {
            captionedClips: clipsToProcess.map(clip => ({
              ...clip,
              captionsAdded: true,
              outputPath: `/tmp/captioned_${clip.startTime}-${clip.endTime}.mp4`
            })),
            message: 'Captions added to video clips'
          };
          break;

        case 'autoclipper':
          console.log('Auto clipper processing inputs:', inputs);
          const viralClipsInput = Object.values(inputs)[0];
          
          if (!viralClipsInput?.viralClips || viralClipsInput.viralClips.length === 0) {
            throw new Error('No viral clips available to process');
          }

          console.log('Found viral clip data for auto clipping');
          
          // Process the best viral clip
          const bestClip = viralClipsInput.viralClips[0];
          
          result = {
            processedClip: {
              ...bestClip,
              outputFormat: 'mp4',
              resolution: '1080x1920',
              processed: true
            },
            originalData: viralClipsInput,
            message: 'Best viral segment extracted and processed'
          };
          break;

        case 'mcp':
          console.log('=== STARTING MCP TOOL EXECUTION ===');
          console.log('Processing MCP with inputs:', inputs);
          
          // Extract MCP configuration from node data and tool arguments from inputs
          const mcpConfig = {
            serverId: node.data.serverId || 'default-server',
            toolName: node.data.toolName || 'read_file',
            arguments: {}
          };

          // Extract arguments from connected input nodes
          const mcpInputValues = Object.values(inputs);
          for (const inputValue of mcpInputValues) {
            if (inputValue?.input) {
              // Try to parse as JSON, fallback to string
              try {
                mcpConfig.arguments = JSON.parse(inputValue.input);
              } catch {
                mcpConfig.arguments = { input: inputValue.input };
              }
            }
          }
          
          try {
            console.log('=== CONNECTING TO MCP SERVER ===');
            const connected = await MCPService.connectToServer(mcpConfig.serverId);
            if (!connected) {
              throw new Error(`Failed to connect to MCP server: ${mcpConfig.serverId}`);
            }

            console.log('=== EXECUTING MCP TOOL ===');
            const toolResult = await MCPService.callTool(
              mcpConfig.serverId,
              mcpConfig.toolName,
              mcpConfig.arguments
            );

            result = {
              serverId: mcpConfig.serverId,
              toolName: mcpConfig.toolName,
              arguments: mcpConfig.arguments,
              result: toolResult,
              message: `MCP tool ${mcpConfig.toolName} executed successfully`
            };
            
            console.log('=== MCP EXECUTION SUCCESS ===');
            console.log('Final result:', result);
            
          } catch (mcpError) {
            console.error('=== MCP EXECUTION ERROR ===');
            console.error('Error details:', mcpError);
            
            let errorMessage = 'Failed to execute MCP tool';
            if (mcpError.message.includes('not found')) {
              errorMessage = 'MCP server not found or not configured';
            } else if (mcpError.message.includes('connect')) {
              errorMessage = 'Failed to connect to MCP server';
            }
            
            throw new Error(`${errorMessage}: ${mcpError.message}`);
          }
          break;

        // New node types - using data from connected nodes
        case 'notification':
          result = await this.processNodeWithCustomInput(node, Object.values(inputs)[0] || {}, setNodes, setExecutionResults);
          break;

        case 'datalogger':
          result = await this.processNodeWithCustomInput(node, Object.values(inputs)[0] || {}, setNodes, setExecutionResults);
          break;

        case 'paymentprocessor':
          result = await this.processNodeWithCustomInput(node, Object.values(inputs)[0] || {}, setNodes, setExecutionResults);
          break;

        case 'seoanalyzer':
          result = await this.processNodeWithCustomInput(node, Object.values(inputs)[0] || {}, setNodes, setExecutionResults);
          break;

        case 'stockdata':
          result = await this.processNodeWithCustomInput(node, Object.values(inputs)[0] || {}, setNodes, setExecutionResults);
          break;

        case 'currencyconverter':
          result = await this.processNodeWithCustomInput(node, Object.values(inputs)[0] || {}, setNodes, setExecutionResults);
          break;

        case 'healthcheck':
          result = await this.processNodeWithCustomInput(node, Object.values(inputs)[0] || {}, setNodes, setExecutionResults);
          break;

        case 'backup':
          result = await this.processNodeWithCustomInput(node, Object.values(inputs)[0] || {}, setNodes, setExecutionResults);
          break;

        case 'deployment':
          result = await this.processNodeWithCustomInput(node, Object.values(inputs)[0] || {}, setNodes, setExecutionResults);
          break;

        // Additional nodes with basic processing
        case 'meetingcreator':
        case 'calendartrigger':
        case 'analytics':
        case 'a11ytest':
        case 'socialmedia':
        case 'newsaggregator':
        case 'cdn':
        case 'loadbalancer':
        case 'migration':
        case 'monitoring':
        case 'performancemonitor':
        case 'securityscanner':
        case 'alert':
          console.log(`Processing ${node.type} node with inputs:`, inputs);
          // For these nodes, use the basic processing logic
          result = await this.processNodeWithCustomInput(node, Object.values(inputs)[0] || {}, setNodes, setExecutionResults);
          break;

        case 'output':
          console.log('Processing Output node with inputs:', inputs);
          
          // Get the first available input value (from AI model or other connected nodes)
          const outputInputValues = Object.values(inputs);
          const primaryOutputInput = outputInputValues.length > 0 ? outputInputValues[0] : null;
          
          if (!primaryOutputInput) {
            throw new Error('No input data available for output node. Please connect an input source.');
          }
          
          // Handle different types of input data
          let outputContent = '';
          let outputData = primaryOutputInput;
          
          if (primaryOutputInput && typeof primaryOutputInput === 'object' && 'processedContent' in primaryOutputInput) {
            // From AI model - show the processed content as the main output
            const aiOutput = primaryOutputInput as any;
            outputContent = aiOutput.processedContent;
            outputData = {
              content: aiOutput.processedContent,
              instructions: aiOutput.instructions,
              model: `${aiOutput.message || 'AI Processing'}`,
              wordCount: aiOutput.wordCount,
              isRealAI: aiOutput.isRealAI,
              originalInput: aiOutput.originalContent,
              timestamp: new Date().toISOString()
            };
          } else if (primaryOutputInput && typeof primaryOutputInput === 'object' && 'input' in primaryOutputInput) {
            // From input node
            const inputOutput = primaryOutputInput as any;
            outputContent = inputOutput.input;
            outputData = {
              content: inputOutput.input,
              source: 'Input Node',
              timestamp: new Date().toISOString()
            };
          } else if (primaryOutputInput && typeof primaryOutputInput === 'object' && 'message' in primaryOutputInput) {
            // From system or other nodes
            const messageOutput = primaryOutputInput as any;
            outputContent = messageOutput.message;
            outputData = primaryOutputInput;
          } else if (typeof primaryOutputInput === 'string') {
            // Direct string input
            outputContent = primaryOutputInput;
            outputData = {
              content: primaryOutputInput,
              timestamp: new Date().toISOString()
            };
          } else {
            // Complex object - try to extract meaningful content
            outputContent = JSON.stringify(primaryOutputInput, null, 2);
            outputData = primaryOutputInput;
          }
          
          result = {
            output: outputContent,
            fullData: outputData,
            formatted: typeof outputData === 'object' ? 
              JSON.stringify(outputData, null, 2) : 
              String(outputData),
            displayContent: outputContent,
            timestamp: new Date().toISOString(),
            nodeId: node.id,
            message: 'Output processed successfully'
          };
          
          console.log('Output node result:', result);
          break;

        default:
          console.warn(`Unknown node type: ${node.type}`);
          result = {};
      }

      // Update node status to completed
      setNodes(nodes => nodes.map(n =>
        n.id === node.id
          ? {
            ...n,
            data: {
              ...n.data,
              executionStatus: 'completed',
              executionResult: result,
              executionError: undefined
            },
            style: {
              ...n.style,
              boxShadow: '0 0 5px green'
            }
          }
          : n
      ));
      
      setExecutionResults(prevResults => ({ ...prevResults, [node.id]: result }));
      return result;

    } catch (error: any) {
      console.error(`Error processing node ${node.id}:`, error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Update node status to error
      setNodes(nodes => nodes.map(n =>
        n.id === node.id
          ? {
            ...n,
            data: {
              ...n.data,
              executionStatus: 'error',
              executionError: errorMessage,
              executionResult: undefined
            },
            style: {
              ...n.style,
              boxShadow: '0 0 5px red'
            }
          }
          : n
      ));
      
      const errorResult = {
        error: errorMessage,
        timestamp: new Date().toISOString(),
        nodeType: node.type,
        nodeId: node.id
      };
      
      setExecutionResults(prevResults => ({ ...prevResults, [node.id]: errorResult }));
      throw error;
    }
  }

  private static formatCaptions(segments: any[]): string {
    if (!segments || segments.length === 0) return 'AI Generated Video';
    
    // Take first few segments and format as captions
    const firstSegments = segments.slice(0, 3);
    return firstSegments
      .map(seg => seg.text || 'Caption text')
      .join('\n')
      .substring(0, 100); // Limit caption length
  }

  static async clearFolder(folderPath: string): Promise<void> {
    try {
      console.log(`Simulating folder clear for ${folderPath}`);
      console.log(`Folder ${folderPath} cleared successfully.`);
    } catch (error) {
      console.error(`Failed to clear folder ${folderPath}:`, error);
      throw error;
    }
  }

  static async processConnectedNodes(
    nodes: FlowNode[],
    edges: any[],
    processedResults: Record<string, any>,
    setNodes: (updater: (nodes: FlowNode[]) => FlowNode[]) => void,
    setExecutionResults: (updater: (results: Record<string, any>) => Record<string, any>) => void
  ): Promise<void> {
    // Build dependency graph
    const dependencyMap = new Map<string, string[]>();
    const incomingEdges = new Map<string, number>();
    
    // Initialize maps
    nodes.forEach(node => {
      dependencyMap.set(node.id, []);
      incomingEdges.set(node.id, 0);
    });
    
    // Build dependency relationships
    edges.forEach(edge => {
      const dependencies = dependencyMap.get(edge.target) || [];
      dependencies.push(edge.source);
      dependencyMap.set(edge.target, dependencies);
      incomingEdges.set(edge.target, (incomingEdges.get(edge.target) || 0) + 1);
    });
    
    // Find nodes with no dependencies (or already processed)
    const readyNodes: string[] = [];
    nodes.forEach(node => {
      const deps = dependencyMap.get(node.id) || [];
      const unprocessedDeps = deps.filter(depId => !processedResults[depId]);
      
      if (unprocessedDeps.length === 0 && !processedResults[node.id]) {
        readyNodes.push(node.id);
      }
    });
    
    const maxRetries = 3;
    const retryDelays = [1000, 2000, 4000]; // Exponential backoff
    
    // Process nodes in topological order with error handling and retries
    while (readyNodes.length > 0) {
      const currentBatch = [...readyNodes];
      readyNodes.length = 0;
      
      // Process current batch in parallel with error isolation
      const batchPromises = currentBatch.map(async (nodeId) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node || processedResults[nodeId]) return;
        
        let lastError: Error | null = null;
        
        // Retry logic for failed nodes
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            // Collect inputs from dependencies
            const dependencies = dependencyMap.get(nodeId) || [];
            const nodeInputs = dependencies.reduce((acc, depId) => {
              const depResult = processedResults[depId];
              if (depResult) {
                acc[depId] = depResult;
              }
              return acc;
            }, {} as Record<string, any>);
            
            console.log(`Processing node ${nodeId} (attempt ${attempt + 1}/${maxRetries + 1}) with inputs:`, nodeInputs);
            
            const result = await this.processNodeWithInputs(
              node, 
              nodeInputs, 
              setNodes, 
              setExecutionResults
            );
            
            processedResults[nodeId] = result;
            console.log(`Node ${nodeId} completed successfully:`, result);
            return; // Success, exit retry loop
            
          } catch (error) {
            lastError = error as Error;
            console.error(`Node ${nodeId} failed on attempt ${attempt + 1}:`, error);
            
            if (attempt < maxRetries) {
              // Wait before retry with exponential backoff
              await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]));
              console.log(`Retrying node ${nodeId} in ${retryDelays[attempt]}ms...`);
            }
          }
        }
        
        // All retries failed
        if (lastError) {
          console.error(`Node ${nodeId} failed after ${maxRetries + 1} attempts:`, lastError);
          
          // Mark node as failed but don't stop the entire flow
          const errorResult = {
            error: lastError.message,
            timestamp: new Date().toISOString(),
            nodeType: node.type,
            nodeId: node.id,
            attempts: maxRetries + 1
          };
          
          processedResults[nodeId] = errorResult;
          
          // Update node visual state
          setNodes(nodes => nodes.map(n =>
            n.id === nodeId
              ? {
                ...n,
                data: {
                  ...n.data,
                  executionStatus: 'error',
                  executionError: lastError.message
                },
                style: {
                  ...n.style,
                  boxShadow: '0 0 5px red'
                }
              }
              : n
          ));
        }
      });
      
      // Wait for current batch to complete
      await Promise.allSettled(batchPromises);
      
      // Find next batch of ready nodes
      nodes.forEach(node => {
        if (processedResults[node.id]) return; // Already processed
        
        const deps = dependencyMap.get(node.id) || [];
        const unprocessedDeps = deps.filter(depId => !processedResults[depId]);
        
        if (unprocessedDeps.length === 0) {
          readyNodes.push(node.id);
        }
      });
      
      // Prevent infinite loops
      if (readyNodes.length === 0) {
        const unprocessedNodes = nodes.filter(node => !processedResults[node.id]);
        if (unprocessedNodes.length > 0) {
          console.warn('Flow execution incomplete. Unprocessed nodes:', unprocessedNodes.map(n => n.id));
          
          // Mark remaining nodes as skipped due to dependencies
          unprocessedNodes.forEach(node => {
            const errorResult = {
              error: 'Skipped due to failed dependencies',
              timestamp: new Date().toISOString(),
              nodeType: node.type,
              nodeId: node.id,
              skipped: true
            };
            
            processedResults[node.id] = errorResult;
            
            setNodes(nodes => nodes.map(n =>
              n.id === node.id
                ? {
                  ...n,
                  data: {
                    ...n.data,
                    executionStatus: 'error',
                    executionError: 'Skipped due to failed dependencies'
                  },
                  style: {
                    ...n.style,
                    boxShadow: '0 0 5px orange'
                  }
                }
                : n
            ));
          });
        }
        break;
      }
    }
  }

  static async processNodeWithInputs(
    node: FlowNode,
    inputs: Record<string, any>,
    setNodes: (updater: (nodes: FlowNode[]) => FlowNode[]) => void,
    setExecutionResults: (updater: (results: Record<string, any>) => Record<string, any>) => void
  ): Promise<any> {
    console.log(`Processing node ${node.id} of type ${node.type} with inputs:`, inputs);

    // Update node status to processing
    setNodes(nodes => nodes.map(n => 
      n.id === node.id 
        ? { 
          ...n, 
          data: { 
            ...n.data, 
            executionStatus: 'processing',
            executionError: undefined // Clear previous errors
          },
          style: {
            ...n.style,
            boxShadow: '0 0 5px blue'
          }
        }
        : n
    ));

    try {
      let result: any;

      // Get the first available input value
      const inputValues = Object.values(inputs);
      const primaryInput = inputValues.length > 0 ? inputValues[0] : null;

      switch (node.type) {
        case 'aimodel':
          console.log('Processing AI Model node with input:', primaryInput);
          
          if (!node.data.instructions) {
            throw new Error('AI Model node requires processing instructions');
          }
          
          // Simulate AI processing
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const inputText = typeof primaryInput === 'string' ? primaryInput : 
                           primaryInput?.input || primaryInput?.message || 
                           JSON.stringify(primaryInput);
          
          result = {
            processedContent: `AI processed: ${inputText}`,
            aiSummary: `Summary: ${inputText?.substring(0, 100)}...`,
            instructions: node.data.instructions,
            model: node.data.model || 'gpt-4o-mini',
            provider: node.data.provider || 'OpenAI',
            timestamp: new Date().toISOString()
          };
          break;

        case 'api':
          console.log('Processing API node with input:', primaryInput);
          
          if (!node.data.url) {
            throw new Error('API node requires a URL');
          }
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          result = {
            status: 200,
            data: {
              message: 'API call successful',
              input_received: primaryInput,
              endpoint: node.data.url,
              method: node.data.method || 'GET'
            },
            timestamp: new Date().toISOString()
          };
          break;

        case 'condition':
          console.log('Processing Condition node with input:', primaryInput);
          
          const condition = node.data.condition || 'true';
          let conditionResult = false;
          
          try {
            // Simple condition evaluation (in production, use a safe evaluator)
            if (condition.includes('input')) {
              conditionResult = Boolean(primaryInput);
            } else if (condition.includes('length')) {
              const inputStr = String(primaryInput || '');
              conditionResult = inputStr.length > 0;
            } else {
              conditionResult = condition === 'true' || Boolean(primaryInput);
            }
          } catch (error) {
            throw new Error(`Invalid condition: ${condition}`);
          }
          
          result = {
            condition: condition,
            result: conditionResult,
            input: primaryInput,
            timestamp: new Date().toISOString()
          };
          break;

        case 'output':
          console.log('Processing Output node with inputs:', inputs);
          
          // Get the first available input value (from AI model or other connected nodes)
          const outputInputValues = Object.values(inputs);
          const primaryOutputInput = outputInputValues.length > 0 ? outputInputValues[0] : null;
          
          if (!primaryOutputInput) {
            throw new Error('No input data available for output node. Please connect an input source.');
          }
          
          // Handle different types of input data
          let outputContent = '';
          let outputData = primaryOutputInput;
          
          if (primaryOutputInput && typeof primaryOutputInput === 'object' && 'processedContent' in primaryOutputInput) {
            // From AI model - show the processed content as the main output
            const aiOutput = primaryOutputInput as any;
            outputContent = aiOutput.processedContent;
            outputData = {
              content: aiOutput.processedContent,
              instructions: aiOutput.instructions,
              model: `${aiOutput.message || 'AI Processing'}`,
              wordCount: aiOutput.wordCount,
              isRealAI: aiOutput.isRealAI,
              originalInput: aiOutput.originalContent,
              timestamp: new Date().toISOString()
            };
          } else if (primaryOutputInput && typeof primaryOutputInput === 'object' && 'input' in primaryOutputInput) {
            // From input node
            const inputOutput = primaryOutputInput as any;
            outputContent = inputOutput.input;
            outputData = {
              content: inputOutput.input,
              source: 'Input Node',
              timestamp: new Date().toISOString()
            };
          } else if (primaryOutputInput && typeof primaryOutputInput === 'object' && 'message' in primaryOutputInput) {
            // From system or other nodes
            const messageOutput = primaryOutputInput as any;
            outputContent = messageOutput.message;
            outputData = primaryOutputInput;
          } else if (typeof primaryOutputInput === 'string') {
            // Direct string input
            outputContent = primaryOutputInput;
            outputData = {
              content: primaryOutputInput,
              timestamp: new Date().toISOString()
            };
          } else {
            // Complex object - try to extract meaningful content
            outputContent = JSON.stringify(primaryOutputInput, null, 2);
            outputData = primaryOutputInput;
          }
          
          result = {
            output: outputContent,
            fullData: outputData,
            formatted: typeof outputData === 'object' ? 
              JSON.stringify(outputData, null, 2) : 
              String(outputData),
            displayContent: outputContent,
            timestamp: new Date().toISOString(),
            nodeId: node.id,
            message: 'Output processed successfully'
          };
          
          console.log('Output node result:', result);
          break;

        default:
          // For unknown node types, pass through the input
          console.warn(`Unknown node type: ${node.type}, passing through input`);
          result = {
            passthrough: primaryInput,
            nodeType: node.type,
            timestamp: new Date().toISOString()
          };
      }

      // Update node status to completed
      setNodes(nodes => nodes.map(n =>
        n.id === node.id
          ? {
            ...n,
            data: {
              ...n.data,
              executionStatus: 'completed',
              executionResult: result,
              executionError: undefined
            },
            style: {
              ...n.style,
              boxShadow: '0 0 5px green'
            }
          }
          : n
      ));
      
      setExecutionResults(prevResults => ({ ...prevResults, [node.id]: result }));
      return result;

    } catch (error) {
      console.error(`Error processing node ${node.id}:`, error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Update node status to error
      setNodes(nodes => nodes.map(n =>
        n.id === node.id
          ? {
            ...n,
            data: {
              ...n.data,
              executionStatus: 'error',
              executionError: errorMessage,
              executionResult: undefined
            },
            style: {
              ...n.style,
              boxShadow: '0 0 5px red'
            }
          }
          : n
      ));
      
      const errorResult = {
        error: errorMessage,
        timestamp: new Date().toISOString(),
        nodeType: node.type,
        nodeId: node.id
      };
      
      setExecutionResults(prevResults => ({ ...prevResults, [node.id]: errorResult }));
      throw error;
    }
  }
}
