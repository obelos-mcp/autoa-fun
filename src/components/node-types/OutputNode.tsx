import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Monitor,
  Settings,
  Download,
  CheckCircle,
  Copy,
  FileText,
  Eye,
  Code,
} from "lucide-react";

const OutputNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [outputName, setOutputName] = useState(data.outputName || "output");
  const [displayFormat, setDisplayFormat] = useState(
    data.displayFormat || "auto"
  );
  const [exportFormat, setExportFormat] = useState(data.exportFormat || "json");
  const [showPreview, setShowPreview] = useState(data.showPreview !== false);
  const [autoSave, setAutoSave] = useState(data.autoSave || false);
  const [maxLines, setMaxLines] = useState(data.maxLines || "100");
  const [outputResult, setOutputResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOutput, setCurrentOutput] = useState<any>(null);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  outputName,
                  displayFormat,
                  exportFormat,
                  showPreview,
                  autoSave,
                  maxLines,
                  configured: Boolean(outputName),
                },
              }
            : node
        )
      );
    }
  }, [
    outputName,
    displayFormat,
    exportFormat,
    showPreview,
    autoSave,
    maxLines,
    setNodes,
    id,
  ]);

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

  const formatOutput = (data: any, format: string) => {
    if (!data) return "No data available";

    switch (format) {
      case "json":
        return JSON.stringify(data, null, 2);
      case "yaml":
        // Simple YAML-like formatting
        if (typeof data === "object") {
          return Object.entries(data)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join("\n");
        }
        return String(data);
      case "csv":
        if (Array.isArray(data)) {
          if (data.length === 0) return "";
          const headers = Object.keys(data[0]);
          const csvRows = [
            headers.join(","),
            ...data.map((row) =>
              headers.map((h) => JSON.stringify(row[h] || "")).join(",")
            ),
          ];
          return csvRows.join("\n");
        } else if (typeof data === "object") {
          return Object.entries(data)
            .map(([k, v]) => `${k},${JSON.stringify(v)}`)
            .join("\n");
        }
        return String(data);
      case "text":
        if (typeof data === "string") return data;
        if (typeof data === "object") {
          return Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        }
        return String(data);
      case "markdown":
        if (typeof data === "object") {
          let md = "# Output Result\n\n";
          Object.entries(data).forEach(([key, value]) => {
            md += `## ${key}\n${JSON.stringify(value, null, 2)}\n\n`;
          });
          return md;
        }
        return `# Output\n\n${String(data)}`;
      case "html":
        if (typeof data === "object") {
          return `<div class="output-result">
            <h2>Output Result</h2>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </div>`;
        }
        return `<div class="output-result">${String(data)}</div>`;
      case "auto":
      default:
        if (typeof data === "string") return data;
        if (typeof data === "object") return JSON.stringify(data, null, 2);
        return String(data);
    }
  };

  const testOutput = async () => {
    if (!outputName) {
      alert("Please enter an output name first");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate output processing with sample data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const sampleData = {
        timestamp: new Date().toISOString(),
        message: "Sample output data for testing",
        status: "success",
        data: {
          processed_items: 42,
          total_time: "1.2s",
          success_rate: "98.5%",
        },
        metadata: {
          node_id: id,
          output_name: outputName,
          format: displayFormat,
        },
      };

      setCurrentOutput(sampleData);

      const result = {
        output_id: `out_${Date.now()}`,
        name: outputName,
        format: displayFormat,
        export_format: exportFormat,
        data: sampleData,
        formatted_output: formatOutput(sampleData, displayFormat),
        size: JSON.stringify(sampleData).length,
        lines: formatOutput(sampleData, displayFormat).split("\n").length,
        created_at: new Date().toISOString(),
        message: "Output processed successfully",
      };

      setOutputResult(result);
      alert(
        `✅ Output processed!\nFormat: ${displayFormat}\nSize: ${result.size} bytes`
      );
    } catch (error) {
      alert(`❌ Failed to process output: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyOutput = () => {
    if (!currentOutput) {
      alert("No output data to copy");
      return;
    }
    const formatted = formatOutput(currentOutput, displayFormat);
    navigator.clipboard.writeText(formatted);
    alert("Output copied to clipboard!");
  };

  const downloadOutput = () => {
    if (!currentOutput) {
      alert("No output data to download");
      return;
    }

    const formatted = formatOutput(currentOutput, exportFormat);
    const blob = new Blob([formatted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${outputName}.${
      exportFormat === "json" ? "json" : exportFormat === "csv" ? "csv" : "txt"
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearOutput = () => {
    setCurrentOutput(null);
    setOutputResult(null);
  };

  const displayFormats = [
    { value: "auto", label: "🔄 Auto Detect" },
    { value: "json", label: "🔧 JSON" },
    { value: "yaml", label: "📋 YAML" },
    { value: "csv", label: "📊 CSV" },
    { value: "text", label: "📝 Plain Text" },
    { value: "markdown", label: "📖 Markdown" },
    { value: "html", label: "🌐 HTML" },
  ];

  const exportFormats = [
    { value: "json", label: "JSON" },
    { value: "csv", label: "CSV" },
    { value: "txt", label: "Text" },
    { value: "yaml", label: "YAML" },
    { value: "md", label: "Markdown" },
    { value: "html", label: "HTML" },
  ];

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <Monitor className="h-4 w-4 mr-2 text-purple-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Output Name
          </Label>
          <Input
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            placeholder="result"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Display Format
            </Label>
            <Select value={displayFormat} onValueChange={setDisplayFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {displayFormats.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Export Format
            </Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Max Display Lines
          </Label>
          <Input
            value={maxLines}
            onChange={(e) => setMaxLines(e.target.value)}
            placeholder="100"
            type="number"
            min="10"
            max="1000"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Show Preview</Label>
          <Switch checked={showPreview} onCheckedChange={setShowPreview} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Auto Save</Label>
          <Switch checked={autoSave} onCheckedChange={setAutoSave} />
        </div>

        {showPreview && currentOutput && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">Output Preview:</span>
              <Eye className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-xs text-green-300/70 font-mono max-h-32 overflow-auto">
              <pre>
                {formatOutput(currentOutput, displayFormat)
                  .split("\n")
                  .slice(0, parseInt(maxLines))
                  .join("\n")}
              </pre>
            </div>
          </div>
        )}

        {outputResult && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">Output Status:</span>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-xs text-green-300/70 space-y-1">
              <div>Name: {outputResult.name}</div>
              <div>Format: {outputResult.format}</div>
              <div>Size: {outputResult.size} bytes</div>
              <div>Lines: {outputResult.lines}</div>
              <div>
                Created: {new Date(outputResult.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={testOutput}
            size="sm"
            className="flex-1"
            disabled={isProcessing}
          >
            <Code className="h-3 w-3 mr-1" />
            {isProcessing ? "Processing..." : "Test Output"}
          </Button>
          <Button onClick={copyOutput} size="sm" variant="outline">
            <Copy className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          <Button
            onClick={downloadOutput}
            size="sm"
            variant="outline"
            className="text-xs"
            disabled={!currentOutput}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Button
            onClick={clearOutput}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {displayFormat}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {outputName}
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
            : "⟳ Generating"}
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

export default OutputNode;
