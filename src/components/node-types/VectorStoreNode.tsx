
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

const VectorStoreNode = ({ data }: { data: any }) => {
  // Parse vector store config if exists
  let vectorConfig: any = null;
  let configValid = false;
  
  if (data.content) {
    try {
      vectorConfig = JSON.parse(data.content);
      configValid = Boolean(vectorConfig && vectorConfig.provider);
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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        {configValid ? (
          <>
            <Badge variant="outline" className="bg-background/30 text-xs">
              {vectorConfig.provider || 'Custom'} 
            </Badge>
            {vectorConfig.dimensions && (
              <Badge variant="outline" className="bg-background/30 text-xs">
                {vectorConfig.dimensions}D
              </Badge>
            )}
          </>
        ) : (
          <Badge variant="destructive" className="text-xs">
            Setup Required
          </Badge>
        )}
      </div>
      
      {data.executionStatus && (
        <div className={`mt-2 text-xs ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? '✓ Connected' : 
           data.executionStatus === 'error' ? '✗ Failed' : 
           '⟳ Connecting'}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </>
  );
};

export default VectorStoreNode;
