import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Book,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Workflow,
  Bot,
  Shield,
  Globe,
  Zap,
  FileText,
  Target,
  Settings,
  Database,
  Users,
  Calendar,
  Menu,
  Download,
  Code,
  Cpu,
  Network,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Whitepaper = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState("executive-summary");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tableOfContents = [
    { id: "executive-summary", title: "Executive Summary", icon: FileText },
    { id: "introduction", title: "Introduction", icon: Book },
    { id: "features", title: "Current Platform Features", icon: Workflow },
    { id: "architecture", title: "Architecture & Design", icon: Settings },
    { id: "roadmap", title: "Strategic Roadmap", icon: Calendar },
    { id: "mcp", title: "Model Context Protocol", icon: Database },
    { id: "use-cases", title: "Use Cases", icon: Target },
    { id: "security", title: "Security & Compliance", icon: Shield },
    { id: "getting-started", title: "Getting Started", icon: Zap },
    { id: "conclusion", title: "Conclusion", icon: Users },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const TableOfContentsContent = () => (
    <Card className="border-white/20 bg-black/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Book className="h-5 w-5" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-1 p-4">
            {tableOfContents.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start text-left h-auto p-3 transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-white/10 text-white border-l-2 border-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <IconComponent className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {item.title}
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 flex-shrink-0" />
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const handleDownloadPDF = () => {
    // Create a simple text content for PDF
    const content = `
autoa.fun Whitepaper

Executive Summary
autoa.fun is a no-code/low-code Visual AI Flow Builder designed for technical teams to create, run, and maintain complex AI workflows with ease.

Key Features:
- Visual drag-and-drop interface
- Multi-provider AI integration
- Real-time execution monitoring
- Template library
- Enterprise-grade security

For more information, visit autoa.fun
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autoa-fun-whitepaper.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="matrix-rain opacity-10"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-green-600/30 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="matrix-button"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <Code className="h-4 w-4 text-black" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold">
                    autoa.fun Whitepaper
                  </h1>
                  <p className="text-xs text-green-400/70">
                    Technical Documentation
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDownloadPDF}
                size="sm"
                className="matrix-button bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open("https://x.com/autoadotfun", "_blank")
                }
                className="matrix-border text-green-400 border-green-600/30 hover:bg-green-600/10"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Follow Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Executive Summary */}
          <Card className="matrix-bg-glass matrix-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-black" />
                </div>
                <CardTitle className="text-xl matrix-text-glow">
                  Executive Summary
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-100 leading-relaxed">
                autoa.fun is a no-code/low-code Visual AI Flow Builder designed
                for technical teams to create, run, and maintain complex AI
                workflows with ease. Users drag and drop nodes on a canvas,
                configure each step (AI models, APIs, data processing,
                conditions), and execute workflows in real-time. The platform
                supports multiple AI providers (OpenAI, Anthropic, local
                models), offers pre-built templates, and scales from individual
                use to enterprise deployment (cloud or on-premise). Over the
                next 12 months, autoa.fun will expand its template library,
                integrate the Model Context Protocol (MCP) for live data access,
                add intelligent error recovery and monitoring, and roll out
                enterprise-grade security and collaboration features.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="matrix-bg-glass p-4 rounded-lg matrix-border">
                  <h4 className="font-bold text-green-400 mb-2">
                    No-Code Visual Builder
                  </h4>
                  <p className="text-sm text-green-200">
                    Drag-and-drop interface for creating complex AI workflows
                    without coding
                  </p>
                </div>
                <div className="matrix-bg-glass p-4 rounded-lg matrix-border">
                  <h4 className="font-bold text-green-400 mb-2">
                    Multi-Provider Support
                  </h4>
                  <p className="text-sm text-green-200">
                    Integrate with OpenAI, Anthropic, local models, and custom
                    APIs
                  </p>
                </div>
                <div className="matrix-bg-glass p-4 rounded-lg matrix-border">
                  <h4 className="font-bold text-green-400 mb-2">
                    Enterprise Ready
                  </h4>
                  <p className="text-sm text-green-200">
                    Cloud and on-premise deployment with enterprise security
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problem Statement */}
          <Card className="matrix-bg-glass matrix-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-xl matrix-text-glow">
                  Problem Statement
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-100 leading-relaxed">
                Technical teams face significant challenges when building
                AI-powered applications. Traditional development requires
                extensive coding, managing multiple API integrations, handling
                complex error scenarios, and maintaining fragile connectors.
                autoa.fun removes these pain points by offering:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-green-400">
                      Visual Workflow Creation
                    </h4>
                    <p className="text-sm text-green-200">
                      Eliminate complex coding with intuitive drag-and-drop
                      interface
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-green-400">
                      Unified AI Integration
                    </h4>
                    <p className="text-sm text-green-200">
                      Single platform for multiple AI providers and models
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-green-400">
                      Intelligent Error Recovery
                    </h4>
                    <p className="text-sm text-green-200">
                      Built-in retry logic and fallback mechanisms
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-green-400">
                      Real-time Monitoring
                    </h4>
                    <p className="text-sm text-green-200">
                      Live execution tracking and performance analytics
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solution Architecture */}
          <Card className="matrix-bg-glass matrix-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-xl matrix-text-glow">
                  Solution Architecture
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
                    Core Components
                  </h3>
                  <div className="space-y-3">
                    <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
                      <h4 className="font-bold text-green-400 text-sm">
                        Visual Flow Builder
                      </h4>
                      <p className="text-xs text-green-200">
                        React-based canvas with drag-and-drop nodes
                      </p>
                    </div>
                    <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
                      <h4 className="font-bold text-green-400 text-sm">
                        Execution Engine
                      </h4>
                      <p className="text-xs text-green-200">
                        Real-time workflow processing and monitoring
                      </p>
                    </div>
                    <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
                      <h4 className="font-bold text-green-400 text-sm">
                        AI Provider Layer
                      </h4>
                      <p className="text-xs text-green-200">
                        Unified interface for multiple AI services
                      </p>
                    </div>
                    <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
                      <h4 className="font-bold text-green-400 text-sm">
                        Template Library
                      </h4>
                      <p className="text-xs text-green-200">
                        Pre-built workflows for common use cases
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
                    Benefits & Fit for autoa.fun
                  </h3>
                  <div className="space-y-3">
                    <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
                      <h4 className="font-bold text-green-400 text-sm">
                        Rapid Prototyping
                      </h4>
                      <p className="text-xs text-green-200">
                        Build and test AI workflows in minutes
                      </p>
                    </div>
                    <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
                      <h4 className="font-bold text-green-400 text-sm">
                        Cost Efficiency
                      </h4>
                      <p className="text-xs text-green-200">
                        Reduce development time by 80%
                      </p>
                    </div>
                    <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
                      <h4 className="font-bold text-green-400 text-sm">
                        Scalability
                      </h4>
                      <p className="text-xs text-green-200">
                        From prototype to enterprise deployment
                      </p>
                    </div>
                    <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
                      <h4 className="font-bold text-green-400 text-sm">
                        Flexibility
                      </h4>
                      <p className="text-xs text-green-200">
                        Support for custom nodes and integrations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card className="matrix-bg-glass matrix-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                  <Network className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-xl matrix-text-glow">
                  Technical Specifications
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-green-400 mb-3">
                    Frontend Technologies
                  </h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="matrix-badge">
                      React 18
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      TypeScript
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      React Flow
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Tailwind CSS
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Vite
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-green-400 mb-3">
                    Backend Services
                  </h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="matrix-badge">
                      Node.js
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Express
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      WebSocket
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      PostgreSQL
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Redis
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-green-400 mb-3">
                    AI Integrations
                  </h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="matrix-badge">
                      OpenAI GPT-4
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Anthropic Claude
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Google AI
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Local Models
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Custom APIs
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-green-400 mb-3">
                    Deployment Options
                  </h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="matrix-badge">
                      Cloud SaaS
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      On-Premise
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Docker
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Kubernetes
                    </Badge>
                    <Badge variant="outline" className="matrix-badge">
                      Edge Computing
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className="matrix-bg-glass matrix-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-black" />
                </div>
                <CardTitle className="text-xl matrix-text-glow">
                  Getting Started
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="matrix-bg-glass p-4 rounded-lg matrix-border text-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-black font-bold flex items-center justify-center mx-auto mb-2">
                    1
                  </div>
                  <h4 className="font-bold text-green-400 mb-2">Sign Up</h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Visit autoa.fun and create a free account
                  </p>
                </div>
                <div className="matrix-bg-glass p-4 rounded-lg matrix-border text-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-black font-bold flex items-center justify-center mx-auto mb-2">
                    2
                  </div>
                  <h4 className="font-bold text-green-400 mb-2">
                    Choose Template
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Select from our library or start from scratch
                  </p>
                </div>
                <div className="matrix-bg-glass p-4 rounded-lg matrix-border text-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-black font-bold flex items-center justify-center mx-auto mb-2">
                    3
                  </div>
                  <h4 className="font-bold text-green-400 mb-2">
                    Build & Deploy
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Drag, drop, configure, and launch your AI workflow
                  </p>
                </div>
              </div>

              <Separator className="bg-green-600/30" />

              <div className="text-center">
                <Button
                  onClick={() => window.open("https://autoa.fun", "_blank")}
                  className="matrix-button bg-green-600 hover:bg-green-700 text-black font-bold px-8 py-3"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Try autoa.fun Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Conclusion */}
          <Card className="matrix-bg-glass matrix-border">
            <CardHeader>
              <CardTitle className="text-xl matrix-text-glow">
                Conclusion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-100 leading-relaxed">
                autoa.fun brings together no-code visual design, multi-provider
                AI, MCP-powered context access, and self-healing logic into a
                single, unified platform. Whether you're a solo developer, data
                scientist, or part of a large enterprise, autoa.fun simplifies
                the creation and maintenance of AI workflows.
              </p>
              <p className="text-green-100 leading-relaxed">
                With upcoming features like intelligent error recovery, and
                enterprise-grade features, autoa.fun is poised to become the
                leading "Zapier for AI" in the Web3 era.
              </p>

              <div className="matrix-scan p-4 rounded-lg matrix-border text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Welcome to autoa.fun
                </h2>
                <p className="text-green-400 mt-2">
                  The Future of AI Workflow Automation
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Whitepaper;
