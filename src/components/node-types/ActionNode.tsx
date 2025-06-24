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
  Zap,
  Settings,
  Play,
  CheckCircle,
  Copy,
  Code,
  Terminal,
  AlertTriangle,
} from "lucide-react";

const ActionNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [actionType, setActionType] = useState(data.actionType || "javascript");
  const [actionCode, setActionCode] = useState(
    data.actionCode || data.content || ""
  );
  const [actionName, setActionName] = useState(data.actionName || "action");
  const [parameters, setParameters] = useState(data.parameters || "{}");
  const [timeout, setTimeout] = useState(data.timeout || "30");
  const [retryEnabled, setRetryEnabled] = useState(data.retryEnabled !== false);
  const [asyncMode, setAsyncMode] = useState(data.asyncMode || false);
  const [actionResult, setActionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  actionType,
                  actionCode,
                  actionName,
                  parameters,
                  timeout,
                  retryEnabled,
                  asyncMode,
                  content: actionCode, // Keep backward compatibility
                  configured: Boolean(actionCode),
                },
              }
            : node
        )
      );
    }
  }, [
    actionType,
    actionCode,
    actionName,
    parameters,
    timeout,
    retryEnabled,
    asyncMode,
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

  const executeAction = async () => {
    if (!actionCode) {
      alert("Please enter action code first");
      return;
    }

    let parsedParams = {};
    try {
      if (parameters.trim()) {
        parsedParams = JSON.parse(parameters);
      }
    } catch (error) {
      alert("Invalid JSON in parameters field");
      return;
    }

    setIsExecuting(true);

    try {
      // Simulate action execution based on type
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let result: any;

      switch (actionType) {
        case "javascript":
          result = {
            type: "javascript",
            code: actionCode,
            output: "console.log('Action executed successfully')",
            variables: parsedParams,
            execution_time: "0.12s",
            memory_used: "2.1MB",
          };
          break;
        case "python":
          result = {
            type: "python",
            code: actionCode,
            output: "Action executed successfully",
            variables: parsedParams,
            execution_time: "0.08s",
            memory_used: "1.8MB",
          };
          break;
        case "shell":
          result = {
            type: "shell",
            command: actionCode,
            output: "Command executed successfully\nExit code: 0",
            environment: parsedParams,
            execution_time: "0.05s",
          };
          break;
        case "http":
          result = {
            type: "http",
            request: actionCode,
            response: {
              status: 200,
              data: { message: "HTTP request successful" },
              headers: { "content-type": "application/json" },
            },
            execution_time: "0.3s",
          };
          break;
        case "database":
          result = {
            type: "database",
            query: actionCode,
            rows_affected: Math.floor(Math.random() * 100) + 1,
            result_set: [{ id: 1, name: "Sample Data" }],
            execution_time: "0.02s",
          };
          break;
        case "file":
          result = {
            type: "file",
            operation: actionCode,
            files_processed: Math.floor(Math.random() * 10) + 1,
            bytes_processed: Math.floor(Math.random() * 1000000) + 1000,
            execution_time: "0.15s",
          };
          break;
        default:
          result = {
            type: actionType,
            code: actionCode,
            output: "Generic action executed",
            parameters: parsedParams,
            execution_time: "0.1s",
          };
      }

      const executionResult = {
        action_id: `act_${Date.now()}`,
        name: actionName,
        type: actionType,
        async: asyncMode,
        timeout: parseInt(timeout),
        retry_enabled: retryEnabled,
        status: "completed",
        result: result,
        created_at: new Date().toISOString(),
        message: "Action executed successfully",
      };

      setActionResult(executionResult);
      alert(
        `✅ Action executed!\nType: ${actionType}\nTime: ${result.execution_time}`
      );
    } catch (error) {
      alert(`❌ Action execution failed: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(actionCode);
    alert("Action code copied to clipboard!");
  };

  const loadTemplate = (templateType: string) => {
    const templates = {
      javascript: `// JavaScript Action
function processData(input) {
  console.log('Processing:', input);
  return {
    processed: true,
    timestamp: new Date().toISOString(),
    result: input.toUpperCase()
  };
}

// Execute the action
const result = processData('hello world');
console.log('Result:', result);`,
      python: `# Python Action
import json
from datetime import datetime

def process_data(input_data):
    print(f"Processing: {input_data}")
    return {
        "processed": True,
        "timestamp": datetime.now().isoformat(),
        "result": input_data.upper()
    }

# Execute the action
result = process_data("hello world")
print(f"Result: {result}")`,
      shell: `#!/bin/bash
# Shell Action
echo "Starting action execution..."

INPUT_DATA="$1"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "Processing: $INPUT_DATA"
echo "Timestamp: $TIMESTAMP"

# Process the data
RESULT=$(echo "$INPUT_DATA" | tr '[:lower:]' '[:upper:]')
echo "Result: $RESULT"

echo "Action completed successfully"`,
      http: `{
  "method": "POST",
  "url": "https://api.example.com/process",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-token"
  },
  "body": {
    "action": "process_data",
    "input": "hello world",
    "timestamp": "{{timestamp}}"
  }
}`,
      database: `-- SQL Action
SELECT 
    id,
    name,
    created_at,
    UPPER(description) as processed_description
FROM items 
WHERE status = 'active'
  AND created_at >= NOW() - INTERVAL '24 HOURS'
ORDER BY created_at DESC
LIMIT 100;`,
      file: `{
  "operation": "process_files",
  "source_path": "/input/*.json",
  "destination_path": "/output/",
  "transformations": [
    "validate_json",
    "normalize_data",
    "add_timestamp"
  ],
  "options": {
    "overwrite": false,
    "backup": true
  }
}`,
    };

    setActionCode(templates[templateType] || "");
  };

  const actionTypes = [
    { value: "javascript", label: "🟨 JavaScript", icon: Code },
    { value: "python", label: "🐍 Python", icon: Code },
    { value: "shell", label: "🐚 Shell/Bash", icon: Terminal },
    { value: "http", label: "🌐 HTTP Request", icon: Zap },
    { value: "database", label: "🗄️ Database Query", icon: Settings },
    { value: "file", label: "📁 File Operation", icon: Settings },
  ];

  const getActionIcon = (type: string) => {
    const actionType = actionTypes.find((t) => t.value === type);
    return actionType?.icon || Code;
  };

  const ActionIcon = getActionIcon(actionType);

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <ActionIcon className="h-4 w-4 mr-2 text-orange-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Action Type
            </Label>
            <Select
              value={actionType}
              onValueChange={(value) => {
                setActionType(value);
                if (actionCode === "" || actionCode === data.content) {
                  loadTemplate(value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Action Name
            </Label>
            <Input
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
              placeholder="my_action"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Action Code
          </Label>
          <Textarea
            value={actionCode}
            onChange={(e) => setActionCode(e.target.value)}
            placeholder={`Enter your ${actionType} code here...`}
            className="min-h-[120px] text-xs font-mono"
          />
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Parameters (JSON)
          </Label>
          <Textarea
            value={parameters}
            onChange={(e) => setParameters(e.target.value)}
            placeholder='{"key": "value", "timeout": 30}'
            className="min-h-[60px] text-xs font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Timeout (s)
            </Label>
            <Input
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              placeholder="30"
              type="number"
              min="1"
              max="300"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-green-300">Retry</Label>
              <Switch
                checked={retryEnabled}
                onCheckedChange={setRetryEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-green-300">Async</Label>
              <Switch checked={asyncMode} onCheckedChange={setAsyncMode} />
            </div>
          </div>
        </div>

        {actionResult && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">Execution Result:</span>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-xs text-green-300/70 space-y-1">
              <div>ID: {actionResult.action_id}</div>
              <div>Type: {actionResult.type}</div>
              <div>Status: {actionResult.status}</div>
              <div>Time: {actionResult.result?.execution_time}</div>
              {actionResult.result?.memory_used && (
                <div>Memory: {actionResult.result.memory_used}</div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={executeAction}
            size="sm"
            className="flex-1"
            disabled={isExecuting}
          >
            <Play className="h-3 w-3 mr-1" />
            {isExecuting ? "Executing..." : "Execute Action"}
          </Button>
          <Button onClick={copyCode} size="sm" variant="outline">
            <Copy className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          <Button
            onClick={() => loadTemplate(actionType)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Load Template
          </Button>
          <Button
            onClick={() => setActionCode("")}
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
          {actionType}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {actionName}
        </Badge>
        {asyncMode && (
          <Badge
            variant="outline"
            className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs"
          >
            Async
          </Badge>
        )}
        {retryEnabled && (
          <Badge
            variant="outline"
            className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30 text-xs"
          >
            Retry
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
            ? "✓ Action Executed"
            : data.executionStatus === "error"
            ? "✗ Execution Failed"
            : "⟳ Executing"}
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

export default ActionNode;
