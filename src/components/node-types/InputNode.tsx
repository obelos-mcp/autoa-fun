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
  Terminal,
  Settings,
  Zap,
  CheckCircle,
  Copy,
  FileText,
  Type,
} from "lucide-react";

const InputNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [inputValue, setInputValue] = useState(data.inputValue || "");
  const [inputType, setInputType] = useState(data.inputType || "text");
  const [inputName, setInputName] = useState(data.inputName || "input");
  const [placeholder, setPlaceholder] = useState(data.placeholder || "");
  const [required, setRequired] = useState(data.required !== false);
  const [multiline, setMultiline] = useState(data.multiline || false);
  const [validation, setValidation] = useState(data.validation || "none");
  const [inputResult, setInputResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  inputValue,
                  inputType,
                  inputName,
                  placeholder,
                  required,
                  multiline,
                  validation,
                  configured: Boolean(inputValue || !required),
                },
              }
            : node
        )
      );
    }
  }, [
    inputValue,
    inputType,
    inputName,
    placeholder,
    required,
    multiline,
    validation,
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

  const validateInput = (value: string) => {
    switch (validation) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "url":
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      case "number":
        return !isNaN(Number(value)) && value.trim() !== "";
      case "phone":
        return /^\+?[\d\s\-\(\)]{10,}$/.test(value);
      case "json":
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  };

  const testInput = async () => {
    if (required && !inputValue) {
      alert("This input is required. Please enter a value.");
      return;
    }

    if (validation !== "none" && inputValue && !validateInput(inputValue)) {
      alert(`Invalid ${validation} format. Please check your input.`);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate input processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let processedValue = inputValue;

      // Process based on input type
      if (inputType === "number") {
        processedValue = Number(inputValue);
      } else if (inputType === "json") {
        try {
          processedValue = JSON.parse(inputValue);
        } catch {
          processedValue = inputValue;
        }
      } else if (inputType === "boolean") {
        processedValue = inputValue.toLowerCase() === "true";
      }

      const result = {
        input_id: `inp_${Date.now()}`,
        name: inputName,
        value: processedValue,
        original_value: inputValue,
        type: inputType,
        validation: validation,
        valid: validation === "none" || validateInput(inputValue),
        length: String(inputValue).length,
        word_count: String(inputValue)
          .split(/\s+/)
          .filter((w) => w.length > 0).length,
        created_at: new Date().toISOString(),
        message: "Input processed successfully",
      };

      setInputResult(result);
      alert(
        `✅ Input processed!\nType: ${inputType}\nValid: ${
          result.valid ? "Yes" : "No"
        }`
      );
    } catch (error) {
      alert(`❌ Failed to process input: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyInput = () => {
    navigator.clipboard.writeText(inputValue);
    alert("Input value copied to clipboard!");
  };

  const loadSampleData = (sampleType: string) => {
    const samples = {
      text: "Hello, this is sample text input for testing.",
      email: "user@example.com",
      url: "https://example.com",
      phone: "+1234567890",
      number: "42",
      json: '{"name": "John", "age": 30, "active": true}',
      boolean: "true",
      multiline:
        "This is a multiline sample text.\nIt contains multiple lines.\nPerfect for testing larger text inputs.",
    };

    setInputValue(samples[sampleType] || "");
  };

  const inputTypes = [
    { value: "text", label: "📝 Text" },
    { value: "number", label: "🔢 Number" },
    { value: "email", label: "📧 Email" },
    { value: "url", label: "🔗 URL" },
    { value: "phone", label: "📱 Phone" },
    { value: "json", label: "🔧 JSON" },
    { value: "boolean", label: "✅ Boolean" },
  ];

  const validationTypes = [
    { value: "none", label: "No Validation" },
    { value: "email", label: "Email Format" },
    { value: "url", label: "URL Format" },
    { value: "number", label: "Number Format" },
    { value: "phone", label: "Phone Format" },
    { value: "json", label: "JSON Format" },
  ];

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <Terminal className="h-4 w-4 mr-2 text-blue-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Input Type
            </Label>
            <Select value={inputType} onValueChange={setInputType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {inputTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Variable Name
            </Label>
            <Input
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="input"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Placeholder
          </Label>
          <Input
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            placeholder="Enter placeholder text..."
          />
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Input Value
          </Label>
          {multiline ? (
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder || `Enter ${inputType} value...`}
              className="min-h-[80px] text-xs"
            />
          ) : (
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder || `Enter ${inputType} value...`}
              type={inputType === "number" ? "number" : "text"}
            />
          )}
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Validation
          </Label>
          <Select value={validation} onValueChange={setValidation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {validationTypes.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Required</Label>
          <Switch checked={required} onCheckedChange={setRequired} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Multiline</Label>
          <Switch checked={multiline} onCheckedChange={setMultiline} />
        </div>

        {inputResult && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">Input Status:</span>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-xs text-green-300/70 space-y-1">
              <div>Name: {inputResult.name}</div>
              <div>Type: {inputResult.type}</div>
              <div>Valid: {inputResult.valid ? "✅ Yes" : "❌ No"}</div>
              <div>Length: {inputResult.length} chars</div>
              {inputResult.word_count > 0 && (
                <div>Words: {inputResult.word_count}</div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={testInput}
            size="sm"
            className="flex-1"
            disabled={isProcessing}
          >
            <Zap className="h-3 w-3 mr-1" />
            {isProcessing ? "Processing..." : "Test Input"}
          </Button>
          <Button onClick={copyInput} size="sm" variant="outline">
            <Copy className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          <Button
            onClick={() => loadSampleData(inputType)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Load Sample
          </Button>
          <Button
            onClick={() => setInputValue("")}
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
          {inputType}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {inputName}
        </Badge>
        {validation !== "none" && (
          <Badge
            variant="outline"
            className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30 text-xs"
          >
            {validation}
          </Badge>
        )}
        {required && (
          <Badge
            variant="outline"
            className="bg-red-600/20 text-red-400 border-red-600/30 text-xs"
          >
            Required
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
            ? "✓ Input Processed"
            : data.executionStatus === "error"
            ? "✗ Processing Error"
            : "⟳ Processing"}
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

export default InputNode;
