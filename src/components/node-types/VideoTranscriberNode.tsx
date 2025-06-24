
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

const VideoTranscriberNode = ({ data }: { data: any }) => {
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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-purple-500">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" x2="12" y1="19" y2="22"/>
          <line x1="8" x2="16" y1="22" y2="22"/>
        </svg>
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>
      
      {/* Only show basic status - no detailed transcription results */}
      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant="outline" className="bg-background/30 text-xs">
          Requires Video
        </Badge>
        
        {data.executionStatus && (
          <Badge variant="secondary" className={`text-xs ${getStatusStyles()}`}>
            {data.executionStatus === 'completed' ? 'Transcribed' : 
             data.executionStatus === 'error' ? 'Error' : 
             'Transcribing'}
          </Badge>
        )}
      </div>
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </>
  );
};

export default VideoTranscriberNode;
