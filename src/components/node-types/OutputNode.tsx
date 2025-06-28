import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Monitor, CheckCircle, Settings } from "lucide-react";

const OutputNode = ({
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
  const outputName = data.outputName || "output";
  const displayFormat = data.displayFormat || "auto";
  const exportFormat = data.exportFormat || "json";
  const showPreview = data.showPreview !== false;
  const autoSave = data.autoSave || false;

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <Monitor className="h-4 w-4 mr-2 text-purple-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {displayFormat}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {outputName}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {exportFormat}
        </Badge>
        {autoSave && (
          <Badge
            variant="outline"
            className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs"
          >
            Auto Save
          </Badge>
        )}
        {showPreview && (
          <Badge
            variant="outline"
            className="bg-purple-600/20 text-purple-400 border-purple-600/30 text-xs"
          >
            Preview
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
            ? "✓ Output Generated"
            : data.executionStatus === "error"
            ? "✗ Output Error"
            : "⟳ Generating Output"}
        </div>
      )}

      {/* Output nodes have input handles to receive data */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ top: 0 }}
      />
    </div>
  );
};

export default OutputNode;
