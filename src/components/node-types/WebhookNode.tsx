
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Server, Zap } from 'lucide-react';

const WebhookNode = ({ data }: { data: any }) => {
  // Parse webhook config if exists
  let webhookConfig: any = null;
  let configValid = false;
  
  if (data.content) {
    try {
      webhookConfig = JSON.parse(data.content);
      configValid = Boolean(webhookConfig && webhookConfig.url);
    } catch (e) {
      configValid = false;
    }
  }
  
  const getStatusStyles = () => {
    if (!data.executionStatus) return '';
    
    switch (data.executionStatus) {
      case 'processing':
        return 'animate-pulse text-blue-400';
      case 'completed':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return '';
    }
  };

  const deploymentOptions = [
    {
      name: 'Local Testing',
      description: 'Use ngrok for local development',
      icon: Server,
      color: 'bg-blue-500'
    },
    {
      name: 'Cloud Deploy',
      description: 'Deploy to Vercel, Netlify, etc.',
      icon: Globe,
      color: 'bg-green-500'
    },
    {
      name: 'Webhook Service',
      description: 'Use webhook testing services',
      icon: Zap,
      color: 'bg-purple-500'
    }
  ];
  
  return (
    <>
      <div className="flex items-center mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>
      
      {!configValid ? (
        <div className="mt-2 space-y-2">
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 text-xs w-full justify-center">
            Choose Deployment Option
          </Badge>
          <div className="space-y-1">
            {deploymentOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div key={index} className="flex items-center gap-2 p-1 rounded border border-border/30 bg-background/20">
                  <div className={`w-2 h-2 rounded-full ${option.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{option.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{option.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge variant="outline" className="bg-background/30 text-xs">
            {webhookConfig.method || 'POST'}
          </Badge>
          <Badge variant="outline" className="bg-green-500/20 text-green-600 text-xs">
            Connected
          </Badge>
        </div>
      )}
      
      {data.executionStatus && (
        <div className={`mt-2 text-xs ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? '✓ Sent' : 
           data.executionStatus === 'error' ? '✗ Failed' : 
           '⟳ Sending'}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </>
  );
};

export default WebhookNode;
