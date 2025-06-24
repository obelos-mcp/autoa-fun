import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/services/aiService";

// --- Types ---
interface DetailedLog {
  timestamp: string;
  level: "INFO" | "ERROR" | "DEBUG" | "WARNING";
  category: string;
  message: string;
  details?: any;
}

interface TelegramBotState {
  botToken: string;
  isRunning: boolean;
  botInfo: any | null;
  messages: string[];
  detailedLogs: DetailedLog[];
  pollingStatus: "idle" | "active" | "error";
}

interface TelegramBotActions {
  setBotToken: (token: string) => void;
  startBot: () => void;
  stopBot: () => void;
}

type UseTelegramBotReturn = TelegramBotState & {
  actions: TelegramBotActions;
};

// --- Initial State ---
const INITIAL_STATE: TelegramBotState = {
  botToken: "",
  isRunning: false,
  botInfo: null,
  messages: [],
  detailedLogs: [],
  pollingStatus: "idle",
};

// --- The Hook ---
export const useTelegramBot = (flowData: {
  nodes: any[];
  edges: any[];
}): UseTelegramBotReturn => {
  const [state, setState] = useState<TelegramBotState>(INITIAL_STATE);
  const { toast } = useToast();

  const flowDataRef = useRef(flowData);
  const botTokenRef = useRef(state.botToken);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);
  const lastUpdateIdRef = useRef(0);

  useEffect(() => {
    flowDataRef.current = flowData;
  }, [flowData]);

  useEffect(() => {
    botTokenRef.current = state.botToken;
  }, [state.botToken]);

  // --- Core Logic ---
  const addLogs = useCallback((logs: Omit<DetailedLog, "timestamp">[]) => {
    setState((s) => {
      const now = new Date();
      const newDetailedLogs = logs.map((log) => ({
        ...log,
        timestamp: now.toISOString(),
      }));
      const newMessages = logs.map(
        (log) => `[${now.toLocaleTimeString()}] ${log.message}`
      );
      return {
        ...s,
        detailedLogs: [...s.detailedLogs, ...newDetailedLogs],
        messages: [...s.messages, ...newMessages],
      };
    });
  }, []);

  const processMessage = useCallback(
    async (message: any) => {
      try {
        const { text, chat } = message;
        addLogs([
          { level: "INFO", category: "MSG", message: `Processing: "${text}"` },
        ]);

        const systemNode = flowDataRef.current.nodes.find(
          (n) => n.type === "system"
        );
        const systemPrompt =
          systemNode?.data?.content || "You are a helpful assistant.";
        const aiModelNode = flowDataRef.current.nodes.find(
          (n) => n.type === "aimodel"
        );
        if (!aiModelNode) throw new Error("AI Model node is missing.");

        const aiConfig = JSON.parse(aiModelNode.data.content || "{}");
        const aiResponse = await AIService.callAI(aiConfig, systemPrompt, text);

        if (!aiResponse?.response) throw new Error("Invalid AI response.");

        await fetch(
          `https://api.telegram.org/bot${botTokenRef.current}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chat.id,
              text: aiResponse.response,
            }),
          }
        );
        addLogs([
          { level: "INFO", category: "MSG", message: `Replied to user.` },
        ]);
      } catch (error) {
        addLogs([
          {
            level: "ERROR",
            category: "PROCESS",
            message: `Error processing message: ${
              error instanceof Error ? error.message : "Unknown"
            }`,
          },
        ]);
      }
    },
    [addLogs]
  );

  const pollForUpdates = useCallback(async () => {
    if (!isPollingRef.current) return;
    try {
      const offset = lastUpdateIdRef.current + 1;
      const response = await fetch(
        `https://api.telegram.org/bot${botTokenRef.current}/getUpdates?offset=${offset}&timeout=20`
      );
      const data = await response.json();

      if (!data.ok) throw new Error(data.description);

      if (data.result.length > 0) {
        for (const update of data.result) {
          lastUpdateIdRef.current = update.update_id;
          if (update.message) {
            await processMessage(update.message);
          }
        }
      }
    } catch (error) {
      addLogs([
        {
          level: "ERROR",
          category: "POLL",
          message: `Polling failed: ${
            error instanceof Error ? error.message : "Unknown"
          }. Stopping bot.`,
        },
      ]);
      setState((s) => ({ ...s, isRunning: false, pollingStatus: "error" }));
      isPollingRef.current = false;
      if (pollingIntervalRef.current) clearTimeout(pollingIntervalRef.current);
    } finally {
      if (isPollingRef.current) {
        pollingIntervalRef.current = setTimeout(pollForUpdates, 5000);
      }
    }
  }, [addLogs, processMessage]);

  const stopPolling = useCallback(() => {
    isPollingRef.current = false;
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // --- Exposed Actions ---
  const actions = useMemo(
    (): TelegramBotActions => ({
      setBotToken: (token) => setState((s) => ({ ...s, botToken: token })),

      startBot: async () => {
        const token = botTokenRef.current;
        if (!/^\d+:[A-Za-z0-9_-]{35}$/.test(token)) {
          toast({ title: "Invalid Token", variant: "destructive" });
          return;
        }

        stopPolling();
        setState({
          ...INITIAL_STATE,
          botToken: token,
          isRunning: true,
          pollingStatus: "active",
        });

        try {
          const response = await fetch(
            `https://api.telegram.org/bot${token}/getMe`
          );
          const data = await response.json();
          if (!data.ok) throw new Error(data.description);

          lastUpdateIdRef.current = 0;
          isPollingRef.current = true;
          setState((s) => ({ ...s, botInfo: data.result }));
          toast({
            title: "Bot Started",
            description: `Connected to ${data.result.first_name}.`,
          });
          addLogs([
            {
              level: "INFO",
              category: "BOT",
              message: `Bot '${data.result.first_name}' started.`,
            },
          ]);

          pollForUpdates();
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Unknown error";
          toast({
            title: "Failed to Start",
            description: msg,
            variant: "destructive",
          });
          addLogs([
            {
              level: "ERROR",
              category: "BOT",
              message: `Failed to start: ${msg}`,
            },
          ]);
          setState((s) => ({ ...s, isRunning: false, pollingStatus: "error" }));
        }
      },

      stopBot: () => {
        stopPolling();
        setState((s) => ({
          ...s,
          isRunning: false,
          botInfo: null,
          pollingStatus: "idle",
        }));
        addLogs([{ level: "INFO", category: "BOT", message: "Bot stopped." }]);
        toast({ title: "Bot Stopped" });
      },
    }),
    [addLogs, toast, stopPolling, pollForUpdates]
  );

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return { ...state, actions };
};
