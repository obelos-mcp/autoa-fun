import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Play, Loader2 } from "lucide-react";
import FlowExecutionPanel from "./FlowExecutionPanel";

interface FlowTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: any[];
  edges: any[];
  onRunFlow: (inputs: Record<string, any>) => void;
  isRunning: boolean;
  executionResults: Record<string, any>;
}

const FlowTestModal = ({
  isOpen,
  onClose,
  nodes,
  edges,
  onRunFlow,
  isRunning,
  executionResults,
}: FlowTestModalProps) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});

  // Get unique input nodes, prioritizing compound nodes like callautomation over individual inputs
  const getInputNodes = () => {
    const allInputNodes = nodes.filter((node) =>
      [
        "input",
        "system",
        "youtubeinput",
        "localfilesaver",
        "callautomation",
        "mcp",
        "walletinput",
      ].includes(node.type)
    );

    // If we have a callautomation node, exclude individual input/system nodes that might be redundant
    const hasCallAutomation = allInputNodes.some(
      (node) => node.type === "callautomation"
    );

    if (hasCallAutomation) {
      // Only keep callautomation and non-basic input types
      return allInputNodes
        .filter(
          (node) =>
            node.type === "callautomation" ||
            !["input", "system"].includes(node.type)
        )
        .filter(
          (node, index, arr) => arr.findIndex((n) => n.id === node.id) === index
        );
    }

    // Otherwise, keep all unique input nodes
    return allInputNodes.filter(
      (node, index, arr) => arr.findIndex((n) => n.id === node.id) === index
    );
  };

  const inputNodes = getInputNodes();

  const handleInputChange = (nodeId: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [nodeId]: value,
    }));
  };

  const handleSubmit = () => {
    onRunFlow(inputs);
  };

  const renderInputField = (node: any) => {
    switch (node.type) {
      case "input":
        return (
          <div key={node.id} className="space-y-2">
            <Label htmlFor={node.id} className="text-sm font-medium">
              {node.data.label || "Input"}
            </Label>
            <Textarea
              id={node.id}
              placeholder="Enter your input text..."
              value={inputs[node.id] || ""}
              onChange={(e) => handleInputChange(node.id, e.target.value)}
              className="min-h-[50px] text-sm"
            />
          </div>
        );

      case "system":
        return (
          <div key={node.id} className="space-y-2">
            <Label htmlFor={node.id} className="text-sm font-medium">
              {node.data.label || "System Message"}
            </Label>
            <Textarea
              id={node.id}
              placeholder="Enter system message..."
              value={inputs[node.id] || ""}
              onChange={(e) => handleInputChange(node.id, e.target.value)}
              className="min-h-[50px] text-sm"
            />
          </div>
        );

      case "youtubeinput":
        return (
          <div key={node.id} className="space-y-2">
            <Label htmlFor={node.id} className="text-sm font-medium">
              {node.data.label || "YouTube URL"}
            </Label>
            <Input
              id={node.id}
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={inputs[node.id] || ""}
              onChange={(e) => handleInputChange(node.id, e.target.value)}
              className="text-sm"
            />
            <div className="text-xs text-muted-foreground">
              Enter a YouTube URL to analyze and summarize the video content
            </div>
          </div>
        );

      case "localfilesaver":
        return (
          <div key={node.id} className="space-y-2">
            <Label className="text-sm font-medium">Video Creation</Label>
            <div className="space-y-2">
              <div>
                <Label htmlFor={`${node.id}-title`} className="text-xs">
                  Title
                </Label>
                <Input
                  id={`${node.id}-title`}
                  placeholder="Video title..."
                  value={inputs[node.id]?.title || ""}
                  onChange={(e) =>
                    handleInputChange(node.id, {
                      ...inputs[node.id],
                      title: e.target.value,
                    })
                  }
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor={`${node.id}-text`} className="text-xs">
                  Content
                </Label>
                <Textarea
                  id={`${node.id}-text`}
                  placeholder="Main text content..."
                  value={inputs[node.id]?.text2 || ""}
                  onChange={(e) =>
                    handleInputChange(node.id, {
                      ...inputs[node.id],
                      text2: e.target.value,
                    })
                  }
                  className="min-h-[40px] text-sm"
                />
              </div>
            </div>
          </div>
        );

      case "callautomation":
        return (
          <div key={node.id} className="space-y-3">
            <Label className="text-sm font-medium">AI Call Setup</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor={`${node.id}-phone`} className="text-xs">
                  Phone Number
                </Label>
                <Input
                  id={`${node.id}-phone`}
                  placeholder="+1234567890"
                  value={inputs[node.id]?.phone_number || ""}
                  onChange={(e) =>
                    handleInputChange(node.id, {
                      ...inputs[node.id],
                      phone_number: e.target.value,
                    })
                  }
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor={`${node.id}-task`} className="text-xs">
                  Task
                </Label>
                <Textarea
                  id={`${node.id}-task`}
                  placeholder="What should the AI do on the call..."
                  value={inputs[node.id]?.task || ""}
                  onChange={(e) =>
                    handleInputChange(node.id, {
                      ...inputs[node.id],
                      task: e.target.value,
                    })
                  }
                  className="min-h-[100px] sm:min-h-[120px] text-sm resize-y"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case "mcp":
        return (
          <div key={node.id} className="space-y-3">
            <Label className="text-sm font-medium">MCP Tool Execution</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor={`${node.id}-server`} className="text-xs">
                  Server ID
                </Label>
                <Input
                  id={`${node.id}-server`}
                  placeholder="e.g., mcp-filesystem"
                  value={inputs[node.id]?.serverId || ""}
                  onChange={(e) =>
                    handleInputChange(node.id, {
                      ...inputs[node.id],
                      serverId: e.target.value,
                    })
                  }
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor={`${node.id}-tool`} className="text-xs">
                  Tool Name
                </Label>
                <Input
                  id={`${node.id}-tool`}
                  placeholder="e.g., read_file"
                  value={inputs[node.id]?.toolName || ""}
                  onChange={(e) =>
                    handleInputChange(node.id, {
                      ...inputs[node.id],
                      toolName: e.target.value,
                    })
                  }
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor={`${node.id}-args`} className="text-xs">
                  Tool Arguments (JSON)
                </Label>
                <Textarea
                  id={`${node.id}-args`}
                  placeholder='{"path": "/path/to/file.txt"}'
                  value={inputs[node.id]?.arguments || ""}
                  onChange={(e) =>
                    handleInputChange(node.id, {
                      ...inputs[node.id],
                      arguments: e.target.value,
                    })
                  }
                  className="min-h-[80px] text-sm resize-y"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case "walletinput":
        return (
          <div key={node.id} className="space-y-3">
            <Label className="text-sm font-medium">Wallet Analysis Setup</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor={`${node.id}-address`} className="text-xs">
                  Wallet Address
                </Label>
                <Input
                  id={`${node.id}-address`}
                  placeholder="0x742d35Cc6634C0532925a3b8D0c9C9bcCfBb6"
                  value={inputs[node.id]?.walletAddress || ""}
                  onChange={(e) =>
                    handleInputChange(node.id, {
                      ...inputs[node.id],
                      walletAddress: e.target.value,
                    })
                  }
                  className="text-sm font-mono"
                />
              </div>
              <div>
                <Label htmlFor={`${node.id}-blockchain`} className="text-xs">
                  Blockchain
                </Label>
                <select
                  id={`${node.id}-blockchain`}
                  value={inputs[node.id]?.blockchain || "ethereum"}
                  onChange={(e) =>
                    handleInputChange(node.id, {
                      ...inputs[node.id],
                      blockchain: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="solana">Solana</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Enter a blockchain wallet address to analyze transaction history and generate insights
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const hasResults =
    executionResults && Object.keys(executionResults).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Test Your AI Flow</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {inputNodes.length > 0 ? (
            <>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure the inputs for your flow test.
                </p>
                {inputNodes.map(renderInputField)}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isRunning}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isRunning}>
                  {isRunning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Flow
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                No input nodes found. Add input nodes to test your flow.
              </p>
              <Button variant="outline" onClick={onClose} className="mt-4">
                Close
              </Button>
            </div>
          )}

          {/* Enhanced Execution Results */}
          {(hasResults || isRunning) && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-3 text-blue-300">
                Flow Execution Results
              </h3>
              <FlowExecutionPanel results={executionResults} nodes={nodes} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlowTestModal;
