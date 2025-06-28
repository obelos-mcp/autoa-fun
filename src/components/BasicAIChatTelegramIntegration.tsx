import React, { useState, useEffect } from "react";
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
  Activity
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useTelegramBot } from "@/hooks/useTelegramBot";

interface BasicAIChatTelegramIntegrationProps {
  flowData: { nodes: any[]; edges: any[] };
}

export function BasicAIChatTelegramIntegration({ flowData }: BasicAIChatTelegramIntegrationProps) {
  const { toast } = useToast();
  const [botName, setBotName] = useState("My AI Assistant");
  const [botDescription, setBotDescription] = useState("A helpful AI assistant powered by your custom workflow");
  const [welcomeMessage, setWelcomeMessage] = useState("👋 Hello! I'm your AI assistant. Send me any message and I'll help you!");
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  
  const {
    botToken,
    isRunning,
    botInfo,
    messages,
    detailedLogs,
    pollingStatus,
    actions,
  } = useTelegramBot(flowData);

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${description} copied to clipboard`,
    });
  };

  const validateBotToken = (token: string) => {
    return /^\d+:[A-Za-z0-9_-]{35}$/.test(token);
  };

  // Extract AI configuration from flow
  const getAIConfig = () => {
    const systemNode = flowData.nodes.find(node => node.type === 'system');
    const aiModelNode = flowData.nodes.find(node => node.type === 'aimodel');
    
    return {
      systemPrompt: systemNode?.data?.content || "You are a helpful AI assistant.",
      provider: aiModelNode?.data?.provider || "OpenAI",
      model: aiModelNode?.data?.model || "gpt-4o-mini",
      temperature: aiModelNode?.data?.temperature || "0.7",
      apiKey: aiModelNode?.data?.apiKey || ""
    };
  };

  const aiConfig = getAIConfig();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="border-green-600/20 bg-gradient-to-br from-green-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <Bot className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle className="matrix-text-glow text-xl">
                🤖 Basic AI Chat - Telegram Bot
              </CardTitle>
              <CardDescription className="text-green-400/60">
                Deploy your AI assistant as a Telegram bot in minutes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-900/10 border border-green-600/20">
              <MessageSquare className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-300">Instant Chat</p>
                <p className="text-xs text-green-400/70">Real-time AI responses</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-900/10 border border-blue-600/20">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-300">Multi-User</p>
                <p className="text-xs text-blue-400/70">Handle multiple chats</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-900/10 border border-purple-600/20">
              <Zap className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-purple-300">Zero Setup</p>
                <p className="text-xs text-purple-400/70">Just add bot token</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Status */}
      <Card className="border-amber-600/20 bg-gradient-to-br from-amber-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-300">
            <Activity className="h-5 w-5" />
            API Keys Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${aiConfig.apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-sm font-medium text-white">AI Model API Key</p>
                  <p className="text-xs text-gray-400">
                    {aiConfig.provider} - {aiConfig.apiKey ? 'Configured' : 'Missing'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Missing API Keys Alert */}
          {!aiConfig.apiKey && (
            <Alert className="mt-4 border-amber-600/20 bg-amber-950/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Missing API Keys:</strong> Configure your AI Model API key in the workflow nodes before deploying.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Bot Configuration */}
      <Card className="border-green-600/20 bg-gradient-to-br from-green-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Bot Configuration
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            >
              {isConfigExpanded ? "Hide" : "Show"} Advanced
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bot Token */}
          <div className="space-y-2">
            <Label htmlFor="bot-token" className="text-green-300">
              Bot Token from @BotFather
            </Label>
            <div className="flex gap-2">
              <Input
                id="bot-token"
                type="password"
                placeholder="123456789:AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRss"
                value={botToken}
                onChange={(e) => actions.setBotToken(e.target.value)}
                disabled={isRunning}
                className="flex-1"
              />
              {botToken && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(botToken, "Bot token")}
                  className="px-3"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-green-400/70">
              1. Message @BotFather on Telegram
              <br />
              2. Send /newbot and follow instructions
              <br />
              3. Copy the token and paste it above
            </p>
          </div>

          {/* Advanced Configuration */}
          {isConfigExpanded && (
            <div className="space-y-4 p-4 rounded-lg bg-black/20 border border-green-600/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-green-300">Bot Name</Label>
                  <Input
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="My AI Assistant"
                    disabled={isRunning}
                  />
                </div>
                <div>
                  <Label className="text-green-300">Bot Description</Label>
                  <Input
                    value={botDescription}
                    onChange={(e) => setBotDescription(e.target.value)}
                    placeholder="A helpful AI assistant"
                    disabled={isRunning}
                  />
                </div>
              </div>
              <div>
                <Label className="text-green-300">Welcome Message</Label>
                <Textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Welcome message for new users"
                  disabled={isRunning}
                  rows={2}
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
            {isRunning && pollingStatus === 'active' && (
              <Badge className="bg-green-500 flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Active & Polling
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
                disabled={!botToken || !validateBotToken(botToken) || !aiConfig.apiKey}
                className="bg-green-600 hover:bg-green-700 flex-1"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                🚀 Deploy Bot
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

      {/* Bot Status & Logs */}
      {isRunning && (
        <Card className="border-green-600/20 bg-gradient-to-br from-green-950/20 to-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Live Bot Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-2 p-4 rounded-lg bg-black/40 border border-green-600/20">
                  {messages.slice(-10).map((message, index) => (
                    <div key={index} className="text-sm text-green-400 font-mono">
                      {message}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-green-900/10 border border-green-600/20 text-center">
                  <p className="text-green-400/70 text-sm">
                    🎯 Bot is ready! Send a message to your bot on Telegram to see activity here.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prerequisites Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Prerequisites:</strong> Make sure your AI Model node has a valid API key configured before starting the bot.
          The bot will use your configured AI provider ({aiConfig.provider}) to generate responses.
        </AlertDescription>
      </Alert>

      {/* Quick Start Guide */}
      <Card className="border-amber-600/20 bg-gradient-to-br from-amber-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-amber-300">🚀 Quick Start Guide</CardTitle>
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
                <strong>Configure AI:</strong> Make sure your AI Model node has valid API keys
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold">3</div>
              <div className="text-amber-300">
                <strong>Deploy:</strong> Paste your bot token above and click "Deploy Bot"
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold">4</div>
              <div className="text-amber-300">
                <strong>Test:</strong> Send a message to your bot on Telegram and see the magic! ✨
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 