import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";

const YouTubeInputNode = ({ data }: { data: any }) => {
  // Check if URL is configured
  const hasUrl = Boolean(data.content && data.content.trim() !== "");

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

  return (
    <>
      <div className="flex items-center mb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 text-red-500"
        >
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </svg>
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>

      {/* Only show URL status and execution status - no detailed results */}
      <div className="mt-2 flex flex-wrap gap-1">
        {hasUrl ? (
          <Badge variant="default" className="bg-green-600 text-xs">
            URL Set
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs">
            URL Required
          </Badge>
        )}

        {data.executionStatus && (
          <Badge variant="secondary" className={`text-xs ${getStatusStyles()}`}>
            {data.executionStatus === "completed"
              ? "Processed"
              : data.executionStatus === "error"
              ? "Error"
              : "Processing"}
          </Badge>
        )}
      </div>

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
    </>
  );
};

export default YouTubeInputNode;
