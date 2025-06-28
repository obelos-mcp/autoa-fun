import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Webhook, Code, Globe, X, Zap, Lock, Youtube, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TelegramIntegration } from "./TelegramIntegration";
import { BasicAIChatTelegramIntegration } from "./BasicAIChatTelegramIntegration";
import { YouTubeAISummarizerTelegramIntegration } from "./YouTubeAISummarizerTelegramIntegration";
import { WalletTransactionAnalyzerTelegramIntegration } from "./WalletTransactionAnalyzerTelegramIntegration";
import MCPGuide from "./MCPGuide";
import { useIsMobile } from "@/hooks/use-mobile";
import { TemplateDetectionService } from "@/services/templateDetectionService";

interface IntegrationPanelProps {
  nodes: any[];
  edges: any[];
  onClose: () => void;
}

const IntegrationPanel = React.memo(
  ({ nodes, edges, onClose }: IntegrationPanelProps) => {
    const isMobile = useIsMobile();
    const flowData = { nodes, edges };
    
    // Detect current template
    const templateInfo = TemplateDetectionService.detectTemplate(nodes, edges);
    const isBasicAIChat = templateInfo.isBasicAIChat;
    const isYouTubeAISummarizer = templateInfo.isYouTubeAISummarizer;
    const isWalletTransactionAnalyzer = templateInfo.isWalletTransactionAnalyzer;
    const isSpecialTemplate = isBasicAIChat || isYouTubeAISummarizer || isWalletTransactionAnalyzer;

    // Coming Soon Card Component
    const ComingSoonCard = ({ 
      icon: Icon, 
      title, 
      description, 
      features,
      templateName 
    }: { 
      icon: any, 
      title: string, 
      description: string, 
      features: string[],
      templateName: string
    }) => (
      <Card className="h-full border-amber-600/20 bg-gradient-to-br from-amber-950/20 to-black/40 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center relative">
              <Icon className="h-5 w-5 text-black" />
              <Lock className="h-3 w-3 text-amber-900 absolute -top-1 -right-1" />
            </div>
            <div>
              <CardTitle className="matrix-text-glow text-lg flex items-center gap-2">
                {title}
                <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                  Coming Soon
                </Badge>
              </CardTitle>
              <CardDescription className="text-amber-400/60">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-900/10 border border-amber-600/20">
              <p className="text-amber-400/80 text-sm leading-relaxed">
                🚀 <strong>Coming Soon for {templateName}!</strong> This deployment method will be available in the next update.
              </p>
            </div>
            <div className="grid gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-amber-400/70">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-blue-900/10 border border-blue-600/20">
              <p className="text-blue-400/80 text-xs leading-relaxed">
                💡 <strong>For now:</strong> Use the Telegram Bot deployment to get your {templateName} live instantly!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="matrix-modal border-0 p-0 gap-0 overflow-hidden">
          {/* Clean Header */}
          <DialogHeader className="modal-header flex flex-row items-center justify-between space-y-0 p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br flex items-center justify-center ${
                isYouTubeAISummarizer 
                  ? 'from-red-500 to-red-700' 
                  : isWalletTransactionAnalyzer
                  ? 'from-purple-500 to-purple-700'
                  : 'from-green-500 to-green-700'
              }`}>
                {isYouTubeAISummarizer ? (
                  <Youtube className="h-4 w-4 text-white" />
                ) : isWalletTransactionAnalyzer ? (
                  <Wallet className="h-4 w-4 text-white" />
                ) : (
                  <Zap className="h-4 w-4 text-black" />
                )}
              </div>
              <div>
                <DialogTitle className="matrix-text-glow text-xl font-bold">
                  Deploy {templateInfo.name}
                </DialogTitle>
                <p className="text-green-400/60 text-sm font-mono">
                  {isBasicAIChat 
                    ? "🤖 AI Chat Bot Deployment" 
                    : isYouTubeAISummarizer 
                    ? "🎥 YouTube Video Summarizer Bot"
                    : isWalletTransactionAnalyzer
                    ? "💰 Blockchain Wallet Analyzer Bot"
                    : "Choose your deployment method"
                  }
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-green-900/30 text-green-400 hover:text-green-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {/* Template Info Banner */}
          {isSpecialTemplate && (
            <div className={`mx-6 mb-4 p-3 rounded-lg border ${
              isYouTubeAISummarizer 
                ? 'bg-red-900/20 border-red-600/30' 
                : isWalletTransactionAnalyzer
                ? 'bg-purple-900/20 border-purple-600/30'
                : 'bg-green-900/20 border-green-600/30'
            }`}>
              <div className="flex items-center gap-2 text-sm">
                {isYouTubeAISummarizer ? (
                  <Youtube className="h-4 w-4 text-red-400" />
                ) : isWalletTransactionAnalyzer ? (
                  <Wallet className="h-4 w-4 text-purple-400" />
                ) : (
                  <Bot className="h-4 w-4 text-green-400" />
                )}
                <span className={`font-medium ${
                  isYouTubeAISummarizer ? 'text-red-300' : isWalletTransactionAnalyzer ? 'text-purple-300' : 'text-green-300'
                }`}>
                  {templateInfo.name} Template Detected
                </span>
                <Badge variant="outline" className={`text-xs ${
                  isYouTubeAISummarizer 
                    ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                    : isWalletTransactionAnalyzer
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    : 'bg-green-500/20 text-green-400 border-green-500/30'
                }`}>
                  Optimized for Telegram
                </Badge>
              </div>
              <p className={`text-xs mt-1 ${
                isYouTubeAISummarizer ? 'text-red-400/70' : isWalletTransactionAnalyzer ? 'text-purple-400/70' : 'text-green-400/70'
              }`}>
                {isYouTubeAISummarizer 
                  ? "Perfect for analyzing YouTube videos with AI summaries and PDF reports. Telegram deployment is ready!"
                  : isWalletTransactionAnalyzer
                  ? "Perfect for analyzing blockchain wallets with transaction insights and risk assessment. Telegram deployment is ready!"
                  : "Perfect for creating conversational AI bots. Telegram deployment is ready to use!"
                }
              </p>
            </div>
          )}

          {/* Clean Content */}
          <div className="flex-1 overflow-hidden px-6 pb-6">
            <Tabs defaultValue="telegram" className="h-full flex flex-col">
              {/* Clean Tabs */}
              <TabsList
                className={`
              clean-tabs mb-6 h-auto p-1
              ${
                isMobile ? "grid grid-cols-2 gap-1" : "flex justify-start gap-1"
              }
            `}
              >
                <TabsTrigger
                  value="telegram"
                  className={`
                  clean-tab-trigger flex items-center gap-2 px-4 py-3
                  ${isMobile ? "text-sm" : "text-base"}
                `}
                >
                  <Bot className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
                  <span>Telegram Bot</span>
                  {isSpecialTemplate && (
                    <Badge variant="default" className={`text-xs ml-1 ${
                      isYouTubeAISummarizer ? 'bg-red-600' : isWalletTransactionAnalyzer ? 'bg-purple-600' : 'bg-green-600'
                    }`}>
                      Ready
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="mcp"
                  className={`
                  clean-tab-trigger flex items-center gap-2 px-4 py-3
                  ${isMobile ? "text-sm" : "text-base"}
                `}
                >
                  <Code className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
                  <span>MCP Server</span>
                  {isSpecialTemplate && (
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs ml-1">
                      Soon
                    </Badge>
                  )}
                </TabsTrigger>
                {!isMobile && (
                  <>
                    <TabsTrigger
                      value="webhook"
                      className="clean-tab-trigger flex items-center gap-2 px-4 py-3"
                    >
                      <Webhook className="h-5 w-5" />
                      <span>Webhook</span>
                      {isSpecialTemplate && (
                        <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs ml-1">
                          Soon
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="api"
                      className="clean-tab-trigger flex items-center gap-2 px-4 py-3"
                    >
                      <Code className="h-5 w-5" />
                      <span>REST API</span>
                      {isSpecialTemplate && (
                        <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs ml-1">
                          Soon
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="web"
                      className="clean-tab-trigger flex items-center gap-2 px-4 py-3"
                    >
                      <Globe className="h-5 w-5" />
                      <span>Web Embed</span>
                      {isSpecialTemplate && (
                        <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs ml-1">
                          Soon
                        </Badge>
                      )}
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              {/* Mobile: Second row of tabs */}
              {isMobile && (
                <TabsList className="clean-tabs mb-6 h-auto p-1 grid grid-cols-3 gap-1">
                  <TabsTrigger
                    value="webhook"
                    className="clean-tab-trigger flex items-center gap-2 px-3 py-2 text-sm"
                  >
                    <Webhook className="h-4 w-4" />
                    <span>Webhook</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="api"
                    className="clean-tab-trigger flex items-center gap-2 px-3 py-2 text-sm"
                  >
                    <Code className="h-4 w-4" />
                    <span>API</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="web"
                    className="clean-tab-trigger flex items-center gap-2 px-3 py-2 text-sm"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Web</span>
                  </TabsTrigger>
                </TabsList>
              )}

              {/* Clean Content Area */}
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="telegram" className="mt-0 h-full">
                  <div className="h-full">
                    {isBasicAIChat ? (
                      <BasicAIChatTelegramIntegration flowData={flowData} />
                    ) : isYouTubeAISummarizer ? (
                      <YouTubeAISummarizerTelegramIntegration flowData={flowData} />
                    ) : isWalletTransactionAnalyzer ? (
                      <WalletTransactionAnalyzerTelegramIntegration flowData={flowData} />
                    ) : (
                      <TelegramIntegration flowData={flowData} />
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="mcp" className="mt-0 h-full">
                  <div className="h-full">
                    {isSpecialTemplate ? (
                      <ComingSoonCard
                        icon={Code}
                        title="MCP Server"
                        description={isYouTubeAISummarizer 
                          ? "Model Context Protocol integration for YouTube analysis"
                          : isWalletTransactionAnalyzer
                          ? "Model Context Protocol integration for blockchain analysis"
                          : "Model Context Protocol integration"
                        }
                        features={isYouTubeAISummarizer ? [
                          "Claude Desktop integration",
                          "YouTube video context analysis",
                          "Advanced summarization memory"
                        ] : isWalletTransactionAnalyzer ? [
                          "Claude Desktop integration",
                          "Blockchain wallet context analysis",
                          "Transaction pattern memory"
                        ] : [
                          "Claude Desktop integration",
                          "Local AI model context",
                          "Advanced conversation memory"
                        ]}
                        templateName={templateInfo.name}
                      />
                    ) : (
                      <MCPGuide />
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="webhook" className="mt-0 h-full">
                  {isSpecialTemplate ? (
                    <ComingSoonCard
                      icon={Webhook}
                      title="Webhook Integration"
                      description={isYouTubeAISummarizer 
                        ? "HTTP endpoints for YouTube video processing"
                        : isWalletTransactionAnalyzer
                        ? "HTTP endpoints for wallet analysis processing"
                        : "HTTP endpoints for your AI chat"
                      }
                      features={isYouTubeAISummarizer ? [
                        "YouTube URL webhook endpoints",
                        "Automated video processing",
                        "PDF generation webhooks"
                      ] : isWalletTransactionAnalyzer ? [
                        "Wallet address webhook endpoints",
                        "Automated transaction analysis",
                        "Risk assessment webhooks"
                      ] : [
                        "HTTP POST endpoints",
                        "Authentication & rate limiting",
                        "Real-time chat webhooks"
                      ]}
                      templateName={templateInfo.name}
                    />
                  ) : (
                    <Card className="h-full border-green-600/20 bg-gradient-to-br from-green-950/20 to-black/40 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                            <Webhook className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <CardTitle className="matrix-text-glow text-lg">
                              Webhook Integration
                            </CardTitle>
                            <CardDescription className="text-green-400/60">
                              Create HTTP endpoints for your AI workflow
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-green-900/10 border border-green-600/20">
                            <p className="text-green-400/80 text-sm leading-relaxed">
                              🚀 <strong>Coming Soon!</strong> Generate webhook
                              endpoints that can be triggered by external
                              services.
                            </p>
                          </div>
                          <div className="grid gap-3">
                            <div className="flex items-center gap-2 text-sm text-green-400/70">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>HTTP POST endpoints</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400/70">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>Authentication & rate limiting</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400/70">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>Real-time execution logs</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="api" className="mt-0 h-full">
                  {isSpecialTemplate ? (
                    <ComingSoonCard
                      icon={Code}
                      title="REST API"
                      description={isYouTubeAISummarizer 
                        ? "API endpoints for YouTube video analysis"
                        : isWalletTransactionAnalyzer
                        ? "API endpoints for blockchain wallet analysis"
                        : "API endpoints for your AI chat"
                      }
                      features={isYouTubeAISummarizer ? [
                        "YouTube URL processing API",
                        "Batch video analysis",
                        "PDF generation endpoints"
                      ] : isWalletTransactionAnalyzer ? [
                        "Wallet address processing API",
                        "Batch wallet analysis",
                        "Risk assessment endpoints"
                      ] : [
                        "OpenAPI 3.0 specification",
                        "Interactive API documentation",
                        "Chat API with conversation memory"
                      ]}
                      templateName={templateInfo.name}
                    />
                  ) : (
                    <Card className="h-full border-green-600/20 bg-gradient-to-br from-green-950/20 to-black/40 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                            <Code className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <CardTitle className="matrix-text-glow text-lg">
                              REST API
                            </CardTitle>
                            <CardDescription className="text-green-400/60">
                              Generate API endpoints for your workflow
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-green-900/10 border border-green-600/20">
                            <p className="text-green-400/80 text-sm leading-relaxed">
                              🚀 <strong>Coming Soon!</strong> Auto-generate REST
                              API endpoints with OpenAPI documentation.
                            </p>
                          </div>
                          <div className="grid gap-3">
                            <div className="flex items-center gap-2 text-sm text-green-400/70">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>OpenAPI 3.0 specification</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400/70">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>Interactive API documentation</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400/70">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>SDK generation for multiple languages</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="web" className="mt-0 h-full">
                  {isSpecialTemplate ? (
                    <ComingSoonCard
                      icon={Globe}
                      title="Web Integration"
                      description={isYouTubeAISummarizer 
                        ? "Embed YouTube analyzer in websites"
                        : isWalletTransactionAnalyzer
                        ? "Embed wallet analyzer in websites"
                        : "Embed your AI chat in websites"
                      }
                      features={isYouTubeAISummarizer ? [
                        "YouTube URL input widget",
                        "Embedded video analysis",
                        "Downloadable PDF reports"
                      ] : isWalletTransactionAnalyzer ? [
                        "Wallet address input widget",
                        "Embedded transaction analysis",
                        "Interactive risk dashboard"
                      ] : [
                        "Customizable chat widget",
                        "Responsive iframe embeds",
                        "JavaScript SDK integration"
                      ]}
                      templateName={templateInfo.name}
                    />
                  ) : (
                    <Card className="h-full border-green-600/20 bg-gradient-to-br from-green-950/20 to-black/40 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                            <Globe className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <CardTitle className="matrix-text-glow text-lg">
                              Web Integration
                            </CardTitle>
                            <CardDescription className="text-green-400/60">
                              Embed your AI workflow in websites
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-green-900/10 border border-green-600/20">
                            <p className="text-green-400/80 text-sm leading-relaxed">
                              🚀 <strong>Coming Soon!</strong> Generate embeddable
                              widgets and iframe code for websites.
                            </p>
                          </div>
                          <div className="grid gap-3">
                            <div className="flex items-center gap-2 text-sm text-green-400/70">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>Customizable widget themes</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400/70">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>Responsive iframe embeds</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400/70">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>JavaScript SDK integration</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

export default IntegrationPanel;
