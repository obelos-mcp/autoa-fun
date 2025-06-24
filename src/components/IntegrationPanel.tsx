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
import { Bot, Webhook, Code, Globe, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TelegramIntegration } from "./TelegramIntegration";
import MCPGuide from "./MCPGuide";
import { useIsMobile } from "@/hooks/use-mobile";

interface IntegrationPanelProps {
  nodes: any[];
  edges: any[];
  onClose: () => void;
}

const IntegrationPanel = React.memo(
  ({ nodes, edges, onClose }: IntegrationPanelProps) => {
    const isMobile = useIsMobile();
    const flowData = { nodes, edges };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="matrix-modal border-0 p-0 gap-0 overflow-hidden">
          {/* Clean Header */}
          <DialogHeader className="modal-header flex flex-row items-center justify-between space-y-0 p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <Zap className="h-4 w-4 text-black" />
              </div>
              <div>
                <DialogTitle className="matrix-text-glow text-xl font-bold">
                  Deploy Workflow
                </DialogTitle>
                <p className="text-green-400/60 text-sm font-mono">
                  Choose your deployment method
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
                </TabsTrigger>
                {!isMobile && (
                  <>
                    <TabsTrigger
                      value="webhook"
                      className="clean-tab-trigger flex items-center gap-2 px-4 py-3"
                    >
                      <Webhook className="h-5 w-5" />
                      <span>Webhook</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="api"
                      className="clean-tab-trigger flex items-center gap-2 px-4 py-3"
                    >
                      <Code className="h-5 w-5" />
                      <span>REST API</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="web"
                      className="clean-tab-trigger flex items-center gap-2 px-4 py-3"
                    >
                      <Globe className="h-5 w-5" />
                      <span>Web Embed</span>
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
                    <TelegramIntegration flowData={flowData} />
                  </div>
                </TabsContent>

                <TabsContent value="mcp" className="mt-0 h-full">
                  <div className="h-full">
                    <MCPGuide />
                  </div>
                </TabsContent>

                <TabsContent value="webhook" className="mt-0 h-full">
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
                </TabsContent>

                <TabsContent value="api" className="mt-0 h-full">
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
                </TabsContent>

                <TabsContent value="web" className="mt-0 h-full">
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
