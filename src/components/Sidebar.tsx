import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bot,
  MessageSquare,
  Zap,
  Database,
  Globe,
  Image,
  Settings,
  Workflow,
  ChevronDown,
  ChevronRight,
  ArrowDownUp,
  GitBranch,
  MessageCircle,
  Send,
  Filter,
  Video,
  Download,
  Scissors,
  Type,
  Upload,
  Phone,
  Server,
  Cpu,
  Network,
  Shield,
  Terminal,
  Code,
  Layers,
  Sparkles,
  Bell,
  FileText,
  Calendar,
  Search,
  Eye,
  BarChart3,
  CreditCard,
  Share2,
  Newspaper,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Activity,
  Cloud,
  Scale,
  Heart,
  Rocket,
  HardDrive,
  Lock,
  Gauge,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  savedFlows: {
    name: string;
    data: any;
  }[];
  onLoadFlow: (index: number) => void;
  onLoadTemplate: (templateData: any) => void;
}

const nodeCategories = [
  {
    title: "Core Systems",
    icon: Cpu,
    nodes: [
      {
        type: "system",
        label: "System Core",
        description: "Defines AI behavior & personality",
        icon: Settings,
        color: "#00ff00",
      },
      {
        type: "input",
        label: "Input Processor",
        description: "Processes user messages",
        icon: MessageSquare,
        color: "#00cc00",
      },
      {
        type: "output",
        label: "Output Generator",
        description: "Generates AI reply",
        icon: Bot,
        color: "#00ff00",
      },
    ],
  },
  {
    title: "AI Processing",
    icon: Sparkles,
    nodes: [
      {
        type: "aimodel",
        label: "AI Model",
        description: "OpenAI, Claude, or custom AI models",
        icon: Bot,
        color: "#00ff00",
      },
      {
        type: "action",
        label: "Action Executor",
        description: "Performs a specific task",
        icon: Zap,
        color: "#00cc00",
      },
      {
        type: "tool",
        label: "Custom Tool",
        description: "Custom tools and functions",
        icon: Settings,
        color: "#00ff00",
      },
      {
        type: "condition",
        label: "Logic Gate",
        description: "Conditional logic for flows",
        icon: Filter,
        color: "#00cc00",
      },
    ],
  },
  {
    title: "Communication Hub",
    icon: Network,
    nodes: [
      {
        type: "callautomation",
        label: "Call Automation",
        description: "AI-powered phone call automation",
        icon: Phone,
        color: "#00ff00",
      },
      {
        type: "notification",
        label: "Notifications",
        description: "Send alerts and notifications",
        icon: Bell,
        color: "#00cc00",
      },
    ],
  },
  {
    title: "Business Automation",
    icon: Workflow,
    nodes: [
      {
        type: "meetingcreator",
        label: "Meeting Creator",
        description: "Schedule and manage meetings",
        icon: Calendar,
        color: "#00ff00",
      },
      {
        type: "calendartrigger",
        label: "Calendar Trigger",
        description: "Calendar-based automation",
        icon: Calendar,
        color: "#00cc00",
      },
      {
        type: "paymentprocessor",
        label: "Payment Processor",
        description: "Handle payments and transactions",
        icon: CreditCard,
        color: "#00ff00",
      },
      {
        type: "datalogger",
        label: "Data Logger",
        description: "Log and track data points",
        icon: FileText,
        color: "#00cc00",
      },
    ],
  },
  {
    title: "Analytics & SEO",
    icon: BarChart3,
    nodes: [
      {
        type: "seoanalyzer",
        label: "SEO Analyzer",
        description: "Analyze website SEO performance",
        icon: Search,
        color: "#00ff00",
      },
      {
        type: "analytics",
        label: "Analytics",
        description: "Track and analyze metrics",
        icon: BarChart3,
        color: "#00cc00",
      },
      {
        type: "a11ytest",
        label: "Accessibility Test",
        description: "Test website accessibility",
        icon: Eye,
        color: "#00ff00",
      },
    ],
  },
  {
    title: "Social & Content",
    icon: Share2,
    nodes: [
      {
        type: "socialmedia",
        label: "Social Media",
        description: "Manage social media posts",
        icon: Share2,
        color: "#00ff00",
      },
      {
        type: "newsaggregator",
        label: "News Aggregator",
        description: "Collect and analyze news",
        icon: Newspaper,
        color: "#00cc00",
      },
    ],
  },
  {
    title: "Financial Data",
    icon: DollarSign,
    nodes: [
      {
        type: "stockdata",
        label: "Stock Data",
        description: "Real-time stock market data",
        icon: TrendingUp,
        color: "#00ff00",
      },
      {
        type: "currencyconverter",
        label: "Currency Converter",
        description: "Convert between currencies",
        icon: DollarSign,
        color: "#00cc00",
      },
    ],
  },
  {
    title: "Infrastructure",
    icon: Server,
    nodes: [
      {
        type: "cdn",
        label: "CDN Manager",
        description: "Content delivery network",
        icon: Cloud,
        color: "#00ff00",
      },
      {
        type: "loadbalancer",
        label: "Load Balancer",
        description: "Distribute traffic load",
        icon: Scale,
        color: "#00cc00",
      },
      {
        type: "deployment",
        label: "Deployment",
        description: "Deploy applications",
        icon: Rocket,
        color: "#00ff00",
      },
      {
        type: "backup",
        label: "Backup System",
        description: "Data backup and recovery",
        icon: HardDrive,
        color: "#00cc00",
      },
      {
        type: "migration",
        label: "Data Migration",
        description: "Migrate data between systems",
        icon: ArrowDownUp,
        color: "#00ff00",
      },
    ],
  },
  {
    title: "Monitoring & Security",
    icon: Shield,
    nodes: [
      {
        type: "healthcheck",
        label: "Health Check",
        description: "Monitor system health",
        icon: Heart,
        color: "#00ff00",
      },
      {
        type: "monitoring",
        label: "System Monitor",
        description: "Monitor system performance",
        icon: Activity,
        color: "#00cc00",
      },
      {
        type: "performancemonitor",
        label: "Performance Monitor",
        description: "Track application performance",
        icon: Gauge,
        color: "#00ff00",
      },
      {
        type: "securityscanner",
        label: "Security Scanner",
        description: "Scan for security vulnerabilities",
        icon: Lock,
        color: "#00cc00",
      },
      {
        type: "alert",
        label: "Alert System",
        description: "System alerts and warnings",
        icon: AlertTriangle,
        color: "#00ff00",
      },
    ],
  },
  {
    title: "YouTube Engine",
    icon: Video,
    nodes: [
      {
        type: "youtubeinput",
        label: "YouTube Input",
        description: "Accept YouTube video links",
        icon: Video,
        color: "#00cc00",
      },
      {
        type: "videofetcher",
        label: "Video Fetcher",
        description: "Download and process videos",
        icon: Download,
        color: "#00ff00",
      },
      {
        type: "videotranscriber",
        label: "Transcriber",
        description: "Convert speech to text",
        icon: MessageSquare,
        color: "#00cc00",
      },
      {
        type: "viralclipdetector",
        label: "Viral Detector",
        description: "AI-powered viral content detection",
        icon: Zap,
        color: "#00ff00",
      },
      {
        type: "autoclipper",
        label: "Auto Clipper",
        description: "Generate short clips automatically",
        icon: Scissors,
        color: "#00cc00",
      },
      {
        type: "captionadder",
        label: "Caption Adder",
        description: "Add captions to video clips",
        icon: Type,
        color: "#00ff00",
      },
      {
        type: "localfilesaver",
        label: "Local File Saver",
        description: "Download MP4 videos locally",
        icon: Download,
        color: "#00cc00",
      },
      {
        type: "pdfgenerator",
        label: "PDF Generator",
        description: "Generate and download PDF files",
        icon: Download,
        color: "#00ff00",
      },
    ],
  },
  {
    title: "Telegram Advanced",
    icon: MessageCircle,
    nodes: [
      {
        type: "telegramcondition",
        label: "Condition",
        description: "Conditional logic for messages",
        icon: GitBranch,
        color: "#00cc00",
      },
      {
        type: "telegramuserinput",
        label: "User Input",
        description: "Advanced input processing",
        icon: MessageCircle,
        color: "#00ff00",
      },
      {
        type: "telegramdata",
        label: "Data Handler",
        description: "Process and store data",
        icon: Database,
        color: "#00cc00",
      },
      {
        type: "telegramresponse",
        label: "Response",
        description: "Formatted Telegram responses",
        icon: Send,
        color: "#00ff00",
      },
    ],
  },
  {
    title: "Integration Layer",
    icon: Layers,
    nodes: [
      {
        type: "api",
        label: "API Connector",
        description: "Connects to external services",
        icon: Globe,
        color: "#00cc00",
      },
      {
        type: "webhook",
        label: "Webhook",
        description: "Send data to external endpoints",
        icon: Zap,
        color: "#00ff00",
      },
      {
        type: "vectorstore",
        label: "Vector Store",
        description: "Store and search embeddings",
        icon: Database,
        color: "#00cc00",
      },
      {
        type: "memory",
        label: "Memory Bank",
        description: "Store conversation context",
        icon: Database,
        color: "#00ff00",
      },
      {
        type: "customcommands",
        label: "Custom Commands",
        description: "Define custom bot commands",
        icon: ArrowDownUp,
        color: "#00cc00",
      },
      {
        type: "mcp",
        label: "MCP Server",
        description: "Model Context Protocol tools",
        icon: Server,
        color: "#00ff00",
      },
    ],
  },
  {
    title: "Blockchain Analytics",
    icon: DollarSign,
    nodes: [
      {
        type: "walletinput",
        label: "Wallet Input",
        description: "Input blockchain wallet address",
        icon: DollarSign,
        color: "#00ff00",
      },
      {
        type: "transactionfetcher",
        label: "Transaction Fetcher",
        description: "Fetch blockchain transaction data",
        icon: Database,
        color: "#00cc00",
      },
      {
        type: "walletanalytics",
        label: "Wallet Analytics",
        description: "Generate analytics and insights",
        icon: BarChart3,
        color: "#00ff00",
      },
      {
        type: "walletreport",
        label: "Wallet Report",
        description: "Generate PDF transaction report",
        icon: FileText,
        color: "#00cc00",
      },
    ],
  },
];

const templates = [
  {
    name: "YouTube AI Summarizer",
    description:
      "Analyze YouTube videos and generate AI summaries with custom instructions",
    icon: "🎥",
    category: "Content Analysis",
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
          instructions:
            "Summarize the video content in 5 bullet points highlighting the main topics and key insights.",
        },
      },
      {
        id: "pdf-1",
        type: "pdfgenerator",
        position: { x: 100, y: 400 },
        data: {
          label: "PDF Generator",
          description: "Generate PDF summary",
          content: JSON.stringify(
            {
              provider: "OpenAI",
              model: "gpt-4o-mini",
              apiKey: "",
              temperature: 0.7,
              maxTokens: 1000,
            },
            null,
            2
          ),
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
        target: "pdf-1",
        type: "smoothstep",
      },
    ],
  },
  {
    name: "Basic AI Chat",
    description:
      "Simple AI conversation flow with system prompt and user input",
    icon: "🤖",
    category: "Conversation",
    nodes: [
      {
        id: "system-1",
        type: "system",
        position: { x: 100, y: 100 },
        data: {
          label: "AI Personality",
          description: "Define AI behavior",
          content:
            "You are a helpful AI assistant that provides clear and concise answers.",
        },
      },
      {
        id: "input-1",
        type: "input",
        position: { x: 100, y: 250 },
        data: {
          label: "User Input",
          description: "Process user messages",
          inputName: "userMessage",
        },
      },
      {
        id: "aimodel-1",
        type: "aimodel",
        position: { x: 100, y: 400 },
        data: {
          label: "AI Processor",
          description: "Process with AI",
          instructions:
            "Provide a helpful and concise response to the user's question.",
          provider: "OpenAI",
          model: "gpt-4o-mini",
          temperature: "0.7",
          maxTokens: "1000",
        },
      },
      {
        id: "output-1",
        type: "output",
        position: { x: 250, y: 500 },
        data: {
          label: "AI Response",
          description: "Return the result",
          outputName: "aiResponse",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "system-1",
        target: "aimodel-1",
        type: "smoothstep",
      },
      {
        id: "e2",
        source: "input-1",
        target: "aimodel-1",
        type: "smoothstep",
      },
      {
        id: "e3",
        source: "aimodel-1",
        target: "output-1",
        type: "smoothstep",
      },
    ],
  },
  {
    name: "Social Media Content Pipeline",
    description:
      "Automated content creation and publishing pipeline for social media platforms",
    icon: "📱",
    category: "Content Analysis",
    nodes: [
      {
        id: "input-1",
        type: "input",
        position: { x: 100, y: 100 },
        data: {
          label: "Content Topic Input",
          description: "Enter content topic or theme",
          inputName: "contentTopic",
        },
      },
      {
        id: "ai-1",
        type: "aimodel",
        position: { x: 100, y: 250 },
        data: {
          label: "Content Creator AI",
          description: "Generate social media content",
          instructions:
            "Create engaging social media posts based on the provided topic. Include hashtags, emojis, and call-to-action. Generate 3 different variations for different platforms (Twitter, LinkedIn, Facebook).",
          provider: "OpenAI",
          model: "gpt-4o-mini",
        },
      },
      {
        id: "socialmedia-1",
        type: "socialmedia",
        position: { x: 100, y: 400 },
        data: {
          label: "Multi-Platform Publisher",
          description: "Publish to social platforms",
          platforms: ["twitter", "linkedin", "facebook"],
          scheduleTime: "optimal",
        },
      },
      {
        id: "output-1",
        type: "output",
        position: { x: 100, y: 550 },
        data: {
          label: "Publishing Results",
          description: "View publishing results and analytics",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "input-1",
        target: "ai-1",
        type: "smoothstep",
      },
      {
        id: "e2",
        source: "ai-1",
        target: "socialmedia-1",
        type: "smoothstep",
      },
      {
        id: "e3",
        source: "socialmedia-1",
        target: "output-1",
        type: "smoothstep",
      },
    ],
  },
  {
    name: "Wallet Transaction Analyzer",
    description:
      "Comprehensive blockchain wallet analysis with transaction history, analytics, and PDF reports",
    icon: "💰",
    category: "Blockchain Analytics",
    nodes: [
      {
        id: "wallet-input-1",
        type: "walletinput",
        position: { x: 100, y: 100 },
        data: {
          label: "Wallet Address Input",
          description: "Enter blockchain wallet address",
          blockchain: "ethereum",
          configured: false,
        },
      },
      {
        id: "transaction-fetcher-1",
        type: "transactionfetcher",
        position: { x: 100, y: 250 },
        data: {
          label: "Transaction Data Fetcher",
          description: "Fetch transaction history from blockchain",
          apiProvider: "etherscan",
          transactionLimit: 1000,
          dateRange: "last_30_days",
          includeTokens: true,
          includeNFTs: true,
        },
      },
      {
        id: "wallet-analytics-1",
        type: "walletanalytics",
        position: { x: 100, y: 400 },
        data: {
          label: "Analytics Generator",
          description: "Generate wallet insights and analytics",
          analysisType: "comprehensive",
          generateCharts: true,
          includePatterns: true,
          riskAssessment: true,
          portfolioAnalysis: true,
        },
      },
      {
        id: "wallet-report-1",
        type: "walletreport",
        position: { x: 100, y: 550 },
        data: {
          label: "PDF Report Generator",
          description: "Generate downloadable transaction report",
          reportFormat: "comprehensive",
          includeCharts: true,
          includeTransactionList: true,
          includeSummary: true,
          watermark: true,
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "wallet-input-1",
        target: "transaction-fetcher-1",
        type: "smoothstep",
      },
      {
        id: "e2",
        source: "transaction-fetcher-1",
        target: "wallet-analytics-1",
        type: "smoothstep",
      },
      {
        id: "e3",
        source: "wallet-analytics-1",
        target: "wallet-report-1",
        type: "smoothstep",
      },
    ],
  },
];

const Sidebar = ({ savedFlows, onLoadFlow, onLoadTemplate }: SidebarProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {
      "Core Systems": true,
      "AI Processing": false,
      "Communication Hub": false,
      "YouTube Engine": false,
      "Telegram Advanced": false,
      "Integration Layer": false,
      "Blockchain Analytics": false,
    }
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Group templates by category
  const templateCategories = templates.reduce((acc, template) => {
    const category = template.category || "Basic";
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, typeof templates>);

  const loadTemplate = (template: any) => {
    onLoadTemplate(template);
    toast({
      title: "Template loaded",
      description: `${template.name} has been loaded into your canvas`,
    });
  };

  return (
    <div
      className={`matrix-bg-glass matrix-border-r h-full flex flex-col backdrop-blur-xl ${
        isMobile ? "w-full" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`border-b border-green-600/30 ${isMobile ? "p-3" : "p-4"}`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`${
              isMobile ? "h-6 w-6" : "h-8 w-8"
            } rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center`}
          >
            <Workflow
              className={`text-black ${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
            />
            </div>
          <div>
            <h2
              className={`font-bold matrix-text-glow ${
                isMobile ? "text-sm" : "text-lg"
              }`}
            >
              Component Library
            </h2>
            <p
              className={`text-green-400/70 font-mono ${
                isMobile ? "text-xs hidden sm:block" : "text-sm"
              }`}
            >
              Drag & Drop Components
            </p>
          </div>
          </div>
      </div>
      
      {/* Content */}
      <ScrollArea className="flex-1">
        <div className={isMobile ? "p-2 space-y-3" : "p-4 space-y-4"}>
          {/* Node Categories */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`${
                  isMobile ? "h-4 w-4" : "h-6 w-6"
                } rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center`}
              >
                <Layers
                  className={`text-black ${isMobile ? "h-2 w-2" : "h-3 w-3"}`}
                />
              </div>
              <h3
                className={`font-bold matrix-text-glow uppercase tracking-wider ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                Nodes
            </h3>
            </div>

            <div className={isMobile ? "space-y-2" : "space-y-4"}>
              {nodeCategories.map((category) => {
                const isOpen = openCategories[category.title];
                return (
                  <Collapsible
                    key={category.title}
                    open={isOpen}
                    onOpenChange={() => toggleCategory(category.title)}
                  >
                  <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-between matrix-text hover:matrix-hover ${
                          isMobile ? "h-8 text-xs px-2" : "h-10 text-sm"
                        }`}
                      >
                        <span className="font-mono">{category.title}</span>
                        {isOpen ? (
                          <ChevronDown
                            className={isMobile ? "h-3 w-3" : "h-4 w-4"}
                          />
                        ) : (
                          <ChevronRight
                            className={isMobile ? "h-3 w-3" : "h-4 w-4"}
                          />
                        )}
                    </Button>
                  </CollapsibleTrigger>
                    <CollapsibleContent
                      className={isMobile ? "space-y-1" : "space-y-2"}
                    >
                      {category.nodes.map((node, index) => {
                  const IconComponent = node.icon;
                        return (
                          <div
                            key={index}
                            draggable
                            onDragStart={(e) => onDragStart(e, node.type)}
                            className={`group cursor-grab active:cursor-grabbing matrix-bg-glass matrix-border rounded-lg matrix-hover transition-all duration-300 hover:scale-[1.02] hover:matrix-border-glow ${
                              isMobile ? "p-2" : "p-3"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`${
                                  isMobile ? "h-6 w-6" : "h-8 w-8"
                                } rounded-lg bg-gradient-to-br ${
                                  node.color
                                } flex items-center justify-center`}
                              >
                                <IconComponent
                                  className={`text-black ${
                                    isMobile ? "h-3 w-3" : "h-4 w-4"
                                  }`}
                                />
                          </div>
                          <div className="flex-1 min-w-0">
                                <div
                                  className={`font-medium matrix-text group-hover:matrix-text-glow ${
                                    isMobile ? "text-xs" : "text-sm"
                                  }`}
                                >
                                  {node.label}
                          </div>
                                <div
                                  className={`text-green-300/70 font-mono truncate ${
                                    isMobile ? "text-xs hidden" : "text-xs"
                                  }`}
                                >
                                  {node.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                })}
                  </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </div>

          <Separator className="bg-green-600/30" />

          {/* Templates */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`${
                  isMobile ? "h-4 w-4" : "h-6 w-6"
                } rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center`}
              >
                <Layers
                  className={`text-black ${isMobile ? "h-2 w-2" : "h-3 w-3"}`}
                />
              </div>
              <h3
                className={`font-bold matrix-text-glow uppercase tracking-wider ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
              Templates
            </h3>
                            </div>

            <div className={isMobile ? "space-y-2" : "space-y-4"}>
              {Object.entries(templateCategories).map(
                ([categoryName, categoryTemplates]) => (
                  <div key={categoryName}>
                    <h4
                      className={`text-green-400/80 mb-2 uppercase tracking-wide font-mono ${
                        isMobile ? "text-xs" : "text-xs"
                      } font-bold`}
                    >
                      {categoryName}
                    </h4>
                    <div className={isMobile ? "space-y-1" : "space-y-3"}>
                      {categoryTemplates.map((template, index) => (
                        <Card
                          key={index}
                          className={`cursor-pointer matrix-hover matrix-border matrix-bg-glass hover:matrix-border-glow transition-all duration-300 hover:scale-[1.02] group ${
                            isMobile ? "" : ""
                          }`}
                          onClick={() => loadTemplate(template)}
                        >
                          <CardHeader className={isMobile ? "p-2" : "p-4"}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`${
                                  isMobile ? "h-6 w-6" : "h-8 w-8"
                                } rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center flex-shrink-0`}
                              >
                                <span
                                  className={`${
                                    isMobile ? "text-xs" : "text-sm"
                                  }`}
                                >
                                  {template.icon}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle
                                  className={`matrix-text group-hover:matrix-text-glow ${
                                    isMobile ? "text-xs" : "text-sm"
                                  }`}
                                >
                                  {template.name}
                          </CardTitle>
                                <CardDescription
                                  className={`text-green-300/70 font-mono ${
                                    isMobile
                                      ? "text-xs line-clamp-1"
                                      : "text-xs"
                                  }`}
                                >
                                  {template.description}
                                </CardDescription>
                  </div>
            </div>
                          </CardHeader>
                        </Card>
                      ))}
          </div>
                          </div>
                )
              )}
                </div>
              </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
