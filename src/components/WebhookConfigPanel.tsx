
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Server, Zap, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookConfigPanelProps {
  onConfigSelect: (config: any) => void;
}

const WebhookConfigPanel = ({ onConfigSelect }: WebhookConfigPanelProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { toast } = useToast();

  const deploymentOptions = [
    {
      id: 'ngrok',
      name: 'Local Testing with ngrok',
      description: 'Perfect for development and testing',
      icon: Server,
      color: 'from-blue-500 to-blue-600',
      steps: [
        'Install ngrok: npm install -g ngrok',
        'Run your local server on port 3000',
        'Run: ngrok http 3000',
        'Copy the HTTPS URL provided'
      ],
      config: {
        url: 'https://your-ngrok-id.ngrok.io/webhook/telegram',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    },
    {
      id: 'vercel',
      name: 'Deploy to Vercel',
      description: 'Free serverless deployment',
      icon: Globe,
      color: 'from-green-500 to-green-600',
      steps: [
        'Create account at vercel.com',
        'Deploy your webhook handler',
        'Get your deployment URL',
        'Add /api/telegram to the end'
      ],
      config: {
        url: 'https://your-app.vercel.app/api/telegram',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    },
    {
      id: 'webhook-site',
      name: 'Webhook Testing Service',
      description: 'Quick testing without deployment',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      steps: [
        'Go to webhook.site',
        'Copy your unique URL',
        'Use it for testing webhook calls',
        'View incoming requests in real-time'
      ],
      config: {
        url: 'https://webhook.site/your-unique-id',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    }
  ];

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option.id);
    onConfigSelect(option.config);
    toast({
      title: "Configuration Applied",
      description: `Set up for ${option.name}. Update the URL with your actual endpoint.`
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Command copied to clipboard"
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground mb-3">
        Choose your deployment method:
      </div>
      
      {deploymentOptions.map((option) => {
        const IconComponent = option.icon;
        const isSelected = selectedOption === option.id;
        
        return (
          <Card 
            key={option.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className={`p-1 rounded bg-gradient-to-r ${option.color}`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                {option.name}
                {isSelected && (
                  <Badge variant="default" className="ml-auto">Selected</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                {option.description}
              </CardDescription>
            </CardHeader>
            
            {isSelected && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Setup Steps:</div>
                  <ol className="text-xs space-y-1 pl-4">
                    {option.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 font-medium">{index + 1}.</span>
                        <span className="flex-1">{step}</span>
                        {step.includes('npm install') || step.includes('ngrok http') ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(step.split(': ')[1] || step);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
      
      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
        💡 Tip: For production bots, use cloud deployment. For testing, ngrok or webhook.site work great!
      </div>
    </div>
  );
};

export default WebhookConfigPanel;
