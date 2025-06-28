import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useToast } from './use-toast';

interface DetailedLog {
  timestamp: string;
  level: "INFO" | "ERROR" | "DEBUG" | "WARNING";
  category: string;
  message: string;
  details?: any;
}

interface YouTubeTelegramBotState {
  botToken: string;
  isRunning: boolean;
  botInfo: any | null;
  messages: string[];
  detailedLogs: DetailedLog[];
  pollingStatus: 'idle' | 'active' | 'error';
  processingVideos: Map<string, { status: string; progress: number }>;
}

interface YouTubeTelegramBotActions {
  setBotToken: (token: string) => void;
  startBot: () => Promise<void>;
  stopBot: () => void;
  clearLogs: () => void;
}

interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  description: string;
  duration: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  thumbnail: string;
}

const INITIAL_STATE: YouTubeTelegramBotState = {
  botToken: '',
  isRunning: false,
  botInfo: null,
  messages: [],
  detailedLogs: [],
  pollingStatus: 'idle',
  processingVideos: new Map(),
};

export function useYouTubeTelegramBot(flowData: { nodes: any[]; edges: any[] }): {
  botToken: string;
  isRunning: boolean;
  botInfo: any | null;
  messages: string[];
  detailedLogs: DetailedLog[];
  pollingStatus: 'idle' | 'active' | 'error';
  processingVideos: Map<string, { status: string; progress: number }>;
  actions: YouTubeTelegramBotActions;
} {
  const { toast } = useToast();
  
  const [state, setState] = useState<YouTubeTelegramBotState>(INITIAL_STATE);
  
  const flowDataRef = useRef(flowData);
  const botTokenRef = useRef(state.botToken);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);
  const lastUpdateIdRef = useRef(0);

  useEffect(() => {
    flowDataRef.current = flowData;
  }, [flowData]);

  useEffect(() => {
    botTokenRef.current = state.botToken;
  }, [state.botToken]);

  // Extract configuration from flow data
  const getConfig = useCallback(() => {
    const systemNode = flowDataRef.current.nodes.find(node => node.type === 'system');
    const aiModelNode = flowDataRef.current.nodes.find(node => node.type === 'aimodel');
    const youtubeNode = flowDataRef.current.nodes.find(node => node.type === 'youtubeinput');
    
    return {
      systemPrompt: systemNode?.data?.content || "You are a YouTube video summarizer AI.",
      aiProvider: aiModelNode?.data?.provider || "OpenAI",
      aiModel: aiModelNode?.data?.model || "gpt-4o-mini",
      temperature: parseFloat(aiModelNode?.data?.temperature || "0.3"),
      youtubeApiKey: youtubeNode?.data?.youtubeApiKey || "",
      aiApiKey: aiModelNode?.data?.apiKey || "",
    };
  }, []);

  // Add logs helper
  const addLogs = useCallback((logs: Omit<DetailedLog, "timestamp">[]) => {
    setState((s) => {
      const now = new Date();
      const newDetailedLogs = logs.map((log) => ({
        ...log,
        timestamp: now.toISOString(),
      }));
      const newMessages = logs.map(
        (log) => `[${now.toLocaleTimeString()}] ${log.message}`
      );
      return {
        ...s,
        detailedLogs: [...s.detailedLogs, ...newDetailedLogs],
        messages: [...s.messages, ...newMessages],
      };
    });
  }, []);

  // Validate YouTube URL
  const validateYouTubeUrl = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /^[a-zA-Z0-9_-]{11}$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }
    return null;
  };

  // Send message to Telegram with chunking for long messages
  const sendTelegramMessage = async (chatId: number, text: string, parseMode?: string) => {
    const MAX_MESSAGE_LENGTH = 4000; // Leave some buffer below 4096 limit
    
    try {
      // If message is short enough, send normally
      if (text.length <= MAX_MESSAGE_LENGTH) {
        const requestBody: any = {
          chat_id: chatId,
          text: text,
        };
        
        // Only add parse_mode if explicitly specified and text doesn't contain problematic characters
        if (parseMode && !text.includes('*') && !text.includes('_') && !text.includes('[') && !text.includes('`')) {
          requestBody.parse_mode = parseMode;
        }
        
        const response = await fetch(
          `https://api.telegram.org/bot${botTokenRef.current}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );
        
        const data = await response.json();
        if (!data.ok) {
          // If markdown parsing fails, try sending as plain text
          if (data.description?.includes("parse") || data.description?.includes("entity")) {
            const plainResponse = await fetch(
              `https://api.telegram.org/bot${botTokenRef.current}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: text,
                }),
              }
            );
            const plainData = await plainResponse.json();
            if (!plainData.ok) {
              throw new Error(plainData.description);
            }
            return plainData.result;
          }
          throw new Error(data.description);
        }
        
        return data.result;
      }
      
      // For long messages, split into chunks
      const chunks = [];
      let currentChunk = '';
      const lines = text.split('\n');
      
      for (const line of lines) {
        // If adding this line would exceed the limit, save current chunk and start new one
        if (currentChunk.length + line.length + 1 > MAX_MESSAGE_LENGTH) {
          if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
          }
          
          // If a single line is too long, truncate it
          if (line.length > MAX_MESSAGE_LENGTH) {
            chunks.push(line.substring(0, MAX_MESSAGE_LENGTH - 3) + '...');
          } else {
            currentChunk = line;
          }
        } else {
          currentChunk += (currentChunk ? '\n' : '') + line;
        }
      }
      
      // Add the last chunk
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      
      // Send each chunk
      const results = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const chunkText = chunks.length > 1 ? `📄 Part ${i + 1}/${chunks.length}\n\n${chunk}` : chunk;
        
        const response = await fetch(
          `https://api.telegram.org/bot${botTokenRef.current}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: chunkText,
            }),
          }
        );
        
        const data = await response.json();
        if (!data.ok) {
          throw new Error(`Chunk ${i + 1} failed: ${data.description}`);
        }
        
        results.push(data.result);
        
        // Small delay between chunks to avoid rate limiting
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      return results;
      
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      throw error;
    }
  };

  // Extract video information using YouTube Data API
  const getVideoInfo = async (videoId: string): Promise<YouTubeVideoInfo> => {
    const config = getConfig();
    
    if (!config.youtubeApiKey) {
      throw new Error('YouTube API key is not configured');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${config.youtubeApiKey}&part=snippet,statistics,contentDetails`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('Video not found or is private/unavailable');
      }
      
      const video = data.items[0];
      const snippet = video.snippet;
      const statistics = video.statistics;
      const contentDetails = video.contentDetails;
      
      // Parse duration from ISO 8601 format (PT4M13S) to readable format
      const duration = contentDetails.duration;
      const durationMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = durationMatch?.[1] ? parseInt(durationMatch[1]) : 0;
      const minutes = durationMatch?.[2] ? parseInt(durationMatch[2]) : 0;
      const seconds = durationMatch?.[3] ? parseInt(durationMatch[3]) : 0;
      
      const formattedDuration = hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      return {
        videoId,
        title: snippet.title,
        description: snippet.description,
        duration: formattedDuration,
        channelTitle: snippet.channelTitle,
        publishedAt: snippet.publishedAt,
        viewCount: parseInt(statistics.viewCount || '0').toLocaleString(),
        thumbnail: snippet.thumbnails?.maxresdefault?.url || snippet.thumbnails?.high?.url || ''
      };
    } catch (error) {
      console.error('Error fetching video info:', error);
      throw new Error(`Failed to fetch video information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Extract video transcript/content for analysis
  const getVideoTranscript = async (videoInfo: YouTubeVideoInfo): Promise<string> => {
    // For now, we'll use the video description as the primary content
    // In a production environment, you might want to integrate with:
    // - YouTube Transcript API (requires server-side implementation)
    // - Third-party transcript services
    // - Audio-to-text services
    
    let content = `Video Title: ${videoInfo.title}\n\n`;
    
    if (videoInfo.description && videoInfo.description.length > 50) {
      content += `Video Description:\n${videoInfo.description}\n\n`;
    }
    
    // Add basic video metadata for context
    content += `Channel: ${videoInfo.channelTitle}\n`;
    content += `Duration: ${videoInfo.duration}\n`;
    content += `Views: ${videoInfo.viewCount}\n`;
    content += `Published: ${new Date(videoInfo.publishedAt).toLocaleDateString()}\n\n`;
    
    // If description is too short, provide guidance to the AI
    if (videoInfo.description.length < 100) {
      content += `Note: Limited description available. Please provide analysis based on the title and available metadata.`;
    }
    
    return content;
  };

  // Generate AI summary using configured AI model
  const generateSummary = async (videoInfo: YouTubeVideoInfo, transcript: string): Promise<string> => {
    const config = getConfig();
    
    if (!config.aiApiKey) {
      throw new Error('AI API key is not configured');
    }

    try {
      let apiUrl = '';
      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      let requestBody: any = {};

      // Configure API based on provider
      switch (config.aiProvider.toLowerCase()) {
        case 'openai':
          apiUrl = 'https://api.openai.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${config.aiApiKey}`;
          requestBody = {
            model: config.aiModel,
            messages: [
              {
                role: 'system',
                content: `${config.systemPrompt}\n\nYou are analyzing a YouTube video. Provide a concise but comprehensive summary in plain text format (no markdown). Keep the response under 2000 characters. Include key points, insights, and actionable takeaways.`
              },
              {
                role: 'user',
                content: `Please analyze this YouTube video and provide a detailed but concise summary:

Title: ${videoInfo.title}
Channel: ${videoInfo.channelTitle}
Duration: ${videoInfo.duration}
Description: ${videoInfo.description.substring(0, 300)}...

Video Content/Transcript: ${transcript.substring(0, 1000)}...

Please provide a concise summary with:
1. Key Points (2-3 main topics)
2. Important Insights (2-3 takeaways)
3. Brief Analysis

Keep the total response under 2000 characters and format in plain text without markdown.`
              }
            ],
            temperature: config.temperature,
            max_tokens: 800
          };
          break;

        case 'anthropic':
          apiUrl = 'https://api.anthropic.com/v1/messages';
          headers['x-api-key'] = config.aiApiKey;
          headers['anthropic-version'] = '2023-06-01';
          requestBody = {
            model: config.aiModel,
            max_tokens: 800,
            messages: [
              {
                role: 'user',
                content: `${config.systemPrompt}\n\nAnalyze this YouTube video and provide a concise summary (under 2000 characters):

Title: ${videoInfo.title}
Channel: ${videoInfo.channelTitle}
Duration: ${videoInfo.duration}
Description: ${videoInfo.description.substring(0, 300)}...

Video Content: ${transcript.substring(0, 1000)}...

Provide key points, insights, takeaways, and brief analysis in plain text format. Keep it concise.`
              }
            ]
          };
          break;

        default:
          throw new Error(`Unsupported AI provider: ${config.aiProvider}`);
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`AI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      let summaryContent = '';
      
      if (config.aiProvider.toLowerCase() === 'openai') {
        summaryContent = data.choices?.[0]?.message?.content || 'No summary generated';
      } else if (config.aiProvider.toLowerCase() === 'anthropic') {
        summaryContent = data.content?.[0]?.text || 'No summary generated';
      }

      // Format the final summary
      const formattedSummary = `${summaryContent}

📺 ${videoInfo.channelTitle} | ⏱️ ${videoInfo.duration} | 👀 ${videoInfo.viewCount}`;

      return formattedSummary;

    } catch (error) {
      console.error('Error generating AI summary:', error);
      throw new Error(`Failed to generate AI summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Generate PDF report
  const generatePDF = async (videoInfo: YouTubeVideoInfo, summary: string): Promise<string> => {
    try {
      // Create PDF content
      const pdfContent = `
YouTube Video Analysis Report

Title: ${videoInfo.title}
Channel: ${videoInfo.channelTitle}
Duration: ${videoInfo.duration}
Views: ${videoInfo.viewCount}
Published: ${new Date(videoInfo.publishedAt).toLocaleDateString()}

${summary}

---
Report generated on ${new Date().toLocaleString()}
Video ID: ${videoInfo.videoId}
      `.trim();

      // Convert to blob (in a real implementation, you'd use a PDF library like jsPDF)
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      
      // Create a temporary URL for the "PDF" (text file for now)
      const url = URL.createObjectURL(blob);
      
      // In a production environment, you would:
      // 1. Use a proper PDF generation library (jsPDF, PDFKit, etc.)
      // 2. Upload to cloud storage (AWS S3, Firebase Storage, etc.)
      // 3. Return the permanent download URL
      
      // For now, return a download link
      return `data:text/plain;charset=utf-8,${encodeURIComponent(pdfContent)}`;
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error(`Failed to generate PDF report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Process YouTube video
  const processYouTubeVideo = async (videoId: string, chatId: number) => {
    const config = getConfig();
    
    try {
      addLogs([
        { level: "INFO", category: "YOUTUBE", message: `Starting analysis for video: ${videoId}` }
      ]);

      // Update processing status
      setState(prev => ({
        ...prev,
        processingVideos: new Map(prev.processingVideos.set(videoId, { 
          status: 'Extracting video info...', 
          progress: 10 
        }))
      }));

      // Send initial processing message
      await sendTelegramMessage(chatId, `🎬 Processing YouTube video: ${videoId}\n\nPlease wait while I analyze the content...`);

      // Get video information
      const videoInfo = await getVideoInfo(videoId);
      
      setState(prev => ({
        ...prev,
        processingVideos: new Map(prev.processingVideos.set(videoId, { 
          status: 'Analyzing video content...', 
          progress: 30 
        }))
      }));

      // Extract video transcript
      const transcript = await getVideoTranscript(videoInfo);
      
      setState(prev => ({
        ...prev,
        processingVideos: new Map(prev.processingVideos.set(videoId, { 
          status: 'Generating AI summary...', 
          progress: 60 
        }))
      }));

      // Generate AI summary
      const summary = await generateSummary(videoInfo, transcript);
      
      setState(prev => ({
        ...prev,
        processingVideos: new Map(prev.processingVideos.set(videoId, { 
          status: 'Complete!', 
          progress: 100 
        }))
      }));

      // Send results back to user
      const response = `🎥 Video Analysis Complete!

${videoInfo.title}

${summary}

✨ Analysis powered by ${config.aiProvider} ${config.aiModel}`;

      await sendTelegramMessage(chatId, response);

      // Log the completion
      addLogs([
        { level: "INFO", category: "YOUTUBE", message: `✅ Completed analysis for ${videoInfo.title}` }
      ]);

      // Clean up processing status
      setTimeout(() => {
        setState(prev => {
          const newMap = new Map(prev.processingVideos);
          newMap.delete(videoId);
          return { ...prev, processingVideos: newMap };
        });
      }, 5000);

    } catch (error) {
      const errorMessage = `❌ Error processing video: ${error}`;
      
      addLogs([
        { level: "ERROR", category: "YOUTUBE", message: errorMessage }
      ]);

      setState(prev => ({
        ...prev,
        processingVideos: new Map(prev.processingVideos.set(videoId, { 
          status: 'Error occurred', 
          progress: 0 
        }))
      }));

      await sendTelegramMessage(chatId, `❌ Sorry, I couldn't process that video. Please try again or check if the URL is valid.\n\nError: ${error}`);
      throw error;
    }
  };

  // Handle incoming messages
  const processMessage = useCallback(async (message: any) => {
    try {
      const text = message.text?.trim() || '';
      const chatId = message.chat.id;
      const userName = message.from?.first_name || 'User';
      
      addLogs([
        { level: "INFO", category: "MSG", message: `Processing message from ${userName}: "${text}"` }
      ]);

      let response = '';
      
      // Handle commands
      if (text.startsWith('/')) {
        switch (text.toLowerCase()) {
          case '/start':
            response = `🎥 Welcome to YouTube AI Summarizer Bot!

Send me any YouTube video URL and I'll:
✨ Extract video information
🤖 Generate AI-powered summary  
📄 Create downloadable PDF report

Just paste a YouTube link to get started!`;
            break;
            
          case '/help':
            response = `🔗 Supported YouTube URL formats:
• https://www.youtube.com/watch?v=VIDEO_ID
• https://youtu.be/VIDEO_ID
• https://youtube.com/watch?v=VIDEO_ID
• Direct video ID

📱 Commands:
/start - Welcome message
/help - Show this help
/status - Bot status

Just send any YouTube URL to analyze!`;
            break;
            
          case '/status':
            const config = getConfig();
            response = `🤖 Bot Status: Online
🔑 YouTube API: ${config.youtubeApiKey ? '✅ Configured' : '❌ Missing'}
🧠 AI Model: ${config.aiProvider} ${config.aiModel}
📊 Processing: ${state.processingVideos.size} videos in queue`;
            break;
            
          default:
            response = "❓ Unknown command. Use /help to see available commands.";
        }
        
        await sendTelegramMessage(chatId, response);
        addLogs([
          { level: "INFO", category: "MSG", message: `Sent command response to ${userName}` }
        ]);
        return;
      }
      
      // Check if message contains YouTube URL
      const videoId = validateYouTubeUrl(text);
      if (videoId) {
        addLogs([
          { level: "INFO", category: "YOUTUBE", message: `Valid YouTube URL detected: ${videoId}` }
        ]);
        
        await processYouTubeVideo(videoId, chatId);
        return;
      }
      
      // Default response for non-YouTube messages
      response = `🎥 Please send me a YouTube video URL to analyze!

Example formats:
• https://www.youtube.com/watch?v=VIDEO_ID
• https://youtu.be/VIDEO_ID

Use /help for more information.`;
      
      await sendTelegramMessage(chatId, response);
      addLogs([
        { level: "INFO", category: "MSG", message: `Sent help response to ${userName}` }
      ]);

    } catch (error) {
      addLogs([
        {
          level: "ERROR",
          category: "PROCESS",
          message: `Error processing message: ${error instanceof Error ? error.message : "Unknown"}`,
        },
      ]);
    }
  }, [addLogs, state.processingVideos.size]);

  // Poll for updates
  const pollForUpdates = useCallback(async () => {
    if (!isPollingRef.current) return;
    
    try {
      const offset = lastUpdateIdRef.current + 1;
      const response = await fetch(
        `https://api.telegram.org/bot${botTokenRef.current}/getUpdates?offset=${offset}&timeout=20`
      );
      const data = await response.json();

      if (!data.ok) throw new Error(data.description);

      if (data.result.length > 0) {
        for (const update of data.result) {
          lastUpdateIdRef.current = update.update_id;
          if (update.message) {
            await processMessage(update.message);
          }
        }
      }
    } catch (error) {
      addLogs([
        {
          level: "ERROR",
          category: "POLL",
          message: `Polling failed: ${error instanceof Error ? error.message : "Unknown"}. Stopping bot.`,
        },
      ]);
      setState((s) => ({ ...s, isRunning: false, pollingStatus: "error" }));
      isPollingRef.current = false;
      if (pollingIntervalRef.current) clearTimeout(pollingIntervalRef.current);
    } finally {
      if (isPollingRef.current) {
        pollingIntervalRef.current = setTimeout(pollForUpdates, 2000);
      }
    }
  }, [addLogs, processMessage]);

  // Stop polling
  const stopPolling = useCallback(() => {
    isPollingRef.current = false;
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Actions
  const actions: YouTubeTelegramBotActions = useMemo(() => ({
    setBotToken: (token: string) => {
      setState(prev => ({ ...prev, botToken: token }));
    },
    
    startBot: async () => {
      const config = getConfig();
      const token = botTokenRef.current;
      
      if (!/^\d{8,10}:[a-zA-Z0-9_-]{35}$/.test(token)) {
        toast({
          title: "Invalid Token",
          description: "Please enter a valid bot token",
          variant: "destructive",
        });
        return;
      }
      
      if (!config.youtubeApiKey || !config.aiApiKey) {
        toast({
          title: "Missing API Keys",
          description: "Please configure both YouTube API and AI Model API keys",
          variant: "destructive",
        });
        return;
      }

      stopPolling();
      setState({
        ...INITIAL_STATE,
        botToken: token,
        isRunning: true,
        pollingStatus: "active",
      });
      
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${token}/getMe`
        );
        const data = await response.json();
        if (!data.ok) throw new Error(data.description);

        lastUpdateIdRef.current = 0;
        isPollingRef.current = true;
        setState((s) => ({ ...s, botInfo: data.result }));
        
        toast({
          title: "Bot Started!",
          description: `Connected to ${data.result.first_name}`,
        });
        
        addLogs([
          {
            level: "INFO",
            category: "BOT",
            message: `YouTube AI Summarizer Bot '${data.result.first_name}' started successfully`,
          },
        ]);

        pollForUpdates();
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        toast({
          title: "Failed to Start Bot",
          description: msg,
          variant: "destructive",
        });
        addLogs([
          {
            level: "ERROR",
            category: "BOT",
            message: `Failed to start bot: ${msg}`,
          },
        ]);
        setState((s) => ({ ...s, isRunning: false, pollingStatus: "error" }));
      }
    },
    
    stopBot: () => {
      stopPolling();
      setState((s) => ({
        ...s,
        isRunning: false,
        botInfo: null,
        pollingStatus: "idle",
      }));
      addLogs([
        { level: "INFO", category: "BOT", message: "YouTube AI Summarizer Bot stopped" }
      ]);
      toast({
        title: "Bot Stopped",
        description: "YouTube AI Summarizer Bot has been stopped",
      });
    },
    
    clearLogs: () => {
      setState(prev => ({ 
        ...prev, 
        messages: [],
        detailedLogs: []
      }));
    }
  }), [addLogs, toast, stopPolling, pollForUpdates, getConfig]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return {
    botToken: state.botToken,
    isRunning: state.isRunning,
    botInfo: state.botInfo,
    messages: state.messages,
    detailedLogs: state.detailedLogs,
    pollingStatus: state.pollingStatus,
    processingVideos: state.processingVideos,
    actions
  };
} 