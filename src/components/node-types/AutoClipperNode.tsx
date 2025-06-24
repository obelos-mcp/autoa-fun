
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

const AutoClipperNode = ({ data }: { data: any }) => {
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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
          <path d="M4 7v1a3 3 0 0 0 3 3h1m0-4H7a3 3 0 0 0-3 3v1"/>
          <path d="M20 7v1a3 3 0 0 1-3 3h-1m0-4h1a3 3 0 0 1 3 3v1"/>
          <path d="M10 14l2-2 2 2"/>
          <path d="M12 12v6"/>
        </svg>
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant="outline" className="bg-background/30 text-xs">
          Requires Highlights
        </Badge>
      </div>
      
      <div className="mt-2 text-xs opacity-75">
        Extracts best highlight segment
      </div>
      
      {data.executionStatus && (
        <div className={`mt-2 text-xs ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? '✓ Segment Extracted' : 
           data.executionStatus === 'error' ? '✗ Extraction Failed' : 
           '⟳ Clipping Video'}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </>
  );
};

export default AutoClipperNode;
