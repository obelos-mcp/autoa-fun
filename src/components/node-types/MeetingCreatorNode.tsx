
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Video, Users } from 'lucide-react';

const MeetingCreatorNode = ({ data }: { data: any }) => {
  let meetingConfig: any = null;
  let configValid = false;
  
  if (data.content) {
    try {
      meetingConfig = JSON.parse(data.content);
      configValid = Boolean(meetingConfig && meetingConfig.platform);
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
  
  return (
    <>
      <div className="flex items-center mb-1">
        <Video className="mr-2 h-4 w-4 text-purple-400" />
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        {configValid ? (
          <>
            <Badge variant="outline" className="bg-background/30 text-xs">
              {meetingConfig.platform}
            </Badge>
            {meetingConfig.autoRecord && (
              <Badge variant="outline" className="bg-background/30 text-xs">
                Auto Record
              </Badge>
            )}
          </>
        ) : (
          <Badge variant="destructive" className="text-xs">
            Platform Required
          </Badge>
        )}
      </div>
      
      {data.executionResult && (
        <div className="mt-1 text-xs opacity-75">
          {data.executionResult.meetingUrl ? 
            <span className="text-green-400">Meeting Created</span> : 
            "Ready"
          }
        </div>
      )}
      
      {data.executionStatus && (
        <div className={`mt-2 text-xs ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? '✓ Created' : 
           data.executionStatus === 'error' ? '✗ Failed' : 
           '⟳ Creating'}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </>
  );
};

export default MeetingCreatorNode;
