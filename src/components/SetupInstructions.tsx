
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SetupInstructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">1</div>
            <div>🤖 Create a bot with @BotFather on Telegram and get your bot token</div>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">2</div>
            <div>⚙️ Configure your AI flow with at least System and AI Model nodes</div>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">3</div>
            <div>🔑 Add your OpenAI API key to the AI Model node configuration</div>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">4</div>
            <div>🚀 Enter your bot token above and click "Start Bot"</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SetupInstructions;
