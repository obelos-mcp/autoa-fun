
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Server, Wrench, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const MCPNode = ({ data }: { data: any }) => {
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

  const getConnectionStatus = () => {
    if (data.serverStatus === 'connected') {
      return <CheckCircle className="h-3 w-3 text-green-400" />;
    } else if (data.serverStatus === 'connecting') {
      return <Loader2 className="h-3 w-3 text-blue-400 animate-spin" />;
    } else {
      return <XCircle className="h-3 w-3 text-red-400" />;
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-purple-900/90 to-purple-800/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 min-w-[200px] shadow-lg">
      <div className="flex items-center mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 mr-3">
          <Server className="h-4 w-4 text-purple-300" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-sm">{data.label}</div>
          <div className="text-purple-200 text-xs opacity-80">{data.description}</div>
        </div>
        <div className="ml-2">
          {getConnectionStatus()}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-400/30 text-xs">
          MCP Protocol
        </Badge>
        {data.serverName && (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-200 border-blue-400/30 text-xs">
            {data.serverName}
          </Badge>
        )}
      </div>
      
      {data.toolName && (
        <div className="mb-2">
          <div className="bg-purple-500/10 border border-purple-400/30 rounded px-2 py-1">
            <div className="flex items-center gap-1">
              <Wrench className="h-3 w-3 text-purple-300" />
              <span className="text-purple-300 text-xs">Tool: {data.toolName}</span>
            </div>
          </div>
        </div>
      )}
      
      {data.executionResult && (
        <div className="mb-2">
          <div className="bg-green-500/10 border border-green-400/30 rounded px-2 py-1">
            <div className="text-green-300 text-xs">
              <div>Status: Success</div>
              {data.executionResult.content && (
                <div className="mt-1 text-xs opacity-80 truncate">
                  Result: {String(data.executionResult.content).substring(0, 50)}...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {data.executionStatus && (
        <div className={`text-xs font-medium flex items-center gap-1 ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? (
            <>
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Tool Executed
            </>
          ) : data.executionStatus === 'error' ? (
            <>
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              Execution Failed
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Executing Tool...
            </>
          )}
        </div>
      )}
      
      <Handle 
        type="target" 
        position={Position.Top} 
        id="in" 
        className="w-3 h-3 bg-purple-500 border-2 border-purple-300" 
        style={{ top: -6 }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="out" 
        className="w-3 h-3 bg-purple-500 border-2 border-purple-300" 
        style={{ bottom: -6 }} 
      />
    </div>
  );
};

export default MCPNode;
