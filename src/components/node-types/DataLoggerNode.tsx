import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  FileText,
  Database,
  Cloud,
  HardDrive,
  Download,
  Eye,
  Settings,
} from "lucide-react";

const DataLoggerNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [storage, setStorage] = useState(data.storage || "local");
  const [format, setFormat] = useState(data.format || "json");
  const [filename, setFilename] = useState(data.filename || "data_log");
  const [fields, setFields] = useState(data.fields || "");
  const [filters, setFilters] = useState(data.filters || "");
  const [autoRotate, setAutoRotate] = useState(data.autoRotate || false);
  const [maxSize, setMaxSize] = useState(data.maxSize || "10");
  const [retention, setRetention] = useState(data.retention || "30");
  const [encryption, setEncryption] = useState(data.encryption || false);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  storage,
                  format,
                  filename,
                  fields,
                  filters,
                  autoRotate,
                  maxSize,
                  retention,
                  encryption,
                  configured: Boolean(filename),
                },
              }
            : node
        )
      );
    }
  }, [
    storage,
    format,
    filename,
    fields,
    filters,
    autoRotate,
    maxSize,
    retention,
    encryption,
    setNodes,
    id,
  ]);

  const getStorageIcon = () => {
    switch (storage) {
      case "local":
        return <HardDrive className="h-4 w-4" />;
      case "database":
        return <Database className="h-4 w-4" />;
      case "cloud":
        return <Cloud className="h-4 w-4" />;
      case "api":
        return <Settings className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

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

  const previewLog = () => {
    const sampleData = {
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: "Sample log entry",
      user_id: "user123",
      action: "data_processed",
      metadata: {
        source: "workflow_node",
        duration: "1.2s",
      },
    };

    const formattedData =
      format === "json"
        ? JSON.stringify(sampleData, null, 2)
        : format === "csv"
        ? Object.values(sampleData).join(",")
        : `${sampleData.timestamp} [${sampleData.level}] ${sampleData.message}`;

    alert(`Preview of log format:\n\n${formattedData}`);
  };

  const testLogging = () => {
    if (!filename) {
      alert("Please configure filename first");
      return;
    }

    console.log(`Logging data to ${storage} storage as ${format} format`);
    alert(`Test log entry created in ${filename}.${format}!`);
  };

  const downloadLogs = () => {
    const sampleLogs = [
      {
        timestamp: new Date().toISOString(),
        level: "INFO",
        message: "System started",
      },
      {
        timestamp: new Date().toISOString(),
        level: "DEBUG",
        message: "Processing data",
      },
      {
        timestamp: new Date().toISOString(),
        level: "INFO",
        message: "Task completed",
      },
    ];

    const dataStr =
      format === "json"
        ? JSON.stringify(sampleLogs, null, 2)
        : sampleLogs.map((log) => Object.values(log).join(",")).join("\n");

    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${filename}.${format}`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="bg-black text-white rounded-xl p-4 border border-white/20 min-w-[300px]">
      <div className="flex items-center mb-2">
        {getStorageIcon()}
        <div className="font-medium text-white ml-2">{data.label}</div>
      </div>

      <div className="text-sm text-gray-300 mb-3">{data.description}</div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            Storage Backend
          </Label>
          <Select value={storage} onValueChange={setStorage}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="local">💾 Local File</SelectItem>
              <SelectItem value="database">🗄️ Database</SelectItem>
              <SelectItem value="cloud">☁️ Cloud Storage</SelectItem>
              <SelectItem value="api">🔗 API Endpoint</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-1 block">Log Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="json">📋 JSON</SelectItem>
              <SelectItem value="csv">📊 CSV</SelectItem>
              <SelectItem value="txt">📄 Plain Text</SelectItem>
              <SelectItem value="xml">🏷️ XML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            {storage === "database"
              ? "Table Name"
              : storage === "api"
              ? "Endpoint URL"
              : "Filename"}
          </Label>
          <Input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder={
              storage === "database"
                ? "logs_table"
                : storage === "api"
                ? "https://api.example.com/logs"
                : "data_log"
            }
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            Fields to Log (comma-separated)
          </Label>
          <Textarea
            value={fields}
            onChange={(e) => setFields(e.target.value)}
            placeholder="timestamp,user_id,action,data,metadata"
            className="min-h-[50px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 text-xs"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            Data Filters (conditions)
          </Label>
          <Input
            value={filters}
            onChange={(e) => setFilters(e.target.value)}
            placeholder="level=ERROR OR priority>5"
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-gray-300 mb-1 block">
              Max Size (MB)
            </Label>
            <Input
              value={maxSize}
              onChange={(e) => setMaxSize(e.target.value)}
              placeholder="10"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-300 mb-1 block">
              Retention (days)
            </Label>
            <Input
              value={retention}
              onChange={(e) => setRetention(e.target.value)}
              placeholder="30"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoRotate}
              onCheckedChange={setAutoRotate}
              className="data-[state=checked]:bg-green-600"
            />
            <Label className="text-sm text-gray-300">Auto Rotate Logs</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={encryption}
              onCheckedChange={setEncryption}
              className="data-[state=checked]:bg-green-600"
            />
            <Label className="text-sm text-gray-300">Encrypt</Label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={previewLog}
            size="sm"
            variant="outline"
            className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            onClick={testLogging}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="h-3 w-3 mr-1" />
            Test Log
          </Button>
        </div>

        <Button
          onClick={downloadLogs}
          size="sm"
          variant="outline"
          className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <Download className="h-3 w-3 mr-1" />
          Download Sample Logs
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge
          variant="outline"
          className="bg-background/30 text-xs border-white/20 text-white"
        >
          {storage.toUpperCase()}
        </Badge>
        <Badge
          variant="outline"
          className="bg-background/30 text-xs border-white/20 text-white"
        >
          {format.toUpperCase()}
        </Badge>
        {autoRotate && (
          <Badge
            variant="outline"
            className="bg-blue-600/30 text-xs border-blue-400 text-blue-300"
          >
            AUTO-ROTATE
          </Badge>
        )}
        {encryption && (
          <Badge
            variant="outline"
            className="bg-yellow-600/30 text-xs border-yellow-400 text-yellow-300"
          >
            ENCRYPTED
          </Badge>
        )}
        {data.configured ? (
          <Badge variant="default" className="bg-green-600 text-xs">
            Ready
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs">
            Setup Required
          </Badge>
        )}
      </div>

      {data.executionStatus && (
        <div className={`text-xs mt-2 ${getStatusStyles()}`}>
          {data.executionStatus === "completed"
            ? "✓ Data Logged"
            : data.executionStatus === "error"
            ? "✗ Logging Failed"
            : "⟳ Logging Data"}
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

export default DataLoggerNode;
