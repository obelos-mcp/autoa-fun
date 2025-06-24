import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Workflow,
  Zap,
  Globe,
  Code,
  Puzzle,
  ArrowRight,
  Play,
  Download,
  Star,
  Users,
  Cpu,
  Network,
  Blocks,
  Bot,
  FileText,
  Menu,
  X,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Target,
  Rocket,
  MousePointer,
  Plus,
  ArrowDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Homepage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [droppedItems, setDroppedItems] = useState<
    Array<{ id: string; type: string; x: number; y: number }>
  >([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const demoNodes = [
    {
      id: "input",
      type: "Input",
      icon: "📥",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "ai",
      type: "AI Model",
      icon: "🤖",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "process",
      type: "Process",
      icon: "⚙️",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "output",
      type: "Output",
      icon: "📤",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    setDraggedItem(nodeType);
    e.dataTransfer.effectAllowed = "copy";
    // Add visual feedback
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedItem(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (!draggedItem) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItem = {
      id: `${draggedItem}-${Date.now()}`,
      type: draggedItem,
      x: Math.max(0, Math.min(x - 50, rect.width - 100)),
      y: Math.max(0, Math.min(y - 25, rect.height - 50)),
    };

    setDroppedItems((prev) => [...prev, newItem]);
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const clearDemo = () => {
    setDroppedItems([]);
  };

  const features = [
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Visual AI Automation",
      description:
        "Create complex AI workflows through an intuitive drag-and-drop interface. No coding skills required.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Multi-Model Integration",
      description:
        "Connect multiple AI models seamlessly - GPT, Claude, custom models, and more in one workflow.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Real-time Processing",
      description:
        "Execute workflows instantly with live data streams and get immediate feedback on your automation.",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cloud Deployment",
      description:
        "Deploy your AI workflows to production environments with enterprise-grade reliability.",
      color: "from-orange-500 to-red-600",
    },
  ];

  const utilities = [
    {
      icon: <Target className="w-12 h-12" />,
      title: "Business Process Automation",
      description:
        "Automate repetitive tasks, data processing, and decision-making workflows across your organization.",
      examples: [
        "Customer support automation",
        "Document processing",
        "Data analysis pipelines",
      ],
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "AI Content Generation",
      description:
        "Create sophisticated content generation systems that combine multiple AI models for enhanced output.",
      examples: [
        "Multi-language content creation",
        "Code generation workflows",
        "Creative writing assistance",
      ],
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Data Intelligence",
      description:
        "Build intelligent data processing systems that analyze, transform, and extract insights automatically.",
      examples: [
        "Real-time analytics",
        "Predictive modeling",
        "Automated reporting",
      ],
    },
    {
      icon: <Rocket className="w-12 h-12" />,
      title: "Integration Hub",
      description:
        "Connect disparate systems and APIs through AI-powered workflows that understand and transform data.",
      examples: [
        "API orchestration",
        "System integration",
        "Workflow automation",
      ],
    },
  ];

  const navItems = [
    { name: "Demo", href: "#demo" },
    { name: "Features", href: "#features" },
    { name: "Applications", href: "#utilities" },
    { name: "How It Works", href: "#how-it-works" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen matrix-bg relative overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 matrix-bg-glass backdrop-blur-xl border-b border-green-600/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/LOGONOBG.png"
                alt="autoa.fun"
                className="h-8 w-auto matrix-glow"
              />
              <span className="font-bold matrix-text text-xl">autoa.fun</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-green-300 hover:text-green-100 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-600/10"
                >
                  {item.name}
                </button>
              ))}
              <Button
                onClick={() => navigate("/whitepaper")}
                variant="outline"
                size="sm"
                className="matrix-button"
              >
                <FileText className="w-4 h-4 mr-2" />
                Whitepaper
              </Button>
              <div className="flex items-center gap-3">
                <a
                  href="https://t.me/autoafun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-all duration-200 hover:scale-110"
                  title="Join our Telegram"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.12.54-.44.67-.89.42l-2.46-1.82-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.47 4.5-4.07c.2-.17-.04-.27-.3-.1l-5.56 3.5-2.4-.75c-.52-.16-.53-.52.11-.77l9.39-3.61c.43-.16.81.1.67.64z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/autoafun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-all duration-200 hover:scale-110"
                  title="Follow us on X"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-green-400 hover:text-green-300 p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-green-600/30 mobile-menu-enter-active">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-green-300 hover:text-green-100 transition-colors font-medium text-left py-2 px-3 rounded-lg hover:bg-green-600/10"
                  >
                    {item.name}
                  </button>
                ))}
                <Button
                  onClick={() => navigate("/whitepaper")}
                  variant="outline"
                  size="sm"
                  className="matrix-button w-fit mt-2"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Whitepaper
                </Button>
                <div className="flex items-center gap-4 pt-3 border-t border-green-600/20 mt-3">
                  <a
                    href="https://t.me/autoafun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.12.54-.44.67-.89.42l-2.46-1.82-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.47 4.5-4.07c.2-.17-.04-.27-.3-.1l-5.56 3.5-2.4-.75c-.52-.16-.53-.52.11-.77l9.39-3.61c.43-.16.81.1.67.64z" />
                    </svg>
                    Telegram
                  </a>
                  <a
                    href="https://x.com/autoafun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X (Twitter)
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-12">
        <div className="container mx-auto px-4 py-12 sm:py-20">
          <div className="text-center max-w-6xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src="/LOGONOBG.png"
                  alt="autoa.fun Logo"
                  className={`${isMobile ? "h-20" : "h-28"} w-auto matrix-glow`}
                />
                <div className="absolute inset-0 bg-green-400/20 blur-xl -z-10 animate-pulse"></div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold matrix-text-glow mb-6 leading-tight">
              autoa.fun
            </h1>

            <div className="mb-6">
              <Badge
                variant="outline"
                className="matrix-badge text-base sm:text-lg px-4 py-2"
              >
                AI Automation dApp
              </Badge>
            </div>

            <p className="text-lg sm:text-xl lg:text-2xl text-green-300/90 mb-6 max-w-4xl mx-auto leading-relaxed font-medium">
              The decentralized application that democratizes AI automation.
              Create, deploy, and monetize intelligent workflows without
              technical barriers.
            </p>

            <p className="text-base sm:text-lg text-green-400/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your business processes with visual AI workflow
              creation. Connect multiple AI models, automate complex tasks, and
              deploy to production.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => navigate("/builder")}
                size="lg"
                className="matrix-button matrix-border-glow text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 font-semibold"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                Launch dApp
              </Button>
              <Button
                onClick={() => scrollToSection("#demo")}
                variant="outline"
                size="lg"
                className="matrix-button text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 font-semibold"
              >
                <MousePointer className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                Try Demo
              </Button>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 rounded-xl matrix-bg-glass matrix-border">
                <div className="text-green-400 mb-3">
                  <Code className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="font-bold matrix-text mb-2">No-Code Required</h3>
                <p className="text-green-400/70 text-sm">
                  Visual interface for everyone
                </p>
              </div>
              <div className="text-center p-4 rounded-xl matrix-bg-glass matrix-border">
                <div className="text-green-400 mb-3">
                  <Layers className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="font-bold matrix-text mb-2">
                  Multi-Model Support
                </h3>
                <p className="text-green-400/70 text-sm">
                  Connect any AI model seamlessly
                </p>
              </div>
              <div className="text-center p-4 rounded-xl matrix-bg-glass matrix-border">
                <div className="text-green-400 mb-3">
                  <Zap className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="font-bold matrix-text mb-2">
                  Instant Deployment
                </h3>
                <p className="text-green-400/70 text-sm">
                  Production-ready in minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold matrix-text mb-6">
              Try It Yourself
            </h2>
            <p className="text-lg sm:text-xl text-green-400/80 max-w-3xl mx-auto leading-relaxed mb-8">
              Experience the power of drag-and-drop AI workflow creation. Drag
              nodes from the library and drop them in the canvas.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Node Library */}
              <div className="lg:col-span-1">
                <div className="matrix-bg-glass matrix-border rounded-2xl p-6">
                  <h3 className="text-lg font-bold matrix-text mb-4 flex items-center gap-2">
                    <Blocks className="w-5 h-5" />
                    Node Library
                  </h3>
                  <div className="space-y-3">
                    {demoNodes.map((node) => (
                      <div
                        key={node.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node.type)}
                        onDragEnd={handleDragEnd}
                        className={`drag-node p-4 rounded-xl bg-gradient-to-r ${node.color} cursor-grab active:cursor-grabbing text-white font-medium text-center transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                      >
                        <div className="text-2xl mb-2">{node.icon}</div>
                        <div className="text-sm">{node.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="lg:col-span-3">
                <div className="matrix-bg-glass matrix-border rounded-2xl p-6 h-96 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold matrix-text flex items-center gap-2">
                      <Workflow className="w-5 h-5" />
                      Workflow Canvas
                    </h3>
                    <Button
                      onClick={clearDemo}
                      variant="outline"
                      size="sm"
                      className="matrix-button text-xs"
                    >
                      Clear
                    </Button>
                  </div>

                  <div
                    className={`drop-zone w-full h-full border-2 border-dashed rounded-xl relative bg-gradient-to-br from-green-500/5 to-transparent transition-all duration-300 ${
                      isDragOver
                        ? "border-green-500/50 bg-green-500/10"
                        : "border-green-600/30"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {droppedItems.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-green-400/50">
                        <div className="text-center">
                          <ArrowDown className="w-8 h-8 mx-auto mb-2 animate-bounce" />
                          <p className="text-sm">
                            Drag nodes here to build your workflow
                          </p>
                        </div>
                      </div>
                    )}

                    {droppedItems.map((item) => {
                      const nodeConfig = demoNodes.find(
                        (n) => n.type === item.type
                      );
                      return (
                        <div
                          key={item.id}
                          className={`dropped-node absolute w-20 h-12 rounded-lg bg-gradient-to-r ${nodeConfig?.color} text-white text-xs font-medium flex flex-col items-center justify-center shadow-lg`}
                          style={{ left: item.x, top: item.y }}
                        >
                          <div className="text-lg">{nodeConfig?.icon}</div>
                          <div className="text-xs truncate px-1">
                            {nodeConfig?.type}
                          </div>
                        </div>
                      );
                    })}

                    {/* Connection Lines (Visual only) */}
                    {droppedItems.length > 1 && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {droppedItems.slice(0, -1).map((item, index) => {
                          const nextItem = droppedItems[index + 1];
                          return (
                            <line
                              key={`line-${index}`}
                              x1={item.x + 40}
                              y1={item.y + 24}
                              x2={nextItem.x + 40}
                              y2={nextItem.y + 24}
                              stroke="#00ff88"
                              strokeWidth="2"
                              className="connection-line"
                            />
                          );
                        })}
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={() => navigate("/builder")}
                className="matrix-button matrix-border-glow"
              >
                Build Real Workflows
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold matrix-text mb-6">
              Powerful Capabilities
            </h2>
            <p className="text-lg sm:text-xl text-green-400/80 max-w-3xl mx-auto leading-relaxed">
              Everything you need to build, test, and deploy intelligent
              automation workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`matrix-bg-glass matrix-border matrix-hover cursor-pointer transition-all duration-500 p-6 ${
                  activeFeature === index ? "matrix-border-glow scale-105" : ""
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 text-white`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="matrix-text text-xl mb-3">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-green-400/80 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section id="utilities" className="py-16 sm:py-24 matrix-bg-glass">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold matrix-text mb-6">
              Real-World Applications
            </h2>
            <p className="text-lg sm:text-xl text-green-400/80 max-w-3xl mx-auto leading-relaxed">
              Discover how autoa.fun transforms industries through intelligent
              automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {utilities.map((utility, index) => (
              <div
                key={index}
                className="matrix-bg-glass matrix-border rounded-2xl p-6 lg:p-8 matrix-hover transition-all duration-300"
              >
                <div className="text-green-400 mb-6">{utility.icon}</div>
                <h3 className="text-xl lg:text-2xl font-bold matrix-text mb-4">
                  {utility.title}
                </h3>
                <p className="text-green-400/80 text-base lg:text-lg mb-6 leading-relaxed">
                  {utility.description}
                </p>
                <div className="space-y-3">
                  {utility.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                      <span className="text-green-300/90 text-sm lg:text-base">
                        {example}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold matrix-text mb-6">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-green-400/80 max-w-3xl mx-auto leading-relaxed">
              From concept to production in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Design Visually",
                description:
                  "Use our intuitive drag-and-drop interface to design your AI workflow. Connect data sources, AI models, and outputs without writing code.",
                icon: <Blocks className="w-10 h-10 lg:w-12 lg:h-12" />,
                color: "from-green-500 to-emerald-600",
              },
              {
                step: "02",
                title: "Configure & Test",
                description:
                  "Set up each component with your specific parameters. Test your workflow with real data to ensure it works perfectly before deployment.",
                icon: <Network className="w-10 h-10 lg:w-12 lg:h-12" />,
                color: "from-blue-500 to-cyan-600",
              },
              {
                step: "03",
                title: "Deploy & Scale",
                description:
                  "Launch your workflow to production with enterprise-grade reliability. Monitor performance and scale automatically as needed.",
                icon: <Zap className="w-10 h-10 lg:w-12 lg:h-12" />,
                color: "from-purple-500 to-violet-600",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>
                <div className="text-4xl lg:text-5xl font-bold matrix-text mb-4 opacity-20">
                  {item.step}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold matrix-text mb-4">
                  {item.title}
                </h3>
                <p className="text-green-400/80 text-base lg:text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 matrix-bg-glass">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold matrix-text mb-6">
            Ready to Automate with AI?
          </h2>
          <p className="text-lg sm:text-xl text-green-400/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the future of intelligent automation. Create your first AI
            workflow today and experience the power of no-code AI development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/builder")}
              size="lg"
              className="matrix-button matrix-border-glow text-lg sm:text-xl px-10 sm:px-12 py-6 sm:py-8 font-semibold"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-3" />
            </Button>
            <Button
              onClick={() => navigate("/whitepaper")}
              variant="outline"
              size="lg"
              className="matrix-button text-lg sm:text-xl px-10 sm:px-12 py-6 sm:py-8 font-semibold"
            >
              Learn More
              <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 ml-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 lg:py-16 border-t border-green-600/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <img
                src="/LOGONOBG.png"
                alt="autoa.fun"
                className="h-10 w-auto matrix-glow"
              />
              <div>
                <span className="font-bold matrix-text text-xl">autoa.fun</span>
                <p className="text-green-400/70 text-sm">AI Automation dApp</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://t.me/autoafun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-all duration-200 hover:scale-110 flex items-center gap-2 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.12.54-.44.67-.89.42l-2.46-1.82-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.47 4.5-4.07c.2-.17-.04-.27-.3-.1l-5.56 3.5-2.4-.75c-.52-.16-.53-.52.11-.77l9.39-3.61c.43-.16.81.1.67.64z" />
                </svg>
                Join Telegram
              </a>
              <a
                href="https://x.com/autoafun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-all duration-200 hover:scale-110 flex items-center gap-2 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Follow on X
              </a>
            </div>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-green-600/20">
            <p className="text-green-400/70 text-sm lg:text-base">
              © 2024 autoa.fun. Democratizing AI automation for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
