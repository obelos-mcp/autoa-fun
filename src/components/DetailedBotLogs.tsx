
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Bug, Info, AlertTriangle, Zap } from 'lucide-react';

interface DetailedLog {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'DEBUG' | 'WARNING';
  category: string;
  message: string;
  details?: any;
}

interface DetailedBotLogsProps {
  detailedLogs: DetailedLog[];
  isRunning: boolean;
}

const DetailedBotLogs = ({ detailedLogs, isRunning }: DetailedBotLogsProps) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <AlertCircle className="h-3 w-3" />;
      case 'WARNING': return <AlertTriangle className="h-3 w-3" />;
      case 'DEBUG': return <Bug className="h-3 w-3" />;
      case 'INFO': return <Info className="h-3 w-3" />;
      default: return <Zap className="h-3 w-3" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'destructive';
      case 'WARNING': return 'outline';
      case 'DEBUG': return 'secondary';
      case 'INFO': return 'default';
      default: return 'default';
    }
  };

  const filteredLogs = selectedLevel === 'all' 
    ? detailedLogs 
    : detailedLogs.filter(log => log.level === selectedLevel);

  const logCounts = {
    ERROR: detailedLogs.filter(log => log.level === 'ERROR').length,
    WARNING: detailedLogs.filter(log => log.level === 'WARNING').length,
    INFO: detailedLogs.filter(log => log.level === 'INFO').length,
    DEBUG: detailedLogs.filter(log => log.level === 'DEBUG').length,
  };

  if (!isRunning && detailedLogs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-4 w-4" />
          Detailed Bot Logs ({detailedLogs.length} entries)
        </CardTitle>
        <CardDescription>
          Comprehensive debugging information for your Telegram bot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedLevel} onValueChange={setSelectedLevel}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({detailedLogs.length})</TabsTrigger>
            <TabsTrigger value="ERROR">Errors ({logCounts.ERROR})</TabsTrigger>
            <TabsTrigger value="WARNING">Warnings ({logCounts.WARNING})</TabsTrigger>
            <TabsTrigger value="INFO">Info ({logCounts.INFO})</TabsTrigger>
            <TabsTrigger value="DEBUG">Debug ({logCounts.DEBUG})</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedLevel}>
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              {filteredLogs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No {selectedLevel === 'all' ? '' : selectedLevel.toLowerCase()} logs available
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map((log, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getLevelColor(log.level) as any} className="flex items-center gap-1">
                          {getLevelIcon(log.level)}
                          {log.level}
                        </Badge>
                        <Badge variant="outline">{log.category}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm font-medium mb-2">{log.message}</div>
                      {log.details && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                            Show details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailedBotLogs;
