import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Terminal, CheckCircle, Settings } from "lucide-react";

const InputNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
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

  // Get configuration from data or defaults
  const inputType = data.inputType || "text";
  const inputName = data.inputName || "input";
  const validation = data.validation || "none";
  const required = data.required !== false;

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <Terminal className="h-4 w-4 mr-2 text-blue-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {inputType}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {inputName}
        </Badge>
        {validation !== "none" && (
          <Badge
            variant="outline"
            className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30 text-xs"
          >
            {validation}
          </Badge>
        )}
        {required && (
          <Badge
            variant="outline"
            className="bg-red-600/20 text-red-400 border-red-600/30 text-xs"
          >
            Required
          </Badge>
        )}
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
            ? "✓ Input Processed"
            : data.executionStatus === "error"
            ? "✗ Processing Error"
            : "⟳ Processing"}
        </div>
      )}

      {/* Input nodes typically only have output handles, not input handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ bottom: 0 }}
      />
    </div>
  );
};

export default InputNode;
