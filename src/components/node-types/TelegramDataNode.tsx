
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database } from 'lucide-react';

const TelegramDataNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-br from-lime-950 to-lime-900 text-white rounded-xl p-4 border border-lime-600/40 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <Database className="h-5 w-5 text-lime-300" />
        <div className="font-medium text-sm">{data.label || 'Telegram Data'}</div>
      </div>
      
      <div className="text-xs opacity-75 mb-3">
        {data.description || 'Processes and stores Telegram data'}
      </div>

      <div className="text-xs bg-lime-800/30 rounded p-2">
        Operations: {data.content ? JSON.parse(data.content).operations?.length || 0 : 0} configured
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default memo(TelegramDataNode);
