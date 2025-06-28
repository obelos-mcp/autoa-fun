import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  XCircle,
  Save,
  Play,
  Trash2,
  Plus,
  Minus,
  Settings,
  MessageSquare,
  Bot,
  Workflow,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import WebhookConfigPanel from "./WebhookConfigPanel";
import CustomCommandsConfig from "./CustomCommandsConfig";
import { AIService } from "@/services/aiService";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";

interface NodePanelProps {
  node: any;
  setNodes: any;
  onClose?: () => void;
}

const NodePanel = ({ node, setNodes, onClose }: NodePanelProps) => {
  const [config, setConfig] = useState<any>({});
  const [aiConfig, setAiConfig] = useState<any>({
    provider: "OpenAI",
    model: "gpt-4o-mini",
    apiKey: "",
    temperature: 0.7,
    maxTokens: 1000,
    instructions: "Provide a helpful and concise response to the user's question.",
  });

  // YouTube-specific states
  const [youtubeConfig, setYoutubeConfig] = useState<any>({
    useRealAPI: false,
    youtubeApiKey: "",
  });

  // Wallet Analyzer-specific states
  const [walletInputConfig, setWalletInputConfig] = useState<any>({
    walletAddress: "",
    blockchain: "ethereum",
    validateAddress: true,
  });

  const [transactionFetcherConfig, setTransactionFetcherConfig] = useState<any>({
    apiProvider: "etherscan",
    apiKey: "",
    transactionLimit: 1000,
    dateRange: "last_30_days",
    includeTokens: true,
    includeNFTs: true,
    includeInternalTxns: false,
  });

  const [walletAnalyticsConfig, setWalletAnalyticsConfig] = useState<any>({
    analysisType: "comprehensive",
    generateCharts: true,
    includePatterns: true,
    riskAssessment: true,
    portfolioAnalysis: true,
    timeframe: "all_time",
  });

  const [walletReportConfig, setWalletReportConfig] = useState<any>({
    reportFormat: "comprehensive",
    includeCharts: true,
    includeTransactionList: true,
    includeSummary: true,
    includeAnalytics: true,
    watermark: true,
    fileName: "wallet_report",
  });

  // Telegram-specific states
  const [telegramCondition, setTelegramCondition] = useState({
    type: "text_contains",
    value: "",
    caseSensitive: false,
  });
  const [telegramInput, setTelegramInput] = useState({
    inputType: "text",
    required: true,
    minLength: 1,
    maxLength: 4000,
    stripHtml: true,
    trimWhitespace: true,
  });
  const [telegramData, setTelegramData] = useState({
    extractUserData: true,
    userFields: ["user_id", "username", "first_name", "chat_id"],
    storeMessage: true,
    storage: "memory",
  });
  const [telegramResponse, setTelegramResponse] = useState({
    responseType: "text",
    parseMode: "Markdown",
    disableWebPagePreview: false,
    keyboardType: "inline",
    buttons: [
      {
        text: "Help",
        callback_data: "help",
      },
    ],
  });
  const [activeTab, setActiveTab] = useState("properties");
  const [testInput, setTestInput] = useState("");
  const [isProcessingTest, setIsProcessingTest] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (node) {
      setConfig({
        label: node.data?.label || "",
        description: node.data?.description || "",
        content: node.data?.content || "",
        inputName: node.data?.inputName || "",
        outputName: node.data?.outputName || "",
      });

      // Parse existing content for Telegram nodes
      if (node.data?.content) {
        try {
          const parsedContent = JSON.parse(node.data.content);
          switch (node.type) {
            case "telegramcondition":
              setTelegramCondition({
                type: parsedContent.type || "text_contains",
                value: parsedContent.value || "",
                caseSensitive: parsedContent.caseSensitive || false,
              });
              break;
            case "telegramuserinput":
              setTelegramInput({
                inputType: parsedContent.inputType || "text",
                required: parsedContent.validation?.required || true,
                minLength: parsedContent.validation?.minLength || 1,
                maxLength: parsedContent.validation?.maxLength || 4000,
                stripHtml: parsedContent.sanitization?.stripHtml || true,
                trimWhitespace:
                  parsedContent.sanitization?.trimWhitespace || true,
              });
              break;
            case "telegramdata":
              setTelegramData({
                extractUserData:
                  parsedContent.operations?.some(
                    (op: any) => op.type === "extract_user_data"
                  ) || true,
                userFields: parsedContent.operations?.find(
                  (op: any) => op.type === "extract_user_data"
                )?.fields || ["user_id", "username", "first_name", "chat_id"],
                storeMessage:
                  parsedContent.operations?.some(
                    (op: any) => op.type === "store_message"
                  ) || true,
                storage:
                  parsedContent.operations?.find(
                    (op: any) => op.type === "store_message"
                  )?.storage || "memory",
              });
              break;
            case "telegramresponse":
              setTelegramResponse({
                responseType: parsedContent.responseType || "text",
                parseMode: parsedContent.formatting?.parse_mode || "Markdown",
                disableWebPagePreview:
                  parsedContent.formatting?.disable_web_page_preview || false,
                keyboardType: parsedContent.keyboard?.type || "inline",
                buttons: parsedContent.keyboard?.buttons?.flat() || [
                  {
                    text: "Help",
                    callback_data: "help",
                  },
                ],
              });
              break;
          }
        } catch (e) {
          console.log("Failed to parse node content:", e);
        }
      }

      // Parse YouTube config if it's a YouTube input node
      if (node.type === "youtubeinput") {
        setYoutubeConfig({
          useRealAPI: node.data?.useRealAPI || false,
          youtubeApiKey: node.data?.youtubeApiKey || "",
        });
      }

      // Parse AI config if it's an AI model node
      if (node.type === "aimodel" && node.data?.content) {
        try {
          const parsedConfig = JSON.parse(node.data.content);
          setAiConfig({
            provider: parsedConfig.provider || "OpenAI",
            model: parsedConfig.model || "gpt-4o-mini",
            apiKey: parsedConfig.apiKey || "",
            temperature: parsedConfig.temperature || 0.7,
            maxTokens: parsedConfig.maxTokens || 1000,
            instructions: parsedConfig.instructions || "Provide a helpful and concise response to the user's question.",
          });
        } catch (e) {
          // Reset to defaults if parsing fails
          setAiConfig({
            provider: "OpenAI",
            model: "gpt-4o-mini",
            apiKey: "",
            temperature: 0.7,
            maxTokens: 1000,
            instructions: "Provide a helpful and concise response to the user's question.",
          });
        }
      }

      // Reset test input and result when node changes
      setTestInput("");
      setTestResult(null);
    }
  }, [node]);

  const deleteNode = () => {
    if (!node) return;
    setNodes((nds: any[]) => nds.filter((n) => n.id !== node.id));
    toast({
      title: "Node deleted",
      description: "The node has been removed from your flow",
    });
    onClose?.();
  };

  const updateNode = () => {
    if (!node) return;
    let finalContent = config.content;

    // For AI model nodes, build JSON from separate fields
    if (node.type === "aimodel") {
      finalContent = JSON.stringify(aiConfig, null, 2);
      
      // Also store individual fields in node data for backward compatibility
      setNodes((nds: any[]) =>
        nds.map((n) =>
          n.id === node.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  label: config.label,
                  description: config.description,
                  content: finalContent,
                  // Store individual AI config fields
                  provider: aiConfig.provider,
                  model: aiConfig.model,
                  apiKey: aiConfig.apiKey,
                  temperature: aiConfig.temperature,
                  maxTokens: aiConfig.maxTokens,
                  instructions: aiConfig.instructions,
                },
              }
            : n
        )
      );
      toast({
        title: "Node updated",
        description: "AI model configuration has been saved",
      });
      return;
    }

    // For YouTube input nodes, store configuration in node data
    if (node.type === "youtubeinput") {
      setNodes((nds: any[]) =>
        nds.map((n) =>
          n.id === node.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  label: config.label,
                  description: config.description,
                  content: config.content,
                  useRealAPI: youtubeConfig.useRealAPI,
                  youtubeApiKey: youtubeConfig.youtubeApiKey,
                },
              }
            : n
        )
      );
      toast({
        title: "Node updated",
        description: "YouTube input configuration has been saved",
      });
      return;
    }

    // For Telegram nodes, build JSON from form fields
    if (node.type === "telegramcondition") {
      finalContent = JSON.stringify(
        {
          type: telegramCondition.type,
          value: telegramCondition.value,
          caseSensitive: telegramCondition.caseSensitive,
        },
        null,
        2
      );
    }
    if (node.type === "telegramuserinput") {
      finalContent = JSON.stringify(
        {
          inputType: telegramInput.inputType,
          validation: {
            required: telegramInput.required,
            minLength: telegramInput.minLength,
            maxLength: telegramInput.maxLength,
          },
          sanitization: {
            stripHtml: telegramInput.stripHtml,
            trimWhitespace: telegramInput.trimWhitespace,
          },
        },
        null,
        2
      );
    }
    if (node.type === "telegramdata") {
      const operations = [];
      if (telegramData.extractUserData) {
        operations.push({
          type: "extract_user_data",
          fields: telegramData.userFields,
        });
      }
      if (telegramData.storeMessage) {
        operations.push({
          type: "store_message",
          storage: telegramData.storage,
        });
      }
      finalContent = JSON.stringify(
        {
          operations,
        },
        null,
        2
      );
    }
    if (node.type === "telegramresponse") {
      finalContent = JSON.stringify(
        {
          responseType: telegramResponse.responseType,
          formatting: {
            parse_mode: telegramResponse.parseMode,
            disable_web_page_preview: telegramResponse.disableWebPagePreview,
          },
          keyboard: {
            type: telegramResponse.keyboardType,
            buttons: [telegramResponse.buttons],
          },
        },
        null,
        2
      );
    }
    setNodes((nds: any[]) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              label: config.label,
              description: config.description,
              content: finalContent,
              inputName: config.inputName,
              outputName: config.outputName,
            },
          };
        }
        return n;
      })
    );
    toast({
      title: "Node updated",
      description: "Your changes have been applied",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value,
    });
  };

  const handleAiConfigChange = (field: string, value: any) => {
    setAiConfig({
      ...aiConfig,
      [field]: value,
    });
  };

  const handleYoutubeConfigChange = (field: string, value: any) => {
    setYoutubeConfig({ ...youtubeConfig, [field]: value });
  };

  const addButton = () => {
    setTelegramResponse({
      ...telegramResponse,
      buttons: [
        ...telegramResponse.buttons,
        {
          text: "",
          callback_data: "",
        },
      ],
    });
  };

  const removeButton = (index: number) => {
    setTelegramResponse({
      ...telegramResponse,
      buttons: telegramResponse.buttons.filter(
        (_: any, i: number) => i !== index
      ),
    });
  };

  const updateButton = (index: number, field: string, value: string) => {
    const newButtons = [...telegramResponse.buttons];
    newButtons[index] = {
      ...newButtons[index],
      [field]: value,
    };
    setTelegramResponse({
      ...telegramResponse,
      buttons: newButtons,
    });
  };

  const getNodeColor = () => {
    return "from-green-700 to-green-900";
  };

  const getNodeIcon = () => {
    // A simplified version, assuming you have a mapping
    switch (node?.type) {
      case "system":
      case "input":
      case "output":
      case "action":
      case "api":
      case "aimodel":
      case "vectorstore":
      case "webhook":
      case "memory":
      case "tool":
      case "telegramcondition":
      case "telegramuserinput":
      case "telegramdata":
      case "telegramresponse":
      default:
        return <Workflow size={18} />;
    }
  };

  const closePanel = () => {
    if (onClose) {
      onClose();
    }
  };

  const validateNodeConfig = () => {
    if (["api", "webhook"].includes(node.type)) {
      try {
        const parsedConfig = JSON.parse(config.content || "{}");
        if (!parsedConfig.url || parsedConfig.url.trim() === "") {
          toast({
            title: "Invalid configuration",
            description: "URL is required",
            variant: "destructive",
          });
          return false;
        }
        return true;
      } catch (error) {
        toast({
          title: "Invalid configuration",
          description: "The configuration is not valid JSON",
          variant: "destructive",
        });
        return false;
      }
    }
    if (node.type === "aimodel") {
      if (!aiConfig.provider || !aiConfig.apiKey) {
        toast({
          title: "Invalid AI model configuration",
          description: "Provider and API key are required",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }
    return true;
  };

  const testNode = async () => {
    if (!node) return;
    if (!validateNodeConfig()) {
      return;
    }
    setIsProcessingTest(true);
    setTestResult(null);

    // Set node to processing state
    setNodes((nds: any[]) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              executionStatus: "processing",
              testInput: testInput,
            },
            style: {
              ...n.style,
              boxShadow: "0 0 0 2px #7c3aed, 0 0 20px #7c3aed",
            },
          };
        }
        return n;
      })
    );
    try {
      let result;

      // For AI model nodes, call the actual AI service
      if (node.type === "aimodel") {
        const systemPrompt = "You are a helpful AI assistant.";
        result = await AIService.callAI(
          aiConfig,
          systemPrompt,
          testInput || "Hello, this is a test message."
        );
      } else {
        // For other node types, use mock results
        result = generateMockResult(node.type, testInput);
      }
      setTestResult(result);
      setNodes((nds: any[]) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: {
                ...n.data,
                executionStatus: "completed",
                executionResult: result,
              },
              style: {
                ...n.style,
                boxShadow: "0 0 0 2px #10b981, 0 0 10px #10b981",
              },
            };
          }
          return n;
        })
      );
      toast({
        title: "Test successful",
        description: `Node ${node.data.label} tested successfully`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setTestResult({
        error: errorMessage,
      });
      setNodes((nds: any[]) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: {
                ...n.data,
                executionStatus: "error",
                executionError: errorMessage,
              },
              style: {
                ...n.style,
                boxShadow: "0 0 0 2px #ef4444, 0 0 10px #ef4444",
              },
            };
          }
          return n;
        })
      );
      toast({
        title: "Test failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessingTest(false);
    }
  };

  // Generate mock result based on node type and input
  const generateMockResult = (type: string, input: string) => {
    switch (type) {
      case "system":
        return {
          systemPrompt: input || config.content || "Default system prompt",
          config: {
            temperature: 0.7,
            model: "gpt-4o",
          },
        };
      case "input":
        return {
          userInput: input || "Test input",
          message: `Sample input from ${config.inputName || "User"}`,
        };
      case "action":
        if (!config.content) {
          throw new Error("Action code is required");
        }
        return {
          action: "execute_code",
          result: `Action executed with input: ${input || "default"}`,
        };
      case "api":
        try {
          const apiConfig = JSON.parse(config.content || "{}");
          if (!apiConfig.url) {
            throw new Error("API URL is required");
          }
          return {
            endpoint: apiConfig.url,
            method: apiConfig.method || "GET",
            responseStatus: 200,
            data: {
              success: true,
              message: input
                ? `API response for: ${input}`
                : "API response simulation",
              timestamp: new Date().toISOString(),
            },
          };
        } catch (error) {
          throw new Error(
            `Invalid API configuration: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      case "aimodel":
        return {
          provider: aiConfig.provider,
          model: aiConfig.model,
          response: `AI model response to: ${input || "test input"}`,
          usage: {
            tokens: 150,
            cost: 0.002,
          },
        };
      case "vectorstore":
        try {
          const vectorConfig = JSON.parse(config.content || "{}");
          return {
            provider: vectorConfig.provider || "Custom",
            dimensions: vectorConfig.dimensions || 1536,
            status: "connected",
            operation: input
              ? `Searched for: ${input}`
              : "Connection test successful",
          };
        } catch (error) {
          return {
            provider: "Default",
            status: "connected",
            operation: "Test successful",
          };
        }
      case "webhook":
        try {
          const webhookConfig = JSON.parse(config.content || "{}");
          if (!webhookConfig.url) {
            throw new Error("Webhook URL is required");
          }
          return {
            url: webhookConfig.url,
            method: webhookConfig.method || "POST",
            status: "sent",
            response: {
              success: true,
              timestamp: new Date().toISOString(),
            },
          };
        } catch (error) {
          throw new Error(
            `Invalid webhook configuration: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      case "memory":
        try {
          const memoryConfig = JSON.parse(config.content || "{}");
          return {
            type: memoryConfig.type || "buffer",
            stored: input || "test data",
            tokens: 50,
            status: "stored",
          };
        } catch (error) {
          return {
            type: "buffer",
            stored: input || "test data",
            status: "stored",
          };
        }
      case "tool":
        try {
          const toolConfig = JSON.parse(config.content || "{}");
          return {
            name: toolConfig.name || "custom_tool",
            type: toolConfig.type || "function",
            result: `Tool executed with input: ${input || "test"}`,
            status: "success",
          };
        } catch (error) {
          return {
            name: "custom_tool",
            result: `Tool executed with input: ${input || "test"}`,
            status: "success",
          };
        }
      case "output":
        return {
          generatedResponse: input || "This is a simulated AI response.",
          metadata: {
            timestamp: new Date().toISOString(),
            model: "gpt-4o",
          },
        };
      default:
        return {
          type,
          processed: true,
        };
    }
  };

  const getNodeConfigTemplate = () => {
    switch (node?.type) {
      case "vectorstore":
        return JSON.stringify(
          {
            provider: "Pinecone",
            dimensions: 1536,
            metric: "cosine",
            apiKey: "your-api-key",
          },
          null,
          2
        );
      case "webhook":
        return JSON.stringify(
          {
            url: "https://your-webhook-url.com",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
          null,
          2
        );
      case "memory":
        return JSON.stringify(
          {
            type: "buffer",
            maxTokens: 2000,
            returnMessages: true,
          },
          null,
          2
        );
      case "tool":
        return JSON.stringify(
          {
            name: "web_search",
            type: "function",
            description: "Search the web for information",
          },
          null,
          2
        );
      case "api":
        return JSON.stringify(
          {
            url: "https://api.example.com",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
          null,
          2
        );
      default:
        return "";
    }
  };

  const renderCustomFields = () => {
    switch (node?.type) {
      case "telegramcondition":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="conditionType" className="text-muted-foreground">
                Condition Type
              </Label>
              <Select
                value={telegramCondition.type}
                onValueChange={(value) =>
                  setTelegramCondition({
                    ...telegramCondition,
                    type: value,
                  })
                }
              >
                <SelectTrigger className="bg-muted/30 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text_contains">Text Contains</SelectItem>
                  <SelectItem value="command">Command</SelectItem>
                  <SelectItem value="user_role">User Role</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                  <SelectItem value="message_count">Message Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="conditionValue" className="text-muted-foreground">
                Condition Value
              </Label>
              <Input
                id="conditionValue"
                value={telegramCondition.value}
                onChange={(e) =>
                  setTelegramCondition({
                    ...telegramCondition,
                    value: e.target.value,
                  })
                }
                placeholder="Enter condition value (e.g., '/start' for commands)"
                className="bg-muted/30 border-border"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="caseSensitive"
                checked={telegramCondition.caseSensitive}
                onCheckedChange={(checked) =>
                  setTelegramCondition({
                    ...telegramCondition,
                    caseSensitive: checked,
                  })
                }
              />
              <Label htmlFor="caseSensitive" className="text-muted-foreground">
                Case Sensitive
              </Label>
            </div>
          </div>
        );
      case "telegramuserinput":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="inputType" className="text-muted-foreground">
                Input Type
              </Label>
              <Select
                value={telegramInput.inputType}
                onValueChange={(value) =>
                  setTelegramInput({
                    ...telegramInput,
                    inputType: value,
                  })
                }
              >
                <SelectTrigger className="bg-muted/30 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={telegramInput.required}
                onCheckedChange={(checked) =>
                  setTelegramInput({
                    ...telegramInput,
                    required: checked,
                  })
                }
              />
              <Label htmlFor="required" className="text-muted-foreground">
                Required Input
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minLength" className="text-muted-foreground">
                  Min Length
                </Label>
                <Input
                  id="minLength"
                  type="number"
                  value={telegramInput.minLength}
                  onChange={(e) =>
                    setTelegramInput({
                      ...telegramInput,
                      minLength: parseInt(e.target.value),
                    })
                  }
                  className="bg-muted/30 border-border"
                />
              </div>
              <div>
                <Label htmlFor="maxLength" className="text-muted-foreground">
                  Max Length
                </Label>
                <Input
                  id="maxLength"
                  type="number"
                  value={telegramInput.maxLength}
                  onChange={(e) =>
                    setTelegramInput({
                      ...telegramInput,
                      maxLength: parseInt(e.target.value),
                    })
                  }
                  className="bg-muted/30 border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="stripHtml"
                  checked={telegramInput.stripHtml}
                  onCheckedChange={(checked) =>
                    setTelegramInput({
                      ...telegramInput,
                      stripHtml: checked,
                    })
                  }
                />
                <Label htmlFor="stripHtml" className="text-muted-foreground">
                  Strip HTML
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="trimWhitespace"
                  checked={telegramInput.trimWhitespace}
                  onCheckedChange={(checked) =>
                    setTelegramInput({
                      ...telegramInput,
                      trimWhitespace: checked,
                    })
                  }
                />
                <Label
                  htmlFor="trimWhitespace"
                  className="text-muted-foreground"
                >
                  Trim Whitespace
                </Label>
              </div>
            </div>
          </div>
        );
      case "telegramdata":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="extractUserData"
                checked={telegramData.extractUserData}
                onCheckedChange={(checked) =>
                  setTelegramData({
                    ...telegramData,
                    extractUserData: checked,
                  })
                }
              />
              <Label
                htmlFor="extractUserData"
                className="text-muted-foreground"
              >
                Extract User Data
              </Label>
            </div>
            {telegramData.extractUserData && (
              <div>
                <Label className="text-muted-foreground">
                  User Fields to Extract
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "user_id",
                    "username",
                    "first_name",
                    "last_name",
                    "chat_id",
                    "language_code",
                  ].map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Switch
                        checked={telegramData.userFields.includes(field)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTelegramData({
                              ...telegramData,
                              userFields: [...telegramData.userFields, field],
                            });
                          } else {
                            setTelegramData({
                              ...telegramData,
                              userFields: telegramData.userFields.filter(
                                (f) => f !== field
                              ),
                            });
                          }
                        }}
                      />
                      <Label className="text-sm">{field}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="storeMessage"
                checked={telegramData.storeMessage}
                onCheckedChange={(checked) =>
                  setTelegramData({
                    ...telegramData,
                    storeMessage: checked,
                  })
                }
              />
              <Label htmlFor="storeMessage" className="text-muted-foreground">
                Store Message
              </Label>
            </div>
            {telegramData.storeMessage && (
              <div>
                <Label htmlFor="storage" className="text-muted-foreground">
                  Storage Type
                </Label>
                <Select
                  value={telegramData.storage}
                  onValueChange={(value) =>
                    setTelegramData({
                      ...telegramData,
                      storage: value,
                    })
                  }
                >
                  <SelectTrigger className="bg-muted/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="memory">Memory</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );
      case "telegramresponse":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="responseType" className="text-muted-foreground">
                Response Type
              </Label>
              <Select
                value={telegramResponse.responseType}
                onValueChange={(value) =>
                  setTelegramResponse({
                    ...telegramResponse,
                    responseType: value,
                  })
                }
              >
                <SelectTrigger className="bg-muted/30 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="parseMode" className="text-muted-foreground">
                Parse Mode
              </Label>
              <Select
                value={telegramResponse.parseMode}
                onValueChange={(value) =>
                  setTelegramResponse({
                    ...telegramResponse,
                    parseMode: value,
                  })
                }
              >
                <SelectTrigger className="bg-muted/30 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Markdown">Markdown</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="disableWebPagePreview"
                checked={telegramResponse.disableWebPagePreview}
                onCheckedChange={(checked) =>
                  setTelegramResponse({
                    ...telegramResponse,
                    disableWebPagePreview: checked,
                  })
                }
              />
              <Label
                htmlFor="disableWebPagePreview"
                className="text-muted-foreground"
              >
                Disable Web Page Preview
              </Label>
            </div>
            <div>
              <Label htmlFor="keyboardType" className="text-muted-foreground">
                Keyboard Type
              </Label>
              <Select
                value={telegramResponse.keyboardType}
                onValueChange={(value) =>
                  setTelegramResponse({
                    ...telegramResponse,
                    keyboardType: value,
                  })
                }
              >
                <SelectTrigger className="bg-muted/30 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inline">Inline</SelectItem>
                  <SelectItem value="reply">Reply</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {telegramResponse.keyboardType !== "none" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-muted-foreground">
                    Keyboard Buttons
                  </Label>
                  <Button size="sm" onClick={addButton} className="h-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {telegramResponse.buttons.map(
                    (button: any, index: number) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Button text"
                          value={button.text}
                          onChange={(e) =>
                            updateButton(index, "text", e.target.value)
                          }
                          className="bg-muted/30 border-border"
                        />
                        <Input
                          placeholder="Callback data"
                          value={button.callback_data}
                          onChange={(e) =>
                            updateButton(index, "callback_data", e.target.value)
                          }
                          className="bg-muted/30 border-border"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeButton(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case "system":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="content" className="text-muted-foreground">
                System Prompt
              </Label>
              <Textarea
                id="content"
                name="content"
                value={config.content || ""}
                onChange={handleChange}
                placeholder="Enter system instructions..."
                className="h-40 bg-muted/30 border-border font-mono"
              />
            </div>
          </>
        );
      case "input":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="inputName" className="text-muted-foreground">
                Input Variable Name
              </Label>
              <Input
                id="inputName"
                name="inputName"
                value={config.inputName || ""}
                onChange={handleChange}
                placeholder="e.g. userMessage"
                className="bg-muted/30 border-border"
              />
            </div>
          </>
        );
      case "output":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="outputName" className="text-muted-foreground">
                Output Variable Name
              </Label>
              <Input
                id="outputName"
                name="outputName"
                value={config.outputName || ""}
                onChange={handleChange}
                placeholder="e.g. aiResponse"
                className="bg-muted/30 border-border"
              />
            </div>
          </>
        );
      case "action":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="content" className="text-muted-foreground">
                Action Code
              </Label>
              <Textarea
                id="content"
                name="content"
                value={config.content || ""}
                onChange={handleChange}
                placeholder="// JavaScript code for this action"
                className="h-40 font-mono bg-muted/30 border-border"
              />
            </div>
          </>
        );
      case "webhook":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url" className="text-muted-foreground">Webhook URL</Label>
              <Input
                id="webhook-url"
                value={config.content || ""}
                onChange={handleChange}
                placeholder="https://your-webhook-url.com"
                className="bg-background/50 border-border"
              />
            </div>
            <div>
              <Label htmlFor="webhook-method" className="text-muted-foreground">HTTP Method</Label>
              <Select value={config.content || "POST"} onValueChange={(value) => setConfig({ ...config, content: value })}>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="webhook-headers" className="text-muted-foreground">Headers (JSON)</Label>
              <Textarea
                id="webhook-headers"
                value={config.content || '{"Content-Type": "application/json"}'}
                onChange={(e) => setConfig({ ...config, content: e.target.value })}
                placeholder='{"Content-Type": "application/json"}'
                className="bg-background/50 border-border h-20 resize-none"
              />
            </div>
            <WebhookConfigPanel 
              onConfigSelect={(config) => {
                setConfig({ ...config, content: JSON.stringify(config, null, 2) });
              }}
            />
          </div>
        );
      case "customcommands":
        return (
          <div className="space-y-4">
            <CustomCommandsConfig 
              initialConfig={config.content}
              onConfigChange={(newConfig) => {
                setConfig({ ...config, content: newConfig });
              }}
            />
          </div>
        );
      case "aimodel":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="provider" className="text-muted-foreground">
                AI Provider
              </Label>
              <Select
                value={aiConfig.provider}
                onValueChange={(value) =>
                  handleAiConfigChange("provider", value)
                }
              >
                <SelectTrigger className="bg-muted/30 border-border">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="Anthropic">Anthropic (Claude)</SelectItem>
                  <SelectItem value="Custom">Custom API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label htmlFor="model" className="text-muted-foreground">
                Model
              </Label>
              <Select
                value={aiConfig.model}
                onValueChange={(value) => handleAiConfigChange("model", value)}
              >
                <SelectTrigger className="bg-muted/30 border-border">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {aiConfig.provider === "OpenAI" && (
                    <>
                      <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                      <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                    </>
                  )}
                  {aiConfig.provider === "Anthropic" && (
                    <>
                      <SelectItem value="claude-3-5-sonnet-20241022">
                        claude-3-5-sonnet-20241022
                      </SelectItem>
                      <SelectItem value="claude-3-haiku-20240307">
                        claude-3-haiku-20240307
                      </SelectItem>
                      <SelectItem value="claude-3-opus-20240229">
                        claude-3-opus-20240229
                      </SelectItem>
                    </>
                  )}
                  {aiConfig.provider === "Custom" && (
                    <SelectItem value="custom-model">custom-model</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label htmlFor="apiKey" className="text-muted-foreground">
                API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={aiConfig.apiKey}
                onChange={(e) => handleAiConfigChange("apiKey", e.target.value)}
                placeholder="Enter your API key"
                className="bg-muted/30 border-border"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="instructions" className="text-muted-foreground">
                Processing Instructions
              </Label>
              <Textarea
                id="instructions"
                value={aiConfig.instructions}
                onChange={(e) => handleAiConfigChange("instructions", e.target.value)}
                placeholder="e.g., Summarize in 5 bullet points, Create 120-word summary, Extract key insights..."
                className="min-h-[80px] bg-muted/30 border-border"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="temperature" className="text-muted-foreground">
                Temperature
              </Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={aiConfig.temperature}
                onChange={(e) =>
                  handleAiConfigChange(
                    "temperature",
                    parseFloat(e.target.value)
                  )
                }
                className="bg-muted/30 border-border"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="maxTokens" className="text-muted-foreground">
                Max Tokens
              </Label>
              <Input
                id="maxTokens"
                type="number"
                min="1"
                max="8000"
                value={aiConfig.maxTokens}
                onChange={(e) =>
                  handleAiConfigChange("maxTokens", parseInt(e.target.value))
                }
                className="bg-muted/30 border-border"
              />
            </div>
          </>
        );
      case "vectorstore":
      case "memory":
      case "tool":
      case "api":
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="content" className="text-muted-foreground">
                Configuration (JSON)
              </Label>
              <Textarea
                id="content"
                name="content"
                value={
                  config.content ||
                  (node?.type === "vectorstore"
                    ? JSON.stringify(
                        {
                          provider: "Pinecone",
                          dimensions: 1536,
                          metric: "cosine",
                          apiKey: "your-api-key",
                        },
                        null,
                        2
                      )
                    : node?.type === "memory"
                    ? JSON.stringify(
                        {
                          type: "buffer",
                          maxTokens: 2000,
                          returnMessages: true,
                        },
                        null,
                        2
                      )
                    : node?.type === "tool"
                    ? JSON.stringify(
                        {
                          name: "web_search",
                          type: "function",
                          description: "Search the web for information",
                        },
                        null,
                        2
                      )
                    : JSON.stringify(
                        {
                          url: "https://api.example.com",
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        },
                        null,
                        2
                      ))
                }
                onChange={handleChange}
                placeholder="Enter configuration..."
                className="h-40 font-mono bg-muted/30 border-border"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Valid JSON configuration required.
              </p>
            </div>
          </>
        );
      case "youtubeinput":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="youtubeUrl" className="text-muted-foreground">
                YouTube URL
              </Label>
              <Input
                id="youtubeUrl"
                name="content"
                value={config.content || ""}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="bg-muted/30 border-border"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the YouTube video URL to analyze
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="useRealAPI"
                checked={youtubeConfig.useRealAPI}
                onCheckedChange={(checked) =>
                  handleYoutubeConfigChange("useRealAPI", checked)
                }
              />
              <Label htmlFor="useRealAPI" className="text-muted-foreground">
                Use Real YouTube API
              </Label>
            </div>

            {youtubeConfig.useRealAPI && (
              <div>
                <Label htmlFor="youtubeApiKey" className="text-muted-foreground">
                  YouTube Data API Key
                </Label>
                <Input
                  id="youtubeApiKey"
                  type="password"
                  value={youtubeConfig.youtubeApiKey}
                  onChange={(e) =>
                    handleYoutubeConfigChange("youtubeApiKey", e.target.value)
                  }
                  placeholder="Enter your YouTube Data API key"
                  className="bg-muted/30 border-border"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Get it from Google Cloud Console → APIs & Services → Credentials
                </p>
              </div>
            )}

            {youtubeConfig.useRealAPI && (
              <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Real API enabled - will fetch actual video data</span>
              </div>
            )}

            {!youtubeConfig.useRealAPI && (
              <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Demo mode - will use sample data</span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderTestingTab = () => {
    return (
      <div className={isMobile ? "mobile-compact space-y-2" : "space-y-4"}>
        <div>
          <Label className={`block mb-2 ${isMobile ? "text-xs" : "text-sm"}`}>
            Test Input
          </Label>
          <Textarea
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder={`Enter test input for ${node?.type || "node"}...`}
            className={isMobile ? "mobile-textarea" : "min-h-[100px]"}
          />
        </div>

        <Button
          onClick={testNode}
          disabled={isProcessingTest}
          className={`w-full touch-target ${isMobile ? "text-xs" : ""}`}
          size={isMobile ? "sm" : "default"}
        >
          <Play className={`mr-2 ${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          {isProcessingTest ? "Testing..." : "Test Node"}
        </Button>

        {testResult && (
          <div
            className={`matrix-bg-glass rounded-lg matrix-border ${
              isMobile ? "p-2" : "p-4"
            }`}
          >
            <h4
              className={`font-medium mb-2 matrix-text ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              Test Result
            </h4>
            <pre
              className={`text-green-300/80 font-mono overflow-auto ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  if (!node) return null;

  return (
    <div
      className={`matrix-bg-glass matrix-border ${
        isMobile ? "w-full h-full rounded-t-xl" : "w-80 h-full rounded-l-xl"
      } backdrop-blur-xl overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <div
        className={`border-b border-green-600/30 ${isMobile ? "p-3" : "p-4"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`${
                isMobile ? "h-6 w-6" : "h-8 w-8"
              } rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center`}
            >
              <Settings
                className={`text-black ${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
              />
            </div>
            <div>
              <h3
                className={`font-bold matrix-text-glow ${
                  isMobile ? "text-sm" : "text-lg"
                }`}
              >
                Node Configuration
              </h3>
              <p
                className={`text-green-400/70 font-mono ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                {node.type}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={`matrix-button touch-target ${
              isMobile ? "h-8 w-8" : ""
            }`}
          >
            <XCircle className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList
            className={`grid w-full grid-cols-3 ${isMobile ? "h-8" : ""}`}
          >
            <TabsTrigger
              value="properties"
              className={isMobile ? "text-xs" : "text-sm"}
            >
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className={isMobile ? "text-xs" : "text-sm"}
            >
              Advanced
            </TabsTrigger>
            <TabsTrigger
              value="testing"
              className={isMobile ? "text-xs" : "text-sm"}
            >
              Testing
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent
              value="properties"
              className={`${isMobile ? "p-3" : "p-4"} space-y-4`}
            >
              <div
                className={isMobile ? "mobile-compact space-y-2" : "space-y-4"}
              >
                <div>
                  <Label
                    className={`block mb-2 ${isMobile ? "text-xs" : "text-sm"}`}
                  >
                    Label
                  </Label>
                  <Input
                    value={config.label}
                    onChange={(e) => handleChange(e)}
                    name="label"
                    placeholder="Node label"
                    className={isMobile ? "text-sm" : ""}
                  />
                </div>

                <div>
                  <Label
                    className={`block mb-2 ${isMobile ? "text-xs" : "text-sm"}`}
                  >
                    Description
                  </Label>
                  <Input
                    value={config.description}
                    onChange={(e) => handleChange(e)}
                    name="description"
                    placeholder="Node description"
                    className={isMobile ? "text-sm" : ""}
                  />
                </div>

                {renderCustomFields()}
              </div>
            </TabsContent>

            <TabsContent
              value="advanced"
              className={`${isMobile ? "p-3" : "p-4"} space-y-4`}
            >
              <div
                className={isMobile ? "mobile-compact space-y-2" : "space-y-4"}
              >
                {/* Advanced configuration options can be added here in the future */}
                <div className="text-sm text-muted-foreground">
                  Advanced configuration options will be available here.
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="testing"
              className={`${isMobile ? "p-3" : "p-4"}`}
            >
              {renderTestingTab()}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <div
        className={`border-t border-green-600/30 ${isMobile ? "p-3" : "p-4"}`}
      >
        <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
          <Button
            onClick={updateNode}
            className={`matrix-button touch-target ${
              isMobile ? "flex-1 text-xs" : "flex-1"
            }`}
            size={isMobile ? "sm" : "default"}
          >
            <Save className={`mr-2 ${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            Save Changes
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className={`touch-target ${isMobile ? "flex-1 text-xs" : ""}`}
                size={isMobile ? "sm" : "default"}
              >
                <Trash2
                  className={`mr-2 ${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
                />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="matrix-modal">
              <AlertDialogHeader>
                <AlertDialogTitle className="matrix-text">
                  Delete Node
                </AlertDialogTitle>
                <AlertDialogDescription className="text-green-300/70">
                  Are you sure you want to delete this node? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="matrix-button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteNode}
                  className="matrix-button bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default NodePanel;
