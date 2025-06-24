import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Heart,
  Globe,
  Database,
  Server,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";

const HealthCheckNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [checkType, setCheckType] = useState(data.checkType || "http");
  const [endpoint, setEndpoint] = useState(data.endpoint || "");
  const [interval, setInterval] = useState(data.interval || "60");
  const [timeout, setTimeout] = useState(data.timeout || "5");
  const [expectedStatus, setExpectedStatus] = useState(
    data.expectedStatus || "200"
  );
  const [expectedResponse, setExpectedResponse] = useState(
    data.expectedResponse || ""
  );
  const [retries, setRetries] = useState(data.retries || "3");
  const [enableAlerts, setEnableAlerts] = useState(data.enableAlerts || true);
  const [alertThreshold, setAlertThreshold] = useState(
    data.alertThreshold || "3"
  );
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [healthScore, setHealthScore] = useState(data.healthScore || 100);
  const [lastCheck, setLastCheck] = useState(data.lastCheck || null);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  checkType,
                  endpoint,
                  interval,
                  timeout,
                  expectedStatus,
                  expectedResponse,
                  retries,
                  enableAlerts,
                  alertThreshold,
                  healthScore,
                  lastCheck,
                  configured: Boolean(endpoint),
                },
              }
            : node
        )
      );
    }
  }, [
    checkType,
    endpoint,
    interval,
    timeout,
    expectedStatus,
    expectedResponse,
    retries,
    enableAlerts,
    alertThreshold,
    healthScore,
    lastCheck,
    setNodes,
    id,
  ]);

  const getCheckTypeIcon = () => {
    switch (checkType) {
      case "http":
        return <Globe className="h-4 w-4" />;
      case "database":
        return <Database className="h-4 w-4" />;
      case "tcp":
        return <Server className="h-4 w-4" />;
      case "ping":
        return <Zap className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getHealthColor = () => {
    if (healthScore >= 80) return "text-green-400";
    if (healthScore >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getHealthStatus = () => {
    if (healthScore >= 80) return "Healthy";
    if (healthScore >= 60) return "Warning";
    return "Critical";
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

  const runHealthCheck = async () => {
    if (!endpoint) {
      alert("Please configure endpoint first");
      return;
    }

    setIsMonitoring(true);
    const startTime = Date.now();

    try {
      // Simulate health check based on type
      let result = { success: true, responseTime: 0, details: "" };

      switch (checkType) {
        case "http":
          // Simulate HTTP check
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 2000 + 500)
          );
          result.responseTime = Date.now() - startTime;
          result.details = `HTTP ${expectedStatus} - ${result.responseTime}ms`;
          break;

        case "database":
          // Simulate database check
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 1000 + 200)
          );
          result.responseTime = Date.now() - startTime;
          result.details = `DB Connection - ${result.responseTime}ms`;
          break;

        case "tcp":
          // Simulate TCP check
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 500 + 100)
          );
          result.responseTime = Date.now() - startTime;
          result.details = `TCP Port Open - ${result.responseTime}ms`;
          break;

        case "ping":
          // Simulate ping check
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 300 + 50)
          );
          result.responseTime = Date.now() - startTime;
          result.details = `Ping - ${result.responseTime}ms`;
          break;
      }

      // Update health score based on response time
      let newScore = 100;
      if (result.responseTime > 5000) newScore = 20;
      else if (result.responseTime > 3000) newScore = 50;
      else if (result.responseTime > 1000) newScore = 80;

      setHealthScore(newScore);
      setLastCheck(new Date().toISOString());

      alert(
        `Health Check Complete!\n${result.details}\nHealth Score: ${newScore}%`
      );
    } catch (error) {
      setHealthScore(0);
      alert("Health check failed!");
    } finally {
      setIsMonitoring(false);
    }
  };

  const startMonitoring = () => {
    if (!endpoint) {
      alert("Please configure endpoint first");
      return;
    }

    alert(`Started continuous monitoring every ${interval} seconds`);
    console.log(`Monitoring ${endpoint} every ${interval}s`);
  };

  const viewHealthHistory = () => {
    const mockHistory = [
      { time: "14:30", status: "Healthy", responseTime: "245ms" },
      { time: "14:29", status: "Healthy", responseTime: "198ms" },
      { time: "14:28", status: "Warning", responseTime: "1.2s" },
      { time: "14:27", status: "Healthy", responseTime: "156ms" },
      { time: "14:26", status: "Healthy", responseTime: "203ms" },
    ];

    const historyText = mockHistory
      .map((h) => `${h.time} - ${h.status} (${h.responseTime})`)
      .join("\n");

    alert(`Health Check History:\n\n${historyText}`);
  };

  return (
    <div className="bg-black text-white rounded-xl p-4 border border-white/20 min-w-[300px]">
      <div className="flex items-center mb-2">
        {getCheckTypeIcon()}
        <div className="font-medium text-white ml-2">{data.label}</div>
        <div className={`ml-auto text-sm font-bold ${getHealthColor()}`}>
          {getHealthStatus()}
        </div>
      </div>

      <div className="text-sm text-gray-300 mb-3">{data.description}</div>

      {/* Health Score Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <Label className="text-xs text-gray-400">Health Score</Label>
          <span className={`text-xs font-bold ${getHealthColor()}`}>
            {healthScore}%
          </span>
        </div>
        <Progress
          value={healthScore}
          className="h-2"
          style={{
            background: "rgba(255,255,255,0.1)",
          }}
        />
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-gray-300 mb-1 block">Check Type</Label>
          <Select value={checkType} onValueChange={setCheckType}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="http">🌐 HTTP/HTTPS</SelectItem>
              <SelectItem value="database">🗄️ Database</SelectItem>
              <SelectItem value="tcp">🔌 TCP Port</SelectItem>
              <SelectItem value="ping">📡 Ping/ICMP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            {checkType === "http"
              ? "URL"
              : checkType === "database"
              ? "Connection String"
              : checkType === "tcp"
              ? "Host:Port"
              : "Host/IP Address"}
          </Label>
          <Input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder={
              checkType === "http"
                ? "https://api.example.com/health"
                : checkType === "database"
                ? "postgresql://user:pass@host:5432/db"
                : checkType === "tcp"
                ? "example.com:80"
                : "8.8.8.8"
            }
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-gray-300 mb-1 block">
              Check Interval (sec)
            </Label>
            <Input
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              placeholder="60"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-300 mb-1 block">
              Timeout (sec)
            </Label>
            <Input
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              placeholder="5"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {checkType === "http" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-gray-300 mb-1 block">
                Expected Status
              </Label>
              <Input
                value={expectedStatus}
                onChange={(e) => setExpectedStatus(e.target.value)}
                placeholder="200"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-300 mb-1 block">
                Expected Text
              </Label>
              <Input
                value={expectedResponse}
                onChange={(e) => setExpectedResponse(e.target.value)}
                placeholder="OK"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-gray-300 mb-1 block">
              Retry Count
            </Label>
            <Input
              value={retries}
              onChange={(e) => setRetries(e.target.value)}
              placeholder="3"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-300 mb-1 block">
              Alert Threshold
            </Label>
            <Input
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              placeholder="3"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={enableAlerts}
              onCheckedChange={setEnableAlerts}
              className="data-[state=checked]:bg-green-600"
            />
            <Label className="text-sm text-gray-300">Enable Alerts</Label>
          </div>
          {lastCheck && (
            <div className="text-xs text-gray-400">
              <Clock className="h-3 w-3 inline mr-1" />
              {new Date(lastCheck).toLocaleTimeString()}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={runHealthCheck}
            size="sm"
            disabled={isMonitoring}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isMonitoring ? (
              <Activity className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Heart className="h-3 w-3 mr-1" />
            )}
            {isMonitoring ? "Checking..." : "Run Check"}
          </Button>
          <Button
            onClick={startMonitoring}
            size="sm"
            variant="outline"
            className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <Activity className="h-3 w-3 mr-1" />
            Monitor
          </Button>
        </div>

        <Button
          onClick={viewHealthHistory}
          size="sm"
          variant="outline"
          className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <Clock className="h-3 w-3 mr-1" />
          View History
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge
          variant="outline"
          className="bg-background/30 text-xs border-white/20 text-white"
        >
          {checkType.toUpperCase()}
        </Badge>
        <Badge
          variant="outline"
          className="bg-background/30 text-xs border-white/20 text-white"
        >
          {interval}s interval
        </Badge>
        {enableAlerts && (
          <Badge
            variant="outline"
            className="bg-yellow-600/30 text-xs border-yellow-400 text-yellow-300"
          >
            ALERTS ON
          </Badge>
        )}
        {data.configured ? (
          <Badge variant="default" className="bg-green-600 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Configured
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Setup Required
          </Badge>
        )}
      </div>

      {data.executionStatus && (
        <div className={`text-xs mt-2 ${getStatusStyles()}`}>
          {data.executionStatus === "completed"
            ? "✓ Health Check Complete"
            : data.executionStatus === "error"
            ? "✗ Health Check Failed"
            : "⟳ Running Health Check"}
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

export default HealthCheckNode;
