
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface BotLogsProps {
  messages: string[];
  isRunning: boolean;
}

const BotLogs = ({ messages, isRunning }: BotLogsProps) => {
  if (!isRunning && messages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Bot Logs ({messages.length} entries)
        </CardTitle>
        <CardDescription>
          Real-time activity from your Telegram bot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-black/95 text-green-400 p-4 rounded-lg font-mono text-xs h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-gray-500">Waiting for bot activity...</div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="mb-1 leading-tight">
                {message}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BotLogs;
