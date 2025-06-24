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
  CreditCard,
  DollarSign,
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";

const PaymentProcessorNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [gateway, setGateway] = useState(data.gateway || "stripe");
  const [transactionType, setTransactionType] = useState(
    data.transactionType || "payment"
  );
  const [currency, setCurrency] = useState(data.currency || "USD");
  const [amount, setAmount] = useState(data.amount || "");
  const [description, setDescription] = useState(data.description || "");
  const [apiKey, setApiKey] = useState(data.apiKey || "");
  const [webhookUrl, setWebhookUrl] = useState(data.webhookUrl || "");
  const [enableRecurring, setEnableRecurring] = useState(
    data.enableRecurring || false
  );
  const [enable3DS, setEnable3DS] = useState(data.enable3DS || true);
  const [captureMode, setCaptureMode] = useState(
    data.captureMode || "automatic"
  );

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  gateway,
                  transactionType,
                  currency,
                  amount,
                  description,
                  apiKey,
                  webhookUrl,
                  enableRecurring,
                  enable3DS,
                  captureMode,
                  configured: Boolean(
                    apiKey && (amount || transactionType === "setup")
                  ),
                },
              }
            : node
        )
      );
    }
  }, [
    gateway,
    transactionType,
    currency,
    amount,
    description,
    apiKey,
    webhookUrl,
    enableRecurring,
    enable3DS,
    captureMode,
    setNodes,
    id,
  ]);

  const getGatewayIcon = () => {
    switch (gateway) {
      case "stripe":
        return "💳";
      case "paypal":
        return "🅿️";
      case "square":
        return "⬜";
      case "razorpay":
        return "💎";
      case "braintree":
        return "🧠";
      default:
        return "💰";
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

  const testPayment = () => {
    if (!apiKey) {
      alert("Please configure API key first");
      return;
    }

    if (!amount && transactionType !== "setup") {
      alert("Please specify amount for payment");
      return;
    }

    // Simulate payment processing
    const testData = {
      gateway,
      type: transactionType,
      amount: transactionType === "setup" ? "0.00" : amount,
      currency,
      description,
      test_mode: true,
    };

    console.log("Processing test payment:", testData);
    alert(
      `Test ${transactionType} initiated via ${gateway}!\nAmount: ${amount} ${currency}`
    );
  };

  const validateConfiguration = () => {
    const issues = [];

    if (!apiKey) issues.push("API Key required");
    if (!amount && transactionType !== "setup") issues.push("Amount required");
    if (enableRecurring && !webhookUrl)
      issues.push("Webhook URL required for recurring payments");

    if (issues.length > 0) {
      alert(`Configuration Issues:\n${issues.join("\n")}`);
    } else {
      alert("✅ Configuration is valid!");
    }
  };

  const showPaymentForm = () => {
    const formHtml = `
      <div style="font-family: monospace; padding: 20px; background: #1a1a1a; color: #00ff00; border-radius: 8px;">
        <h3>Payment Form Preview</h3>
        <p><strong>Gateway:</strong> ${gateway}</p>
        <p><strong>Amount:</strong> ${amount} ${currency}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>3D Secure:</strong> ${enable3DS ? "Enabled" : "Disabled"}</p>
        <p><strong>Recurring:</strong> ${
          enableRecurring ? "Enabled" : "Disabled"
        }</p>
        <hr />
        <p style="color: #888;">This would be your payment form</p>
      </div>
    `;

    const newWindow = window.open("", "_blank", "width=500,height=400");
    newWindow?.document.write(formHtml);
  };

  return (
    <div className="bg-black text-white rounded-xl p-4 border border-white/20 min-w-[320px]">
      <div className="flex items-center mb-2">
        <span className="text-lg mr-2">{getGatewayIcon()}</span>
        <div className="font-medium text-white">{data.label}</div>
      </div>

      <div className="text-sm text-gray-300 mb-3">{data.description}</div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            Payment Gateway
          </Label>
          <Select value={gateway} onValueChange={setGateway}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="stripe">💳 Stripe</SelectItem>
              <SelectItem value="paypal">🅿️ PayPal</SelectItem>
              <SelectItem value="square">⬜ Square</SelectItem>
              <SelectItem value="razorpay">💎 Razorpay</SelectItem>
              <SelectItem value="braintree">🧠 Braintree</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            Transaction Type
          </Label>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="payment">💰 One-time Payment</SelectItem>
              <SelectItem value="subscription">🔄 Subscription</SelectItem>
              <SelectItem value="setup">⚙️ Setup Intent</SelectItem>
              <SelectItem value="refund">↩️ Refund</SelectItem>
              <SelectItem value="capture">✅ Capture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-gray-300 mb-1 block">Amount</Label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="99.99"
              disabled={transactionType === "setup"}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-300 mb-1 block">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="USD">🇺🇸 USD</SelectItem>
                <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
                <SelectItem value="JPY">🇯🇵 JPY</SelectItem>
                <SelectItem value="INR">🇮🇳 INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            Description
          </Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment for services"
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            API Key / Secret
          </Label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk_test_..."
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            Webhook URL (optional)
          </Label>
          <Input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-app.com/webhooks/payment"
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-300 mb-1 block">
            Capture Mode
          </Label>
          <Select value={captureMode} onValueChange={setCaptureMode}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="automatic">⚡ Automatic</SelectItem>
              <SelectItem value="manual">✋ Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={enable3DS}
              onCheckedChange={setEnable3DS}
              className="data-[state=checked]:bg-green-600"
            />
            <Label className="text-sm text-gray-300">3D Secure</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={enableRecurring}
              onCheckedChange={setEnableRecurring}
              className="data-[state=checked]:bg-green-600"
            />
            <Label className="text-sm text-gray-300">Recurring</Label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={validateConfiguration}
            size="sm"
            variant="outline"
            className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <Shield className="h-3 w-3 mr-1" />
            Validate
          </Button>
          <Button
            onClick={testPayment}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Zap className="h-3 w-3 mr-1" />
            Test Pay
          </Button>
        </div>

        <Button
          onClick={showPaymentForm}
          size="sm"
          variant="outline"
          className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <Eye className="h-3 w-3 mr-1" />
          Preview Payment Form
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge
          variant="outline"
          className="bg-background/30 text-xs border-white/20 text-white"
        >
          {gateway.toUpperCase()}
        </Badge>
        <Badge
          variant="outline"
          className="bg-background/30 text-xs border-white/20 text-white"
        >
          {transactionType.toUpperCase()}
        </Badge>
        <Badge
          variant="outline"
          className="bg-background/30 text-xs border-white/20 text-white"
        >
          {currency}
        </Badge>
        {enable3DS && (
          <Badge
            variant="outline"
            className="bg-green-600/30 text-xs border-green-400 text-green-300"
          >
            3DS
          </Badge>
        )}
        {enableRecurring && (
          <Badge
            variant="outline"
            className="bg-blue-600/30 text-xs border-blue-400 text-blue-300"
          >
            RECURRING
          </Badge>
        )}
        {data.configured ? (
          <Badge variant="default" className="bg-green-600 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
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
            ? "✓ Payment Processed"
            : data.executionStatus === "error"
            ? "✗ Payment Failed"
            : "⟳ Processing Payment"}
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

export default PaymentProcessorNode;
