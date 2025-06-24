import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import {
  MessageSquare,
  Settings,
  Zap,
  CheckCircle,
  Copy,
  FileText,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const SystemNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [prompt, setPrompt] = useState(data.prompt || data.content || "");
  const [template, setTemplate] = useState(data.template || "custom");
  const [role, setRole] = useState(data.role || "assistant");
  const [priority, setPriority] = useState(data.priority || "normal");
  const [persistent, setPersistent] = useState(data.persistent !== false);
  const [systemResult, setSystemResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  prompt,
                  template,
                  role,
                  priority,
                  persistent,
                  content: prompt, // Keep backward compatibility
                  configured: Boolean(prompt),
                },
              }
            : node
        )
      );
    }
  }, [prompt, template, role, priority, persistent, setNodes, id]);

  const getStatusStyles = () => {
    if (!data.executionStatus) return "";

    switch (data.executionStatus) {
      case "processing":
        return "animate-pulse text-blue-400";
      case "completed":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "";
    }
  };

  const testSystemPrompt = async () => {
    if (!prompt) {
      alert("Please enter a system prompt first");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate system prompt processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = {
        prompt_id: `sys_${Date.now()}`,
        content: prompt,
        role,
        template,
        priority,
        persistent,
        status: "active",
        created_at: new Date().toISOString(),
        token_count: prompt.split(/\s+/).length,
        message: "System prompt configured successfully",
      };

      setSystemResult(result);
      alert(
        `✅ System prompt configured!\nTokens: ${result.token_count}\nRole: ${role}`
      );
    } catch (error) {
      alert(`❌ Failed to configure system prompt: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    alert("System prompt copied to clipboard!");
  };

  const loadTemplate = (templateType: string) => {
    const templates = {
      custom: "",
      assistant:
        "You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user queries.",
      analyzer:
        "You are an expert data analyst. Analyze the provided information and extract key insights, patterns, and actionable recommendations.",
      summarizer:
        "You are a professional summarizer. Create concise, comprehensive summaries that capture the most important information while maintaining clarity.",
      creative:
        "You are a creative writing assistant. Help generate engaging, original content with creativity and flair while maintaining quality and coherence.",
      technical:
        "You are a technical expert. Provide detailed, accurate technical information and solutions with clear explanations and best practices.",
      educator:
        "You are an educational assistant. Explain complex topics in simple, understandable terms with examples and step-by-step guidance.",
    };

    setPrompt(templates[templateType] || "");
  };

  const templates = [
    { value: "custom", label: "✏️ Custom Prompt" },
    { value: "assistant", label: "🤖 General Assistant" },
    { value: "analyzer", label: "📊 Data Analyzer" },
    { value: "summarizer", label: "📝 Summarizer" },
    { value: "creative", label: "🎨 Creative Writer" },
    { value: "technical", label: "⚙️ Technical Expert" },
    { value: "educator", label: "📚 Educator" },
  ];

  const roles = [
    { value: "system", label: "🔧 System" },
    { value: "assistant", label: "🤖 Assistant" },
    { value: "user", label: "👤 User" },
    { value: "function", label: "⚡ Function" },
  ];

  const priorities = [
    { value: "low", label: "🟢 Low Priority" },
    { value: "normal", label: "🟡 Normal Priority" },
    { value: "high", label: "🟠 High Priority" },
    { value: "critical", label: "🔴 Critical Priority" },
  ];

  return (
    <div
      className={`matrix-bg-glass matrix-border rounded-xl matrix-hover ${
        isMobile ? "min-w-[280px] p-3" : "min-w-[320px] p-4"
      }`}
    >
      <div className="flex items-center mb-2">
        <MessageSquare
          className={`mr-2 text-green-400 ${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
        />
        <div className={`font-medium matrix-text ${isMobile ? "text-sm" : ""}`}>
          {data.label}
        </div>
      </div>

      <div
        className={`text-green-300/70 mb-3 font-mono ${
          isMobile ? "text-xs" : "text-sm"
        }`}
      >
        {data.description}
      </div>

      <div className={isMobile ? "space-y-2" : "space-y-3"}>
        <div>
          <Label
            className={`text-green-300 mb-1 block ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            Template
          </Label>
          <Select
            value={template}
            onValueChange={(value) => {
              setTemplate(value);
              if (value !== "custom") {
                loadTemplate(value);
              }
            }}
          >
            <SelectTrigger className={isMobile ? "mobile-select" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem
                  key={t.value}
                  value={t.value}
                  className={isMobile ? "text-xs" : ""}
                >
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            className={`text-green-300 mb-1 block ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            System Prompt
          </Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your system prompt here..."
            className={isMobile ? "mobile-textarea" : "min-h-[100px] text-xs"}
          />
        </div>

        <div
          className={`grid gap-3 ${
            isMobile ? "mobile-form-grid" : "grid-cols-2"
          }`}
        >
          <div>
            <Label
              className={`text-green-300 mb-1 block ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className={isMobile ? "mobile-select" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem
                    key={r.value}
                    value={r.value}
                    className={isMobile ? "text-xs" : ""}
                  >
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              className={`text-green-300 mb-1 block ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              Priority
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className={isMobile ? "mobile-select" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem
                    key={p.value}
                    value={p.value}
                    className={isMobile ? "text-xs" : ""}
                  >
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label
            className={`text-green-300 ${isMobile ? "text-xs" : "text-sm"}`}
          >
            Persistent
          </Label>
          <Switch checked={persistent} onCheckedChange={setPersistent} />
        </div>

        {systemResult && (
          <div
            className={`matrix-bg-glass rounded-lg matrix-border ${
              isMobile ? "p-2" : "p-3"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-green-300 ${isMobile ? "text-xs" : "text-sm"}`}
              >
                System Status:
              </span>
              <CheckCircle
                className={`text-green-400 ${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
              />
            </div>
            <div
              className={`text-green-300/70 space-y-1 ${
                isMobile ? "text-xs" : "text-xs"
              }`}
            >
              <div>ID: {systemResult.prompt_id}</div>
              <div>Tokens: {systemResult.token_count}</div>
              <div>Status: {systemResult.status}</div>
              <div>
                Created: {new Date(systemResult.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <div className={`flex gap-2 ${isMobile ? "touch-spacing" : ""}`}>
          <Button
            onClick={testSystemPrompt}
            size={isMobile ? "sm" : "sm"}
            className={`flex-1 touch-target ${isMobile ? "text-xs" : ""}`}
            disabled={isProcessing}
          >
            <Zap className={`mr-1 ${isMobile ? "h-3 w-3" : "h-3 w-3"}`} />
            {isProcessing ? "Configuring..." : "Test Prompt"}
          </Button>
          <Button
            onClick={copyPrompt}
            size={isMobile ? "sm" : "sm"}
            variant="outline"
            className="touch-target"
          >
            <Copy className={isMobile ? "h-3 w-3" : "h-3 w-3"} />
          </Button>
        </div>
      </div>

      <div className={`flex flex-wrap gap-1 ${isMobile ? "mt-2" : "mt-3"}`}>
        <Badge
          variant="outline"
          className={`matrix-badge ${isMobile ? "mobile-badge" : "text-xs"}`}
        >
          {role}
        </Badge>
        <Badge
          variant="outline"
          className={`matrix-badge ${isMobile ? "mobile-badge" : "text-xs"}`}
        >
          {priority}
        </Badge>
        {persistent && (
          <Badge
            variant="outline"
            className={`bg-blue-600/20 text-blue-400 border-blue-600/30 ${
              isMobile ? "mobile-badge" : "text-xs"
            }`}
          >
            Persistent
          </Badge>
        )}
        {data.configured ? (
          <Badge
            variant="default"
            className={`bg-green-600 ${isMobile ? "mobile-badge" : "text-xs"}`}
          >
            <CheckCircle
              className={`mr-1 ${isMobile ? "h-2 w-2" : "h-3 w-3"}`}
            />
            Ready
          </Badge>
        ) : (
          <Badge
            variant="destructive"
            className={isMobile ? "mobile-badge" : "text-xs"}
          >
            <Settings className={`mr-1 ${isMobile ? "h-2 w-2" : "h-3 w-3"}`} />
            Setup Required
          </Badge>
        )}
      </div>

      {data.executionStatus && (
        <div
          className={`mt-2 ${getStatusStyles()} ${
            isMobile ? "text-xs" : "text-xs"
          }`}
        >
          {data.executionStatus === "completed"
            ? "✓ System Configured"
            : data.executionStatus === "error"
            ? "✗ Configuration Error"
            : "⟳ Configuring"}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ top: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ bottom: 0 }}
      />
    </div>
  );
};

export default SystemNode;
