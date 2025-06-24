
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

const MemoryNode = ({ data }: { data: any }) => {
  // Parse memory config if exists
  let memoryConfig: any = null;
  let configValid = false;
  
  if (data.content) {
    try {
      memoryConfig = JSON.parse(data.content);
      configValid = Boolean(memoryConfig && memoryConfig.type);
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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"/><path d="M6 9.01V9"/><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/></svg>
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        {configValid ? (
          <>
            <Badge variant="outline" className="bg-background/30 text-xs">
              {memoryConfig.type || 'Buffer'}
            </Badge>
            {memoryConfig.maxTokens && (
              <Badge variant="outline" className="bg-background/30 text-xs">
                {memoryConfig.maxTokens} tokens
              </Badge>
            )}
          </>
        ) : (
          <Badge variant="outline" className="bg-background/30 text-xs">
            Default Config
          </Badge>
        )}
      </div>
      
      {data.executionStatus && (
        <div className={`mt-2 text-xs ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? '✓ Stored' : 
           data.executionStatus === 'error' ? '✗ Error' : 
           '⟳ Processing'}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </>
  );
};

export default MemoryNode;
