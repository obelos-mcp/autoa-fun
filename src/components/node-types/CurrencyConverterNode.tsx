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
import { useState, useEffect } from "react";
import {
  DollarSign,
  Settings,
  Zap,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const CurrencyConverterNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [fromCurrency, setFromCurrency] = useState(data.fromCurrency || "USD");
  const [toCurrency, setToCurrency] = useState(data.toCurrency || "EUR");
  const [amount, setAmount] = useState(data.amount || "100");
  const [result, setResult] = useState<any>(null);
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
                  fromCurrency,
                  toCurrency,
                  amount,
                  configured: Boolean(fromCurrency && toCurrency && amount),
                },
              }
            : node
        )
      );
    }
  }, [fromCurrency, toCurrency, amount, setNodes, id]);

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

  const convertCurrency = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      alert("Please fill in all fields");
      return;
    }

    if (isNaN(parseFloat(amount))) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call with realistic exchange rates
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const exchangeRates: Record<string, number> = {
        "USD-EUR": 0.85,
        "USD-GBP": 0.75,
        "USD-JPY": 110,
        "USD-CAD": 1.25,
        "EUR-USD": 1.18,
        "EUR-GBP": 0.88,
        "EUR-JPY": 129,
        "GBP-USD": 1.33,
        "GBP-EUR": 1.14,
        "JPY-USD": 0.009,
        "CAD-USD": 0.8,
      };

      const rateKey = `${fromCurrency}-${toCurrency}`;
      const rate = exchangeRates[rateKey] || Math.random() * 2 + 0.5;
      const convertedAmount = Math.round(parseFloat(amount) * rate * 100) / 100;

      const conversionResult = {
        from_currency: fromCurrency,
        to_currency: toCurrency,
        original_amount: parseFloat(amount),
        converted_amount: convertedAmount,
        exchange_rate: rate,
        conversion_date: new Date().toISOString(),
      };

      setResult(conversionResult);
      alert(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
    } catch (error) {
      alert(`Conversion failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  ];

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[300px] matrix-hover">
      <div className="flex items-center mb-2">
        <DollarSign className="h-4 w-4 mr-2 text-green-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-green-300 mb-1 block">Amount</Label>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            type="number"
            min="0"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">From</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">To</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">Conversion Result:</span>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-lg font-bold text-green-400">
              {result.original_amount} {result.from_currency} ={" "}
              {result.converted_amount} {result.to_currency}
            </div>
            <div className="text-xs text-green-300/70 mt-1">
              Rate: 1 {result.from_currency} = {result.exchange_rate}{" "}
              {result.to_currency}
            </div>
          </div>
        )}

        <Button
          onClick={convertCurrency}
          size="sm"
          className="w-full"
          disabled={isLoading}
        >
          <Zap className="h-3 w-3 mr-1" />
          {isLoading ? "Converting..." : "Convert Currency"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {fromCurrency} → {toCurrency}
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
            ? "✓ Conversion Complete"
            : data.executionStatus === "error"
            ? "✗ Conversion Error"
            : "⟳ Converting"}
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

export default CurrencyConverterNode;
