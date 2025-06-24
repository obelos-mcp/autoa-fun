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
  Globe,
  Settings,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

const ApiNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [url, setUrl] = useState(data.url || "");
  const [method, setMethod] = useState(data.method || "GET");
  const [headers, setHeaders] = useState(data.headers || "{}");
  const [body, setBody] = useState(data.body || "");
  const [timeout, setTimeout] = useState(data.timeout || "30");
  const [retryEnabled, setRetryEnabled] = useState(data.retryEnabled !== false);
  const [apiResult, setApiResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  url,
                  method,
                  headers,
                  body,
                  timeout,
                  retryEnabled,
                  configured: Boolean(url),
                },
              }
            : node
        )
      );
    }
  }, [url, method, headers, body, timeout, retryEnabled, setNodes, id]);

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

  const makeApiCall = async () => {
    if (!url) {
      alert("Please enter an API URL");
      return;
    }

    let parsedHeaders = {};
    try {
      if (headers.trim()) {
        parsedHeaders = JSON.parse(headers);
      }
    } catch (error) {
      alert("Invalid JSON in headers field");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call with realistic responses
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock different types of API responses based on URL patterns
      let mockResponse;
      const urlLower = url.toLowerCase();

      if (urlLower.includes("weather")) {
        mockResponse = {
          temperature: Math.floor(Math.random() * 30) + 10,
          humidity: Math.floor(Math.random() * 40) + 40,
          condition: ["sunny", "cloudy", "rainy", "snowy"][
            Math.floor(Math.random() * 4)
          ],
          city: "New York",
          timestamp: new Date().toISOString(),
        };
      } else if (urlLower.includes("user") || urlLower.includes("profile")) {
        mockResponse = {
          id: Math.floor(Math.random() * 1000),
          name: "John Doe",
          email: "john@example.com",
          created_at: new Date().toISOString(),
          active: true,
        };
      } else if (urlLower.includes("product") || urlLower.includes("item")) {
        mockResponse = {
          id: Math.floor(Math.random() * 100),
          name: "Sample Product",
          price: (Math.random() * 100 + 10).toFixed(2),
          category: "Electronics",
          in_stock: Math.random() > 0.3,
        };
      } else if (urlLower.includes("crypto") || urlLower.includes("bitcoin")) {
        mockResponse = {
          symbol: "BTC",
          price: (Math.random() * 5000 + 40000).toFixed(2),
          change_24h: ((Math.random() - 0.5) * 10).toFixed(2),
          volume: Math.floor(Math.random() * 1000000000),
        };
      } else {
        // Generic response
        mockResponse = {
          status: "success",
          data: {
            message: "API call successful",
            timestamp: new Date().toISOString(),
            method: method,
            url: url,
          },
        };
      }

      const result = {
        status: 200,
        statusText: "OK",
        data: mockResponse,
        headers: {
          "content-type": "application/json",
          "x-api-version": "1.0",
        },
        config: {
          method: method,
          url: url,
          headers: parsedHeaders,
          timeout: parseInt(timeout) * 1000,
        },
        duration: Math.floor(Math.random() * 2000) + 500,
      };

      setApiResult(result);
      alert(
        `✅ API call successful!\nStatus: ${
          result.status
        }\nResponse: ${JSON.stringify(mockResponse, null, 2)}`
      );
    } catch (error) {
      const errorResult = {
        status: 500,
        statusText: "Internal Server Error",
        error: error.message,
        config: {
          method: method,
          url: url,
        },
      };
      setApiResult(errorResult);
      alert(`❌ API call failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const methods = [
    { value: "GET", label: "GET", color: "text-green-400" },
    { value: "POST", label: "POST", color: "text-blue-400" },
    { value: "PUT", label: "PUT", color: "text-yellow-400" },
    { value: "DELETE", label: "DELETE", color: "text-red-400" },
    { value: "PATCH", label: "PATCH", color: "text-purple-400" },
  ];

  const getMethodColor = (method: string) => {
    const methodObj = methods.find((m) => m.value === method);
    return methodObj?.color || "text-gray-400";
  };

  const displayUrl = url.length > 25 ? url.substring(0, 25) + "..." : url;

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <Globe className="h-4 w-4 mr-2 text-blue-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-green-300 mb-1 block">API URL</Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/data"
            type="url"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {methods.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <span className={m.color}>{m.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Headers (JSON)
          </Label>
          <Textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
            className="min-h-[60px] text-xs font-mono"
          />
        </div>

        {(method === "POST" || method === "PUT" || method === "PATCH") && (
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Request Body
            </Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"key": "value"}'
              className="min-h-[60px] text-xs font-mono"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Enable Retry</Label>
          <Switch checked={retryEnabled} onCheckedChange={setRetryEnabled} />
        </div>

        {apiResult && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">API Response:</span>
              <div className="flex items-center gap-2">
                {apiResult.status < 400 ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                )}
                <Badge
                  variant={apiResult.status < 400 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {apiResult.status}
                </Badge>
              </div>
            </div>
            <div className="text-xs text-green-300/70 mb-2">
              Duration: {apiResult.duration}ms
            </div>
            {apiResult.data && (
              <div className="text-xs text-green-300/70 font-mono max-h-24 overflow-auto">
                <pre>{JSON.stringify(apiResult.data, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={makeApiCall}
          size="sm"
          className="w-full"
          disabled={isLoading}
        >
          <Zap className="h-3 w-3 mr-1" />
          {isLoading ? "Calling API..." : "Test API Call"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge
          variant="outline"
          className={`matrix-badge text-xs ${getMethodColor(method)}`}
        >
          {method}
        </Badge>
        {url && (
          <Badge variant="outline" className="matrix-badge text-xs" title={url}>
            {displayUrl}
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
            ? "✓ API Call Complete"
            : data.executionStatus === "error"
            ? "✗ API Call Failed"
            : "⟳ Calling API"}
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

export default ApiNode;
