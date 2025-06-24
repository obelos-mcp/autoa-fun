
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

const CustomCommandsNode = ({ data }: { data: any }) => {
  // Parse commands config if exists
  let commandsConfig: any = null;
  let configValid = false;
  
  if (data.content) {
    try {
      commandsConfig = JSON.parse(data.content);
      configValid = Boolean(commandsConfig && Array.isArray(commandsConfig.commands) && commandsConfig.commands.length > 0);
    } catch (e) {
      configValid = false;
    }
  }
  
  return (
    <>
      <div className="flex items-center mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="m3 16 4 4 4-4"/>
          <path d="M7 20V4"/>
          <path d="m21 8-4-4-4 4"/>
          <path d="M17 4v16"/>
        </svg>
        <div className="node-label">{data.label}</div>
      </div>
      <div className="node-desc">{data.description}</div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        {configValid ? (
          <>
            <Badge variant="outline" className="bg-green-950/20 border-green-800/30 text-green-400 text-xs">
              {commandsConfig.commands.length} command{commandsConfig.commands.length !== 1 ? 's' : ''}
            </Badge>
            {commandsConfig.commands.slice(0, 2).map((cmd: any, index: number) => (
              <Badge key={index} variant="outline" className="bg-blue-950/20 border-blue-800/30 text-blue-400 text-xs">
                /{cmd.command}
              </Badge>
            ))}
            {commandsConfig.commands.length > 2 && (
              <Badge variant="outline" className="bg-blue-950/20 border-blue-800/30 text-blue-400 text-xs">
                +{commandsConfig.commands.length - 2} more
              </Badge>
            )}
          </>
        ) : (
          <Badge variant="destructive" className="text-xs">
            Setup Required
          </Badge>
        )}
      </div>
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </>
  );
};

export default CustomCommandsNode;
