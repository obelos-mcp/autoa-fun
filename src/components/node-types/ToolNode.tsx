
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

const ToolNode = ({ data }: { data: any }) => {
  // Parse tool config if exists
  let toolConfig: any = null;
  let configValid = false;
  
  if (data.content) {
    try {
      toolConfig = JSON.parse(data.content);
      configValid = Boolean(toolConfig && toolConfig.name);
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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        {configValid ? (
          <>
            <Badge variant="outline" className="bg-background/30 text-xs">
              {toolConfig.name}
            </Badge>
            {toolConfig.type && (
              <Badge variant="outline" className="bg-background/30 text-xs">
                {toolConfig.type}
              </Badge>
            )}
          </>
        ) : (
          <Badge variant="destructive" className="text-xs">
            Tool Setup Required
          </Badge>
        )}
      </div>
      
      {data.executionStatus && (
        <div className={`mt-2 text-xs ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? '✓ Executed' : 
           data.executionStatus === 'error' ? '✗ Failed' : 
           '⟳ Running'}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </>
  );
};

export default ToolNode;
