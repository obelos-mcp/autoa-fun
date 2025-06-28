import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  Play, 
  Square, 
  CheckCircle, 
  RefreshCw, 
  AlertTriangle, 
  Copy,
  Settings,
  MessageSquare,
  Zap,
  Users,
  Activity,
  Youtube,
  FileText,
  Download,
  Link,
  Shield,
  Check,
  Loader2,
  Eye,
  Clock
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useYouTubeTelegramBot } from '../hooks/useYouTubeTelegramBot';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface YouTubeAISummarizerTelegramIntegrationProps {
  flowData: { nodes: any[]; edges: any[] };
}

export function YouTubeAISummarizerTelegramIntegration({ flowData }: YouTubeAISummarizerTelegramIntegrationProps) {
  const { toast } = useToast();
  const [botName, setBotName] = useState("YouTube AI Summarizer Bot");
  const [botDescription, setBotDescription] = useState("AI-powered YouTube video summarizer with PDF reports");
  const [welcomeMessage, setWelcomeMessage] = useState("🎥 Send me any YouTube video URL and I\'ll create an AI summary with downloadable PDF report!");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const {
    botToken,
    isRunning,
    botInfo,
    messages,
    detailedLogs,
    pollingStatus,
    processingVideos,
    actions
  } = useYouTubeTelegramBot(flowData);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const validateBotToken = (token: string): boolean => {
    return /^\d{8,10}:[a-zA-Z0-9_-]{35}$/.test(token);
  };

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)[a-zA-Z0-9_-]{11}/;
    return youtubeRegex.test(url);
  };

  // Extract AI configuration from flow
  const getAIConfig = () => {
    const systemNode = flowData.nodes.find(node => node.type === 'system');
    const aiModelNode = flowData.nodes.find(node => node.type === 'aimodel');
    const youtubeNode = flowData.nodes.find(node => node.type === 'youtubeinput');
    
    return {
      systemPrompt: systemNode?.data?.content || "You are a YouTube video summarizer AI.",
      provider: aiModelNode?.data?.provider || "OpenAI",
      model: aiModelNode?.data?.model || "gpt-4o-mini",
      temperature: aiModelNode?.data?.temperature || "0.3",
      youtubeApiKey: youtubeNode?.data?.youtubeApiKey || "",
      aiApiKey: aiModelNode?.data?.apiKey || "",
    };
  };

  const aiConfig = getAIConfig();
  const hasYouTubeApiKey = !!aiConfig.youtubeApiKey;
  const hasAIApiKey = !!aiConfig.aiApiKey;
  const canDeploy = validateBotToken(botToken) && hasYouTubeApiKey && hasAIApiKey;

  // Generate example YouTube URLs for testing
  const exampleUrls = [
    "https://youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/jNQXAC9IVRw",
    "https://www.youtube.com/watch?v=9bZkp7q19f0"
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="border-red-600/20 bg-gradient-to-br from-red-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <Youtube className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="matrix-text-glow text-xl">
                🎥 YouTube AI Summarizer - Telegram Bot
              </CardTitle>
              <CardDescription className="text-red-400/60">
                Transform YouTube videos into AI-powered summaries with PDF reports
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/10 border border-red-600/20">
              <Link className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-300">Link Processing</p>
                <p className="text-xs text-red-400/70">Smart YouTube URL detection</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-900/10 border border-blue-600/20">
              <FileText className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-300">AI Summary</p>
                <p className="text-xs text-blue-400/70">Comprehensive analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-900/10 border border-green-600/20">
              <Download className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-300">PDF Export</p>
                <p className="text-xs text-green-400/70">Downloadable reports</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key Validation */}
      <Card className={`border-${hasYouTubeApiKey && hasAIApiKey ? 'green' : 'red'}-600/20 bg-gradient-to-br from-${hasYouTubeApiKey && hasAIApiKey ? 'green' : 'red'}-950/20 to-black/40 backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API Keys Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${hasAIApiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="text-sm font-medium">AI Model API Key</p>
                <p className="text-xs text-gray-400">{aiConfig.provider} - {hasAIApiKey ? 'Configured' : 'Missing'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${hasYouTubeApiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="text-sm font-medium">YouTube API Key</p>
                <p className="text-xs text-gray-400">{hasYouTubeApiKey ? 'Configured' : 'Missing'}</p>
              </div>
            </div>
          </div>
          {!hasYouTubeApiKey && !hasAIApiKey && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Missing API Keys:</strong> Configure your YouTube and AI Model API keys in the workflow nodes before deploying.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Bot Configuration */}
      <Card className="border-red-600/20 bg-gradient-to-br from-red-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Bot Configuration
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bot Token */}
          <div className="space-y-2">
            <Label htmlFor="bot-token" className="text-red-300">
              Bot Token from @BotFather
            </Label>
            <div className="flex gap-2">
              <Input
                id="bot-token"
                type="password"
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                value={botToken}
                onChange={(e) => actions.setBotToken(e.target.value)}
                className={validateBotToken(botToken) ? 'border-green-500' : botToken ? 'border-red-500' : ''}
              />
              {botToken && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(botToken, 'token')}
                >
                  {copiedText === 'token' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
            <p className="text-xs text-red-400/70">
              1. Message @BotFather on Telegram
              <br />
              2. Send /newbot and follow instructions
              <br />
              3. Copy the token and paste it above
            </p>
          </div>

          {/* Advanced Configuration */}
          {showAdvanced && (
            <div className="space-y-4 p-4 rounded-lg bg-black/20 border border-red-600/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-red-300">Bot Name</Label>
                  <Input
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="YouTube AI Summarizer Bot"
                  />
                </div>
                <div>
                  <Label className="text-red-300">Bot Description</Label>
                  <Input
                    value={botDescription}
                    onChange={(e) => setBotDescription(e.target.value)}
                    placeholder="AI-powered video summarizer"
                  />
                </div>
              </div>
              <div>
                <Label className="text-red-300">Welcome Message</Label>
                <Textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Welcome message for new users..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Status Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            {botToken && (
              <Badge variant={validateBotToken(botToken) ? "default" : "destructive"}>
                {validateBotToken(botToken) ? "✓ Valid Token" : "✗ Invalid Token"}
              </Badge>
            )}
            {botInfo && (
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Bot: {botInfo.first_name} (@{botInfo.username})
              </Badge>
            )}
            {hasYouTubeApiKey && hasAIApiKey && (
              <Badge className="bg-green-500 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                API Keys Ready
              </Badge>
            )}
            {isRunning && pollingStatus === 'active' && (
              <Badge className="bg-red-500 flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Active & Processing
              </Badge>
            )}
            {isRunning && pollingStatus === 'error' && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Connection Error
              </Badge>
            )}
          </div>

          {/* Deploy Button */}
          <div className="flex gap-2">
            {!isRunning ? (
              <Button 
                onClick={actions.startBot}
                disabled={!botToken || !validateBotToken(botToken) || !hasYouTubeApiKey || !hasAIApiKey}
                className="bg-red-600 hover:bg-red-700 flex-1"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                🚀 Deploy YouTube Bot
              </Button>
            ) : (
              <Button 
                onClick={actions.stopBot}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop Bot
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {processingVideos.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing Videos
            </CardTitle>
            <CardDescription>
              Real-time video analysis status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(processingVideos.entries()).map(([videoId, status]) => (
                <div key={videoId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Video: {videoId}</span>
                    <span className="text-muted-foreground">{status.progress}%</span>
                  </div>
                  <Progress value={status.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{status.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* YouTube Link Examples */}
      <Card className="border-blue-600/20 bg-gradient-to-br from-blue-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5" />
            Supported YouTube URL Formats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-blue-400/80 text-sm">
              Your bot will automatically detect and process these YouTube URL formats:
            </p>
            <div className="grid gap-2">
              {[
                "https://www.youtube.com/watch?v=VIDEO_ID",
                "https://youtu.be/VIDEO_ID", 
                "https://youtube.com/watch?v=VIDEO_ID",
                "https://www.youtube.com/embed/VIDEO_ID"
              ].map((format, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded bg-blue-900/20 text-blue-400 text-sm font-mono">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>{format}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Configuration Display */}
      <Card className="border-purple-600/20 bg-gradient-to-br from-purple-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-purple-300">AI Provider</Label>
              <div className="p-2 rounded bg-purple-900/20 text-purple-400 text-sm">
                {aiConfig.provider} - {aiConfig.model}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-purple-300">Temperature</Label>
              <div className="p-2 rounded bg-purple-900/20 text-purple-400 text-sm">
                {aiConfig.temperature} (Analysis Precision)
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label className="text-purple-300">System Prompt</Label>
            <div className="p-3 rounded bg-purple-900/20 text-purple-400 text-sm max-h-20 overflow-y-auto">
              {aiConfig.systemPrompt}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bot Features */}
      <Card className="border-green-600/20 bg-gradient-to-br from-green-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Bot Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-green-300">🎯 Smart Processing</h4>
              <ul className="space-y-1 text-sm text-green-400/70">
                <li>• Automatic YouTube URL detection</li>
                <li>• Video metadata extraction</li>
                <li>• Transcript analysis</li>
                <li>• AI-powered summarization</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-green-300">📄 PDF Generation</h4>
              <ul className="space-y-1 text-sm text-green-400/70">
                <li>• Professional report layout</li>
                <li>• Video thumbnails included</li>
                <li>• Key insights highlighted</li>
                <li>• Instant download links</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bot Status & Logs */}
      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Bot Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full border rounded-md p-4">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No activity yet. Bot is waiting for messages...
                </p>
              ) : (
                <div className="space-y-2">
                  {messages.map((message, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-muted-foreground">
                        [{new Date().toLocaleTimeString()}]
                      </span>{' '}
                      {message}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={actions.clearLogs}
                disabled={messages.length === 0}
              >
                Clear Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prerequisites Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Prerequisites:</strong> Ensure both YouTube Data API key and AI Model API key are configured in your workflow nodes. 
          The bot will validate YouTube URLs and generate comprehensive PDF summaries using your configured AI provider ({aiConfig.provider}).
        </AlertDescription>
      </Alert>

      {/* Quick Start Guide */}
      <Card className="border-amber-600/20 bg-gradient-to-br from-amber-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-amber-300">🚀 YouTube Bot Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold">1</div>
              <div className="text-amber-300">
                <strong>Create Bot:</strong> Message @BotFather on Telegram, send /newbot, and get your token
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold">2</div>
              <div className="text-amber-300">
                <strong>Configure APIs:</strong> Ensure YouTube Data API and AI Model API keys are set in workflow nodes
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold">3</div>
              <div className="text-amber-300">
                <strong>Deploy:</strong> Paste your bot token above and click "Deploy YouTube Bot"
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold">4</div>
              <div className="text-amber-300">
                <strong>Test:</strong> Send any YouTube link to your bot and receive an AI summary with PDF! 🎥📄
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-amber-900/10 border border-amber-600/20">
            <h4 className="font-medium text-amber-300 mb-2">📱 User Commands</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="text-amber-400/70">• Send YouTube URL → Get AI Summary</div>
              <div className="text-amber-400/70">• /help → Show available commands</div>
              <div className="text-amber-400/70">• /start → Welcome message</div>
              <div className="text-amber-400/70">• Auto PDF download links</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 