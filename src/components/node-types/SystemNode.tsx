import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, Settings } from "lucide-react";
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
  const isMobile = useIsMobile();

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
  const role = data.role || "assistant";
  const priority = data.priority || "normal";
  const persistent = data.persistent !== false;

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
