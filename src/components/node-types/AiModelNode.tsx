import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Bot, Settings, Zap, CheckCircle, AlertTriangle } from "lucide-react";

const AiModelNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [instructions, setInstructions] = useState(data.instructions || "");
  const [provider, setProvider] = useState(data.provider || "OpenAI");
  const [model, setModel] = useState(data.model || "gpt-4o-mini");
  const [temperature, setTemperature] = useState(data.temperature || "0.7");
  const [maxTokens, setMaxTokens] = useState(data.maxTokens || "1000");

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  instructions,
                  provider,
                  model,
                  temperature,
                  maxTokens,
                  configured: Boolean(instructions),
                },
              }
            : node
        )
      );
    }
  }, [instructions, provider, model, temperature, maxTokens, setNodes, id]);

  // Parse model config if exists
  let modelConfig: any = null;
  let configValid = false;
  let hasApiKey = false;

  if (data.content) {
    try {
      modelConfig = JSON.parse(data.content);
      configValid = Boolean(modelConfig && modelConfig.provider);
      hasApiKey = Boolean(
        modelConfig && (modelConfig.apiKey || modelConfig.endpoint)
      );
    } catch (e) {
      configValid = false;
    }
  }

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

  const testProcessing = () => {
    if (!instructions) {
      alert("Please add processing instructions first");
      return;
    }

    alert(`AI Model will process content with: "${instructions}"`);
  };

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[300px] matrix-hover">
      <div className="flex items-center mb-2">
        <Bot className="h-4 w-4 mr-2 text-green-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            AI Provider
          </Label>
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OpenAI">🤖 OpenAI</SelectItem>
              <SelectItem value="Anthropic">🧠 Anthropic</SelectItem>
              <SelectItem value="Google">🔍 Google AI</SelectItem>
              <SelectItem value="Cohere">💫 Cohere</SelectItem>
              <SelectItem value="Custom">⚙️ Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {provider === "OpenAI" && (
                <>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </>
              )}
              {provider === "Anthropic" && (
                <>
                  <SelectItem value="claude-3-5-sonnet">
                    Claude 3.5 Sonnet
                  </SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                </>
              )}
              {provider === "Google" && (
                <>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="gemini-pro-vision">
                    Gemini Pro Vision
                  </SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Processing Instructions
          </Label>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g., Summarize in 5 bullet points, Create 120-word summary, Extract key insights..."
            className="min-h-[80px] text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Temperature
            </Label>
            <Input
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="0.7"
            />
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Max Tokens
            </Label>
            <Input
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              placeholder="1000"
            />
          </div>
        </div>

        <Button onClick={testProcessing} size="sm" className="w-full">
          <Zap className="h-3 w-3 mr-1" />
          Test Processing
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {provider}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {model}
        </Badge>
        {data.configured ? (
          <Badge variant="default" className="bg-green-600 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Setup Required
          </Badge>
        )}
      </div>

      {data.executionStatus && (
        <div className={`text-xs mt-2 ${getStatusStyles()}`}>
          {data.executionStatus === "completed"
            ? "✓ Processing Complete"
            : data.executionStatus === "error"
            ? "✗ Processing Error"
            : "⟳ Processing Content"}
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

export default AiModelNode;
