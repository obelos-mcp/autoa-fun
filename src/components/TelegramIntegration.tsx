import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTelegramBot } from "@/hooks/useTelegramBot";
import BotControls from "./BotControls";
import BotLogs from "./BotLogs";
import DetailedBotLogs from "./DetailedBotLogs";
import SetupInstructions from "./SetupInstructions";

interface TelegramIntegrationProps {
  flowData: { nodes: any[]; edges: any[] };
}

export function TelegramIntegration({ flowData }: TelegramIntegrationProps) {
  const {
    botToken,
    isRunning,
    botInfo,
    messages,
    detailedLogs,
    pollingStatus,
    actions,
  } = useTelegramBot(flowData);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Telegram Bot Integration
          </CardTitle>
          <CardDescription>
            Connect your AI flow to a Telegram bot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BotControls
            botToken={botToken}
            setBotToken={actions.setBotToken}
            isRunning={isRunning}
            botInfo={botInfo}
            pollingStatus={pollingStatus}
            validateBotToken={() => true} // Simplified, validation is now internal
            startBot={actions.startBot}
            stopBot={actions.stopBot}
          />
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Prerequisites:</strong> Make sure you have configured your AI
          flow with at least a System node and an AI Model node before starting
          the bot.
        </AlertDescription>
      </Alert>

      <DetailedBotLogs detailedLogs={detailedLogs} isRunning={isRunning} />

      <BotLogs messages={messages} isRunning={isRunning} />

      <SetupInstructions />
    </div>
  );
}
