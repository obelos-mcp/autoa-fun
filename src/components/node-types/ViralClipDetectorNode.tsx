
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

const ViralClipDetectorNode = ({ data }: { data: any }) => {
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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-yellow-500">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1s-1 .448-1 1v6c0 .552.448 1 1 1z"/>
          <path d="M3 12c-.552 0-1-.448-1-1V5c0-.552.448-1 1-1s1 .448 1 1v6c0-.552-.448-1-1-1z"/>
        </svg>
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant="outline" className="bg-background/30 text-xs">
          Requires Transcript
        </Badge>
      </div>
      
      <div className="mt-2 text-xs opacity-75">
        AI detects 15-60s highlights for shorts
      </div>
      
      {data.executionStatus && (
        <div className={`mt-2 text-xs ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? '✓ Highlights Detected' : 
           data.executionStatus === 'error' ? '✗ Detection Failed' : 
           '⟳ Analyzing Video'}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </>
  );
};

export default ViralClipDetectorNode;
