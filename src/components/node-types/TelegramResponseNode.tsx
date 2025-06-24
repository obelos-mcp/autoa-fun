
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Send } from 'lucide-react';

const TelegramResponseNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-br from-rose-950 to-rose-900 text-white rounded-xl p-4 border border-rose-600/40 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <Send className="h-5 w-5 text-rose-300" />
        <div className="font-medium text-sm">{data.label || 'Telegram Response'}</div>
      </div>
      
      <div className="text-xs opacity-75 mb-3">
        {data.description || 'Sends formatted responses to Telegram'}
      </div>

      <div className="text-xs bg-rose-800/30 rounded p-2">
        Type: {data.content ? JSON.parse(data.content).responseType || 'text' : 'text'}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default memo(TelegramResponseNode);
