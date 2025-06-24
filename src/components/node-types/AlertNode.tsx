import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { AlertTriangle, Settings, Zap, CheckCircle } from "lucide-react";

const AlertNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [alertType, setAlertType] = useState(data.alertType || "error");
  const [threshold, setThreshold] = useState(data.threshold || "");
  const [message, setMessage] = useState(data.message || "");
  const [enabled, setEnabled] = useState(data.enabled !== false);
  const [channels, setChannels] = useState(data.channels || "email");

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  alertType,
                  threshold,
                  message,
                  enabled,
                  channels,
                  configured: Boolean(message && threshold),
                },
              }
            : node
        )
      );
    }
  }, [alertType, threshold, message, enabled, channels, setNodes, id]);

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

  const testAlert = () => {
    if (!message) {
      alert("Please configure alert message first");
      return;
    }

    alert(
      `Alert would be sent: "${message}" via ${channels} when ${alertType} threshold ${threshold} is reached`
    );
  };

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[300px] matrix-hover">
      <div className="flex items-center mb-2">
        <AlertTriangle className="h-4 w-4 mr-2 text-orange-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Alert Type
          </Label>
          <Select value={alertType} onValueChange={setAlertType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="error">🚨 Error Alert</SelectItem>
              <SelectItem value="warning">⚠️ Warning Alert</SelectItem>
              <SelectItem value="info">ℹ️ Info Alert</SelectItem>
              <SelectItem value="success">✅ Success Alert</SelectItem>
              <SelectItem value="critical">🔴 Critical Alert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Threshold Value
          </Label>
          <Input
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="e.g., 90%, 5 errors, 1000ms"
          />
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Alert Message
          </Label>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="System alert: threshold exceeded"
          />
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Notification Channels
          </Label>
          <Select value={channels} onValueChange={setChannels}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">📧 Email</SelectItem>
              <SelectItem value="sms">📱 SMS</SelectItem>
              <SelectItem value="slack">💬 Slack</SelectItem>
              <SelectItem value="webhook">🔗 Webhook</SelectItem>
              <SelectItem value="all">🌐 All Channels</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Enable Alerts</Label>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <Button
          onClick={testAlert}
          size="sm"
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          <Zap className="h-3 w-3 mr-1" />
          Test Alert
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {alertType}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {channels}
        </Badge>
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
            ? "✓ Alert Configured"
            : data.executionStatus === "error"
            ? "✗ Alert Error"
            : "⟳ Processing Alert"}
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

export default AlertNode;
