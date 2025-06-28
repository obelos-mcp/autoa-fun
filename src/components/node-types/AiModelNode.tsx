import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Bot, CheckCircle, Settings } from "lucide-react";

const AiModelNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
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

  // Get provider and model from data or defaults
  const provider = data.provider || modelConfig?.provider || "OpenAI";
  const model = data.model || modelConfig?.model || "gpt-4o-mini";

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[300px] matrix-hover">
      <div className="flex items-center mb-2">
        <Bot className="h-4 w-4 mr-2 text-green-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {provider}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {model}
        </Badge>
        {data.configured || configValid ? (
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
