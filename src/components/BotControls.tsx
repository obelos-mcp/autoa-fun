
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, Square, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';

interface BotControlsProps {
  botToken: string;
  setBotToken: (token: string) => void;
  isRunning: boolean;
  botInfo: any;
  pollingStatus?: 'idle' | 'active' | 'error';
  validateBotToken: (token: string) => boolean;
  startBot: () => void;
  stopBot: () => void;
}

const BotControls = ({
  botToken,
  setBotToken,
  isRunning,
  botInfo,
  pollingStatus = 'idle',
  validateBotToken,
  startBot,
  stopBot
}: BotControlsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="bot-token">Bot Token from @BotFather</Label>
        <Input
          id="bot-token"
          type="password"
          placeholder="123456789:AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRss"
          value={botToken}
          onChange={(e) => setBotToken(e.target.value)}
          disabled={isRunning}
        />
        <p className="text-xs text-muted-foreground">
          Get your bot token from @BotFather on Telegram
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {botToken && (
          <Badge variant={validateBotToken(botToken) ? "default" : "destructive"}>
            {validateBotToken(botToken) ? "Valid Token Format" : "Invalid Token Format"}
          </Badge>
        )}
        {botInfo && (
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Bot: {botInfo.first_name} (@{botInfo.username})
          </Badge>
        )}
        {isRunning && pollingStatus === 'active' && (
          <Badge className="bg-green-500 flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Polling Active
          </Badge>
        )}
        {isRunning && pollingStatus === 'error' && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Polling Error
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <Button 
            onClick={startBot}
            disabled={!botToken || !validateBotToken(botToken)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="mr-2 h-4 w-4" />
            Start Bot
          </Button>
        ) : (
          <Button 
            onClick={stopBot}
            variant="destructive"
          >
            <Square className="mr-2 h-4 w-4" />
            Stop Bot
          </Button>
        )}
      </div>
    </>
  );
};

export default BotControls;
