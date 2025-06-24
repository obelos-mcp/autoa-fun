import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  AlertTriangle,
  Info,
  Copy,
  Download,
} from "lucide-react";

interface FlowExecutionPanelProps {
  results: Record<string, any>;
  nodes: any[];
}

const FlowExecutionPanel: React.FC<FlowExecutionPanelProps> = ({
  results,
  nodes,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [copiedNode, setCopiedNode] = useState<string | null>(null);

  // Get a list of node display data with more detailed information
  const nodeData = useMemo(() => {
    return nodes.map((node) => {
      const result = results[node.id];
      const hasError =
        node.data.executionStatus === "error" || (result && result.error);

      return {
        id: node.id,
        type: node.type,
        label: node.data.label,
        hasResult: Boolean(result),
        status: node.data.executionStatus || (result ? "completed" : "waiting"),
        result: result,
        error: node.data.executionError || (result && result.error),
        hasError,
        isInputNode: [
          "input",
          "system",
          "youtubeinput",
          "callautomation",
          "mcp",
        ].includes(node.type),
        isOutputNode: [
          "output",
          "pdfgenerator",
          "notification",
          "localfilesaver",
        ].includes(node.type),
        isProcessingNode: ["aimodel", "api", "condition", "tool"].includes(
          node.type
        ),
      };
    });
  }, [nodes, results]);

  // Categorize nodes
  const { inputNodes, processingNodes, outputNodes, errorNodes } =
    useMemo(() => {
      return {
        inputNodes: nodeData.filter((node) => node.isInputNode),
        processingNodes: nodeData.filter((node) => node.isProcessingNode),
        outputNodes: nodeData.filter((node) => node.isOutputNode),
        errorNodes: nodeData.filter((node) => node.hasError),
      };
    }, [nodeData]);

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (content: string, nodeId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedNode(nodeId);
      setTimeout(() => setCopiedNode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadResult = (result: any, nodeName: string) => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${nodeName}-result.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Format result for display with better structure
  const formatResult = (result: any): { preview: string; details: any } => {
    if (!result) return { preview: "No data", details: null };

    // Handle different result types
    if (typeof result === "string") {
      return {
        preview:
          result.length > 100 ? result.substring(0, 100) + "..." : result,
        details: result,
      };
    }

    if (typeof result === "object") {
      // Handle specific result types
      if (result.call_id) {
        return {
          preview: `Call completed: ${result.call_id}`,
          details: result,
        };
      }

      if (result.converted_amount) {
        return {
          preview: `${result.original_amount} ${result.from_currency} = ${result.converted_amount} ${result.to_currency}`,
          details: result,
        };
      }

      if (result.deployment_id) {
        return {
          preview: `Deployed: ${result.app_name} v${result.version}`,
          details: result,
        };
      }

      if (result.price) {
        return {
          preview: `${result.symbol}: $${result.price}`,
          details: result,
        };
      }

      if (result.processedContent || result.aiSummary) {
        return {
          preview: "AI processing completed",
          details: result,
        };
      }

      if (result.transcript) {
        return {
          preview: `Video transcribed: ${result.transcript.substring(
            0,
            50
          )}...`,
          details: result,
        };
      }

      // Generic object handling
      const keys = Object.keys(result);
      return {
        preview: `Object with ${keys.length} properties`,
        details: result,
      };
    }

    return {
      preview: String(result),
      details: result,
    };
  };

  const getStatusIcon = (status: string, hasError: boolean) => {
    if (hasError) return <XCircle className="h-4 w-4 text-red-400" />;

    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "processing":
        return <Play className="h-4 w-4 text-blue-400 animate-pulse" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string, hasError: boolean) => {
    if (hasError) {
      return (
        <Badge variant="destructive" className="text-xs">
          Error
        </Badge>
      );
    }

    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-600 text-xs">
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs"
          >
            Processing
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="text-xs">
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Waiting
          </Badge>
        );
    }
  };

  const NodeResultCard = ({ node }: { node: any }) => {
    const isExpanded = expandedNodes.has(node.id);
    const { preview, details } = formatResult(node.result);

    return (
      <div className="border matrix-border rounded-lg p-3 matrix-bg-glass">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleNodeExpansion(node.id)}
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {getStatusIcon(node.status, node.hasError)}
            <span className="font-medium text-white">{node.label}</span>
            <Badge variant="outline" className="text-xs">
              {node.type}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(node.status, node.hasError)}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3">
            {node.hasError && node.error && (
              <div className="bg-red-900/20 border border-red-600/30 rounded p-2">
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  Error Details
                </div>
                <div className="text-xs text-red-300">{node.error}</div>
              </div>
            )}

            {node.hasResult && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-300">
                    <Info className="h-4 w-4" />
                    Result Preview
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(details, null, 2),
                          node.id
                        )
                      }
                      className="h-6 px-2 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedNode === node.id ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadResult(details, node.label)}
                      className="h-6 px-2 text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-600/30 rounded p-2">
                  <div className="text-sm text-green-300 mb-2">{preview}</div>
                  {details && typeof details === "object" && (
                    <div className="text-xs text-green-300/70 font-mono max-h-32 overflow-auto">
                      <pre>{JSON.stringify(details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!node.hasResult && !node.hasError && (
              <div className="text-sm text-gray-400 italic">
                No data available yet
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Check if we have any results
  const hasResults = Object.keys(results).length > 0;
  const completedCount = nodeData.filter(
    (n) => n.status === "completed"
  ).length;
  const errorCount = errorNodes.length;
  const totalNodes = nodeData.length;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 matrix-bg-glass matrix-border rounded-lg">
          <div className="text-2xl font-bold text-green-400">
            {completedCount}
          </div>
          <div className="text-xs text-green-300">Completed</div>
        </div>
        <div className="text-center p-3 matrix-bg-glass matrix-border rounded-lg">
          <div className="text-2xl font-bold text-red-400">{errorCount}</div>
          <div className="text-xs text-red-300">Errors</div>
        </div>
        <div className="text-center p-3 matrix-bg-glass matrix-border rounded-lg">
          <div className="text-2xl font-bold text-blue-400">{totalNodes}</div>
          <div className="text-xs text-blue-300">Total Nodes</div>
        </div>
      </div>

      {/* Detailed Results */}
      {hasResults ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({nodeData.length})</TabsTrigger>
            <TabsTrigger value="inputs">
              Inputs ({inputNodes.length})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({processingNodes.length})
            </TabsTrigger>
            <TabsTrigger value="outputs">
              Outputs ({outputNodes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2 max-h-96 overflow-auto">
            {nodeData.map((node) => (
              <NodeResultCard key={node.id} node={node} />
            ))}
          </TabsContent>

          <TabsContent
            value="inputs"
            className="space-y-2 max-h-96 overflow-auto"
          >
            {inputNodes.length > 0 ? (
              inputNodes.map((node) => (
                <NodeResultCard key={node.id} node={node} />
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No input nodes found
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="processing"
            className="space-y-2 max-h-96 overflow-auto"
          >
            {processingNodes.length > 0 ? (
              processingNodes.map((node) => (
                <NodeResultCard key={node.id} node={node} />
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No processing nodes found
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="outputs"
            className="space-y-2 max-h-96 overflow-auto"
          >
            {outputNodes.length > 0 ? (
              outputNodes.map((node) => (
                <NodeResultCard key={node.id} node={node} />
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No output nodes found
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-8 matrix-bg-glass matrix-border rounded-lg">
          <div className="text-gray-400 mb-2">No execution data available</div>
          <div className="text-sm text-gray-500">
            Run the flow to see results here
          </div>
        </div>
      )}

      {/* Error Summary */}
      {errorCount > 0 && (
        <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
            <AlertTriangle className="h-4 w-4" />
            Execution Errors ({errorCount})
          </div>
          <div className="space-y-2">
            {errorNodes.map((node) => (
              <div key={node.id} className="text-sm">
                <span className="text-red-300 font-medium">{node.label}:</span>
                <span className="text-red-200 ml-2">{node.error}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowExecutionPanel;
