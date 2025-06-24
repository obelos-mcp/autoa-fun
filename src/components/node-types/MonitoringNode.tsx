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
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import {
  Activity,
  Settings,
  Zap,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const MonitoringNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [monitorType, setMonitorType] = useState(data.monitorType || "system");
  const [interval, setInterval] = useState(data.interval || "60");
  const [metrics, setMetrics] = useState(data.metrics || "cpu,memory,disk");
  const [alertThreshold, setAlertThreshold] = useState(
    data.alertThreshold || "80"
  );
  const [enabled, setEnabled] = useState(data.enabled !== false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  monitorType,
                  interval,
                  metrics,
                  alertThreshold,
                  enabled,
                  configured: Boolean(metrics && interval),
                },
              }
            : node
        )
      );
    }
  }, [monitorType, interval, metrics, alertThreshold, enabled, setNodes, id]);

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

  const startMonitoring = () => {
    if (!metrics) {
      alert("Please select metrics to monitor first");
      return;
    }

    setIsMonitoring(true);
    alert(
      `Starting monitoring: ${metrics} every ${interval} seconds with ${alertThreshold}% alert threshold`
    );

    // Simulate monitoring for demo
    setTimeout(() => {
      setIsMonitoring(false);
      alert("Monitoring session completed - all systems normal");
    }, 3000);
  };

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[300px] matrix-hover">
      <div className="flex items-center mb-2">
        <Activity className="h-4 w-4 mr-2 text-blue-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Monitor Type
          </Label>
          <Select value={monitorType} onValueChange={setMonitorType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">🖥️ System Resources</SelectItem>
              <SelectItem value="application">
                🚀 Application Performance
              </SelectItem>
              <SelectItem value="network">🌐 Network Traffic</SelectItem>
              <SelectItem value="database">🗄️ Database Performance</SelectItem>
              <SelectItem value="custom">⚙️ Custom Metrics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Metrics to Monitor
          </Label>
          <Input
            value={metrics}
            onChange={(e) => setMetrics(e.target.value)}
            placeholder="cpu,memory,disk,network"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Interval (seconds)
            </Label>
            <Input
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              placeholder="60"
            />
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Alert Threshold (%)
            </Label>
            <Input
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              placeholder="80"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Enable Monitoring</Label>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {isMonitoring && (
          <div className="space-y-2">
            <Label className="text-sm text-green-300">
              Monitoring Progress
            </Label>
            <Progress value={66} className="h-2 matrix-progress" />
            <div className="text-xs text-green-400 animate-pulse">
              📊 Collecting metrics...
            </div>
          </div>
        )}

        <Button
          onClick={startMonitoring}
          size="sm"
          className="w-full"
          disabled={isMonitoring}
        >
          <Zap className="h-3 w-3 mr-1" />
          {isMonitoring ? "Monitoring..." : "Start Monitoring"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {monitorType}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {interval}s
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
            ? "✓ Monitoring Active"
            : data.executionStatus === "error"
            ? "✗ Monitoring Error"
            : "⟳ Starting Monitor"}
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

export default MonitoringNode;
