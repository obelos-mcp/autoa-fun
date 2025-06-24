
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

const VideoFetcherNode = ({ data }: { data: any }) => {
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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" x2="12" y1="15" y2="3"/>
        </svg>
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant="outline" className="bg-background/30 text-xs">
          Requires URL Input
        </Badge>
      </div>
      
      <div className="mt-2 text-xs opacity-75">
        Downloads video from YouTube URL
      </div>
      
      {data.executionStatus && (
        <div className={`mt-2 text-xs ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? '✓ Video Downloaded' : 
           data.executionStatus === 'error' ? '✗ Download Failed' : 
           '⟳ Downloading'}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </>
  );
};

export default VideoFetcherNode;
