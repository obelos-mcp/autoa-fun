import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

interface SocialMediaNodeProps {
  data: any;
  isConnectable: boolean;
}

const SocialMediaNode: React.FC<SocialMediaNodeProps> = ({
  data,
  isConnectable,
}) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-2 border-purple-500/30 rounded-xl p-4 min-w-[280px] backdrop-blur-sm">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500 border-2 border-purple-300"
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">SM</span>
        </div>
        <div>
          <h3 className="font-semibold text-white">
            {data.label || 'Social Media Post'}
          </h3>
          <p className="text-xs text-gray-400">Content Publishing</p>
        </div>
      </div>

      <div className="space-y-2">
        {data.platform && (
          <Badge variant="outline" className="text-xs">
            Platform: {data.platform}
          </Badge>
        )}
        
        {data.targetAudience && (
          <Badge variant="outline" className="text-xs">
            Audience: {data.targetAudience}
          </Badge>
        )}
        
        {data.mediaUrl && (
          <Badge variant="outline" className="text-xs">
            📷 Media Attached
          </Badge>
        )}
        
        {data.scheduleTime && (
          <Badge variant="outline" className="text-xs">
            ⏰ Scheduled
          </Badge>
        )}
        
        {data.enableAnalytics && (
          <Badge variant="outline" className="text-xs">
            📊 Analytics Enabled
          </Badge>
        )}

        {data.executionStatus && (
          <Badge 
            className={`text-xs ${getStatusStyles(data.executionStatus)}`}
          >
            Status: {data.executionStatus}
          </Badge>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500 border-2 border-purple-300"
      />
    </div>
  );
};

export default SocialMediaNode;
