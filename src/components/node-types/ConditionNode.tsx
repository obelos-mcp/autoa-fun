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
  GitBranch,
  Settings,
  Play,
  CheckCircle,
  Copy,
  Filter,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";

const ConditionNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [conditionType, setConditionType] = useState(
    data.conditionType || "simple"
  );
  const [leftValue, setLeftValue] = useState(data.leftValue || "");
  const [operator, setOperator] = useState(data.operator || "equals");
  const [rightValue, setRightValue] = useState(data.rightValue || "");
  const [customCondition, setCustomCondition] = useState(
    data.customCondition || data.content || ""
  );
  const [caseSensitive, setCaseSensitive] = useState(
    data.caseSensitive !== false
  );
  const [strictMode, setStrictMode] = useState(data.strictMode || false);
  const [conditionResult, setConditionResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState<boolean | null>(null);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  conditionType,
                  leftValue,
                  operator,
                  rightValue,
                  customCondition,
                  caseSensitive,
                  strictMode,
                  content: customCondition, // Keep backward compatibility
                  configured: Boolean(
                    (conditionType === "simple" && leftValue && rightValue) ||
                      (conditionType === "custom" && customCondition)
                  ),
                },
              }
            : node
        )
      );
    }
  }, [
    conditionType,
    leftValue,
    operator,
    rightValue,
    customCondition,
    caseSensitive,
    strictMode,
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

  const evaluateCondition = (left: any, op: string, right: any): boolean => {
    // Convert values based on type detection
    const convertValue = (val: string) => {
      if (val === "true") return true;
      if (val === "false") return false;
      if (val === "null") return null;
      if (val === "undefined") return undefined;
      if (!isNaN(Number(val)) && val.trim() !== "") return Number(val);
      return caseSensitive ? val : val.toLowerCase();
    };

    const leftVal = convertValue(left);
    const rightVal = convertValue(right);

    switch (op) {
      case "equals":
        return strictMode ? leftVal === rightVal : leftVal == rightVal;
      case "not_equals":
        return strictMode ? leftVal !== rightVal : leftVal != rightVal;
      case "greater_than":
        return leftVal > rightVal;
      case "less_than":
        return leftVal < rightVal;
      case "greater_equal":
        return leftVal >= rightVal;
      case "less_equal":
        return leftVal <= rightVal;
      case "contains":
        return String(leftVal).includes(String(rightVal));
      case "not_contains":
        return !String(leftVal).includes(String(rightVal));
      case "starts_with":
        return String(leftVal).startsWith(String(rightVal));
      case "ends_with":
        return String(leftVal).endsWith(String(rightVal));
      case "regex":
        try {
          const regex = new RegExp(String(rightVal), caseSensitive ? "" : "i");
          return regex.test(String(leftVal));
        } catch {
          return false;
        }
      case "is_empty":
        return (
          !leftVal ||
          leftVal === "" ||
          leftVal === null ||
          leftVal === undefined
        );
      case "is_not_empty":
        return (
          leftVal && leftVal !== "" && leftVal !== null && leftVal !== undefined
        );
      default:
        return false;
    }
  };

  const evaluateCustomCondition = (condition: string): boolean => {
    try {
      // Simple and safe evaluation for demo purposes
      // In production, use a proper expression evaluator
      const safeCondition = condition
        .replace(/\band\b/gi, "&&")
        .replace(/\bor\b/gi, "||")
        .replace(/\bnot\b/gi, "!")
        .replace(/\btrue\b/gi, "true")
        .replace(/\bfalse\b/gi, "false");

      // For demo, evaluate simple conditions
      if (safeCondition.includes("input")) {
        return true; // Simulate input exists
      }
      if (safeCondition.includes("length")) {
        return Math.random() > 0.5; // Random result for demo
      }
      if (safeCondition === "true") return true;
      if (safeCondition === "false") return false;

      return Boolean(eval(safeCondition));
    } catch {
      return false;
    }
  };

  const testCondition = async () => {
    if (conditionType === "simple" && (!leftValue || !rightValue)) {
      alert("Please fill in both left and right values for comparison");
      return;
    }

    if (conditionType === "custom" && !customCondition) {
      alert("Please enter a custom condition");
      return;
    }

    setIsEvaluating(true);

    try {
      // Simulate condition evaluation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let result: boolean;
      let evaluationDetails: any;

      if (conditionType === "simple") {
        result = evaluateCondition(leftValue, operator, rightValue);
        evaluationDetails = {
          type: "simple",
          left_value: leftValue,
          operator: operator,
          right_value: rightValue,
          case_sensitive: caseSensitive,
          strict_mode: strictMode,
        };
      } else {
        result = evaluateCustomCondition(customCondition);
        evaluationDetails = {
          type: "custom",
          condition: customCondition,
          parsed_condition: customCondition,
        };
      }

      const conditionEvaluation = {
        condition_id: `cond_${Date.now()}`,
        result: result,
        evaluation: evaluationDetails,
        evaluated_at: new Date().toISOString(),
        execution_time: "0.001s",
        message: `Condition evaluated to ${result}`,
      };

      setConditionResult(conditionEvaluation);
      setLastEvaluation(result);
      alert(`✅ Condition evaluated!\nResult: ${result ? "TRUE" : "FALSE"}`);
    } catch (error) {
      alert(`❌ Condition evaluation failed: ${error.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const copyCondition = () => {
    const conditionText =
      conditionType === "simple"
        ? `${leftValue} ${operator} ${rightValue}`
        : customCondition;
    navigator.clipboard.writeText(conditionText);
    alert("Condition copied to clipboard!");
  };

  const loadTemplate = (templateType: string) => {
    const templates = {
      simple_text: {
        leftValue: "Hello World",
        operator: "contains",
        rightValue: "World",
      },
      simple_number: {
        leftValue: "42",
        operator: "greater_than",
        rightValue: "10",
      },
      simple_boolean: {
        leftValue: "true",
        operator: "equals",
        rightValue: "true",
      },
      custom_input: "input && input.length > 0",
      custom_data: "data.status === 'active' && data.count > 5",
      custom_complex:
        "(input.type === 'user' || input.type === 'admin') && input.verified === true",
    };

    if (templateType.startsWith("simple_")) {
      setConditionType("simple");
      const template = templates[templateType];
      setLeftValue(template.leftValue);
      setOperator(template.operator);
      setRightValue(template.rightValue);
    } else {
      setConditionType("custom");
      setCustomCondition(templates[templateType] || "");
    }
  };

  const conditionTypes = [
    { value: "simple", label: "🔧 Simple Comparison" },
    { value: "custom", label: "⚙️ Custom Expression" },
  ];

  const operators = [
    { value: "equals", label: "= Equals", symbol: "=" },
    { value: "not_equals", label: "≠ Not Equals", symbol: "≠" },
    { value: "greater_than", label: "> Greater Than", symbol: ">" },
    { value: "less_than", label: "< Less Than", symbol: "<" },
    { value: "greater_equal", label: "≥ Greater or Equal", symbol: "≥" },
    { value: "less_equal", label: "≤ Less or Equal", symbol: "≤" },
    { value: "contains", label: "📝 Contains", symbol: "∋" },
    { value: "not_contains", label: "📝 Not Contains", symbol: "∌" },
    { value: "starts_with", label: "🔤 Starts With", symbol: "^" },
    { value: "ends_with", label: "🔤 Ends With", symbol: "$" },
    { value: "regex", label: "🔍 Regex Match", symbol: "~" },
    { value: "is_empty", label: "∅ Is Empty", symbol: "∅" },
    { value: "is_not_empty", label: "∃ Is Not Empty", symbol: "∃" },
  ];

  const getOperatorSymbol = (op: string) => {
    const operator = operators.find((o) => o.value === op);
    return operator?.symbol || "=";
  };

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <GitBranch className="h-4 w-4 mr-2 text-yellow-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Condition Type
          </Label>
          <Select value={conditionType} onValueChange={setConditionType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {conditionTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {conditionType === "simple" ? (
          <>
            <div>
              <Label className="text-sm text-green-300 mb-1 block">
                Left Value
              </Label>
              <Input
                value={leftValue}
                onChange={(e) => setLeftValue(e.target.value)}
                placeholder="Enter left value..."
              />
            </div>

            <div>
              <Label className="text-sm text-green-300 mb-1 block">
                Operator
              </Label>
              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!["is_empty", "is_not_empty"].includes(operator) && (
              <div>
                <Label className="text-sm text-green-300 mb-1 block">
                  Right Value
                </Label>
                <Input
                  value={rightValue}
                  onChange={(e) => setRightValue(e.target.value)}
                  placeholder="Enter right value..."
                />
              </div>
            )}
          </>
        ) : (
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Custom Condition
            </Label>
            <Textarea
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              placeholder="e.g., input.length > 0 && input.type === 'user'"
              className="min-h-[80px] text-xs font-mono"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Case Sensitive</Label>
          <Switch checked={caseSensitive} onCheckedChange={setCaseSensitive} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Strict Mode</Label>
          <Switch checked={strictMode} onCheckedChange={setStrictMode} />
        </div>

        {conditionResult && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">Evaluation Result:</span>
              <div className="flex items-center gap-2">
                {conditionResult.result ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <X className="h-4 w-4 text-red-400" />
                )}
                <Badge
                  variant={conditionResult.result ? "default" : "destructive"}
                  className="text-xs"
                >
                  {conditionResult.result ? "TRUE" : "FALSE"}
                </Badge>
              </div>
            </div>
            <div className="text-xs text-green-300/70 space-y-1">
              <div>ID: {conditionResult.condition_id}</div>
              <div>Type: {conditionResult.evaluation.type}</div>
              <div>Time: {conditionResult.execution_time}</div>
              <div>
                Evaluated:{" "}
                {new Date(conditionResult.evaluated_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={testCondition}
            size="sm"
            className="flex-1"
            disabled={isEvaluating}
          >
            <Play className="h-3 w-3 mr-1" />
            {isEvaluating ? "Evaluating..." : "Test Condition"}
          </Button>
          <Button onClick={copyCondition} size="sm" variant="outline">
            <Copy className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          <Button
            onClick={() => loadTemplate("simple_text")}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Text Example
          </Button>
          <Button
            onClick={() => loadTemplate("simple_number")}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Number Example
          </Button>
          <Button
            onClick={() => loadTemplate("custom_input")}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Custom Example
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {conditionType}
        </Badge>
        {conditionType === "simple" && (
          <Badge variant="outline" className="matrix-badge text-xs">
            {getOperatorSymbol(operator)}
          </Badge>
        )}
        {caseSensitive && (
          <Badge
            variant="outline"
            className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs"
          >
            Case Sensitive
          </Badge>
        )}
        {strictMode && (
          <Badge
            variant="outline"
            className="bg-purple-600/20 text-purple-400 border-purple-600/30 text-xs"
          >
            Strict
          </Badge>
        )}
        {lastEvaluation !== null && (
          <Badge
            variant={lastEvaluation ? "default" : "destructive"}
            className="text-xs"
          >
            Last: {lastEvaluation ? "TRUE" : "FALSE"}
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
            ? "✓ Condition Evaluated"
            : data.executionStatus === "error"
            ? "✗ Evaluation Error"
            : "⟳ Evaluating"}
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
        id="true"
        style={{ bottom: 0, left: "25%" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ bottom: 0, right: "25%" }}
      />

      {/* Labels for the output handles */}
      <div className="absolute bottom-[-20px] left-[25%] transform -translate-x-1/2">
        <div className="text-xs text-green-400 font-mono">TRUE</div>
      </div>
      <div className="absolute bottom-[-20px] right-[25%] transform translate-x-1/2">
        <div className="text-xs text-red-400 font-mono">FALSE</div>
      </div>
    </div>
  );
};

export default ConditionNode;
