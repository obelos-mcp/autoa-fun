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
import {
  TrendingUp,
  Settings,
  Zap,
  CheckCircle,
  DollarSign,
} from "lucide-react";

const StockDataNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [symbol, setSymbol] = useState(data.symbol || "BTC");
  const [dataType, setDataType] = useState(data.dataType || "price");
  const [interval, setInterval] = useState(data.interval || "1m");
  const [realTime, setRealTime] = useState(data.realTime !== false);
  const [apiKey, setApiKey] = useState(data.apiKey || "");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
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
                  symbol,
                  dataType,
                  interval,
                  realTime,
                  apiKey,
                  configured: Boolean(symbol),
                },
              }
            : node
        )
      );
    }
  }, [symbol, dataType, interval, realTime, apiKey, setNodes, id]);

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

  const fetchPrice = async () => {
    if (!symbol) {
      alert("Please enter a symbol first");
      return;
    }

    setIsLoading(true);

    // Simulate API call with realistic crypto/stock prices
    const prices = {
      BTC: 45000 + Math.random() * 5000,
      ETH: 2500 + Math.random() * 500,
      AAPL: 150 + Math.random() * 20,
      TSLA: 200 + Math.random() * 50,
      GOOGL: 2800 + Math.random() * 200,
      AMZN: 3200 + Math.random() * 300,
    };

    setTimeout(() => {
      const price =
        prices[symbol as keyof typeof prices] || 100 + Math.random() * 50;
      setCurrentPrice(price);
      setIsLoading(false);
      alert(`${symbol} current price: $${price.toFixed(2)}`);
    }, 1500);
  };

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[300px] matrix-hover">
      <div className="flex items-center mb-2">
        <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-green-300 mb-1 block">Symbol</Label>
          <Select value={symbol} onValueChange={setSymbol}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC">₿ Bitcoin (BTC)</SelectItem>
              <SelectItem value="ETH">⟠ Ethereum (ETH)</SelectItem>
              <SelectItem value="AAPL">🍎 Apple (AAPL)</SelectItem>
              <SelectItem value="TSLA">🚗 Tesla (TSLA)</SelectItem>
              <SelectItem value="GOOGL">🔍 Google (GOOGL)</SelectItem>
              <SelectItem value="AMZN">📦 Amazon (AMZN)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">Data Type</Label>
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">💰 Current Price</SelectItem>
              <SelectItem value="volume">📊 Volume</SelectItem>
              <SelectItem value="marketcap">🏦 Market Cap</SelectItem>
              <SelectItem value="change">📈 Price Change</SelectItem>
              <SelectItem value="all">🌐 All Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Interval
            </Label>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Minute</SelectItem>
                <SelectItem value="5m">5 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Switch checked={realTime} onCheckedChange={setRealTime} />
              <Label className="text-xs text-green-300">Real-time</Label>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            API Key (Optional)
          </Label>
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your API key for premium data"
            type="password"
          />
        </div>

        {currentPrice && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-300">{symbol} Price:</span>
              <span className="text-lg font-bold text-green-400">
                <DollarSign className="h-4 w-4 inline mr-1" />
                {currentPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={fetchPrice}
          size="sm"
          className="w-full"
          disabled={isLoading}
        >
          <Zap className="h-3 w-3 mr-1" />
          {isLoading ? "Fetching..." : "Fetch Price"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {symbol}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {dataType}
        </Badge>
        {realTime && (
          <Badge
            variant="outline"
            className="bg-green-600/20 text-green-400 border-green-600/30 text-xs"
          >
            Live
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
            ? "✓ Data Retrieved"
            : data.executionStatus === "error"
            ? "✗ Fetch Error"
            : "⟳ Fetching Data"}
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

export default StockDataNode;
