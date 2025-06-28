import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Wallet, 
  CheckCircle, 
  RefreshCw, 
  Square, 
  Play, 
  AlertTriangle, 
  MessageSquare, 
  Users, 
  Zap,
  TrendingUp,
  DollarSign,
  BarChart3,
  FileText
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useWalletTelegramBot } from '@/hooks/useWalletTelegramBot';

interface WalletTransactionAnalyzerTelegramIntegrationProps {
  flowData: {
    nodes: any[];
    edges: any[];
  };
}

export function WalletTransactionAnalyzerTelegramIntegration({ flowData }: WalletTransactionAnalyzerTelegramIntegrationProps) {
  const { toast } = useToast();
  const [botName, setBotName] = useState("Wallet Analyzer Bot");
  const [botDescription, setBotDescription] = useState("Advanced blockchain wallet analysis with transaction insights and PDF reports");
  const [welcomeMessage, setWelcomeMessage] = useState("🔍 Welcome to your Wallet Analyzer Bot!\n\nSend me a wallet address to get started:\n• Ethereum: 0x742d35Cc6634C0532925a3b8D400fD0d56c2f1c4\n• Solana: DRpbCBMxVnDK7maPM5tGv6MvB3v1sRMC86PZ8okm21hy\n\nI'll analyze the transactions and provide detailed insights! 📊");
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  
  const {
    botToken,
    isRunning,
    botInfo,
    messages,
    detailedLogs,
    pollingStatus,
    actions,
  } = useWalletTelegramBot(flowData);

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

  // Extract wallet analyzer configuration from flow
  const getWalletConfig = () => {
    const walletInputNode = flowData.nodes.find(node => node.type === 'walletinput');
    const transactionFetcherNode = flowData.nodes.find(node => node.type === 'transactionfetcher');
    const walletAnalyticsNode = flowData.nodes.find(node => node.type === 'walletanalytics');
    const walletReportNode = flowData.nodes.find(node => node.type === 'walletreport');
    
    return {
      supportedBlockchains: ['ethereum', 'solana'],
      transactionLimit: transactionFetcherNode?.data?.transactionLimit || 100,
      includeTokens: transactionFetcherNode?.data?.includeTokens !== false,
      includeNFTs: transactionFetcherNode?.data?.includeNFTs !== false,
      generateCharts: walletAnalyticsNode?.data?.generateCharts !== false,
      generateReports: !!walletReportNode,
      riskAssessment: walletAnalyticsNode?.data?.riskAssessment !== false,
      portfolioAnalysis: walletAnalyticsNode?.data?.portfolioAnalysis !== false
    };
  };

  const walletConfig = getWalletConfig();
  const canDeploy = validateBotToken(botToken);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="border-purple-600/20 bg-gradient-to-br from-purple-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="matrix-text-glow text-xl">
                💰 Wallet Transaction Analyzer - Telegram Bot
              </CardTitle>
              <CardDescription className="text-purple-400/60">
                Deploy your blockchain wallet analyzer as a Telegram bot
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-900/10 border border-purple-600/20">
              <DollarSign className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-purple-300">Multi-Chain</p>
                <p className="text-xs text-purple-400/70">ETH & SOL support</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-900/10 border border-blue-600/20">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-300">Analytics</p>
                <p className="text-xs text-blue-400/70">Risk & portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-900/10 border border-green-600/20">
              <FileText className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-300">PDF Reports</p>
                <p className="text-xs text-green-400/70">Downloadable</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-900/10 border border-orange-600/20">
              <TrendingUp className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm font-medium text-orange-300">Real-time</p>
                <p className="text-xs text-orange-400/70">Live blockchain data</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bot Configuration */}
      <Card className="border-purple-600/20 bg-gradient-to-br from-purple-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Bot Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bot Token Input */}
          <div>
            <Label className="text-purple-300">Telegram Bot Token</Label>
            <Input
              type="password"
              value={botToken}
              onChange={(e) => actions.setBotToken(e.target.value)}
              placeholder="Enter your Telegram bot token (from @BotFather)"
              disabled={isRunning}
            />
            <p className="text-xs text-purple-400/50 mt-1">
              Get your bot token from @BotFather on Telegram
            </p>
          </div>

          {/* Advanced Configuration */}
          <Collapsible open={isConfigExpanded} onOpenChange={setIsConfigExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Advanced Bot Settings
                <RefreshCw className={`h-4 w-4 transition-transform ${isConfigExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="space-y-4 p-4 rounded-lg bg-black/20 border border-purple-600/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-purple-300">Bot Name</Label>
                    <Input
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                      placeholder="Wallet Analyzer Bot"
                      disabled={isRunning}
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300">Bot Description</Label>
                    <Input
                      value={botDescription}
                      onChange={(e) => setBotDescription(e.target.value)}
                      placeholder="Blockchain wallet analyzer"
                      disabled={isRunning}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-purple-300">Welcome Message</Label>
                  <Textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    placeholder="Welcome message for new users"
                    disabled={isRunning}
                    rows={4}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

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
              <Badge className="bg-purple-500 flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Active & Analyzing
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
                disabled={!canDeploy}
                className="bg-purple-600 hover:bg-purple-700 flex-1"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                🚀 Deploy Wallet Analyzer Bot
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

      {/* Wallet Configuration Display */}
      <Card className="border-purple-600/20 bg-gradient-to-br from-purple-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-300">🛠️ Wallet Analyzer Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-400/70">Supported Blockchains:</span>
                <span className="text-purple-300">Ethereum, Solana</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400/70">Transaction Limit:</span>
                <span className="text-purple-300">{walletConfig.transactionLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400/70">Include Tokens:</span>
                <span className="text-purple-300">{walletConfig.includeTokens ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400/70">Include NFTs:</span>
                <span className="text-purple-300">{walletConfig.includeNFTs ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-400/70">Generate Charts:</span>
                <span className="text-purple-300">{walletConfig.generateCharts ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400/70">PDF Reports:</span>
                <span className="text-purple-300">{walletConfig.generateReports ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400/70">Risk Assessment:</span>
                <span className="text-purple-300">{walletConfig.riskAssessment ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400/70">Portfolio Analysis:</span>
                <span className="text-purple-300">{walletConfig.portfolioAnalysis ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bot Status & Logs */}
      {isRunning && (
        <Card className="border-purple-600/20 bg-gradient-to-br from-purple-950/20 to-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Live Bot Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-2 p-4 rounded-lg bg-black/40 border border-purple-600/20">
                  {messages.slice(-10).map((message, index) => (
                    <div key={index} className="text-sm text-purple-400 font-mono">
                      {message}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-purple-900/10 border border-purple-600/20 text-center">
                  <p className="text-purple-400/70 text-sm">
                    🎯 Bot is ready! Send a wallet address to your bot on Telegram to see analysis here.
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
          <strong>Prerequisites:</strong> Your wallet analyzer workflow should have wallet input, transaction fetcher, 
          analytics, and report nodes configured. The bot will analyze wallet addresses and provide comprehensive insights.
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
                <strong>Configure Workflow:</strong> Ensure your wallet analyzer nodes are properly configured
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold">3</div>
              <div className="text-amber-300">
                <strong>Deploy:</strong> Paste your bot token above and click "Deploy Wallet Analyzer Bot"
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold">4</div>
              <div className="text-amber-300">
                <strong>Test:</strong> Send a wallet address to your bot and get detailed analysis! 📊
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-blue-900/20 border border-blue-600/30">
            <p className="text-blue-300 text-sm font-medium mb-2">💡 Example Wallet Addresses for Testing:</p>
            <div className="space-y-1 text-xs text-blue-400/80">
              <div className="flex items-center justify-between">
                <span>Ethereum:</span>
                <button 
                  onClick={() => copyToClipboard('0x742d35Cc6634C0532925a3b8D400fD0d56c2f1c4', 'Ethereum address')}
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  0x742d35Cc6634C0532925a3b8D400fD0d56c2f1c4
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Solana:</span>
                <button 
                  onClick={() => copyToClipboard('DRpbCBMxVnDK7maPM5tGv6MvB3v1sRMC86PZ8okm21hy', 'Solana address')}
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  DRpbCBMxVnDK7maPM5tGv6MvB3v1sRMC86PZ8okm21hy
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 