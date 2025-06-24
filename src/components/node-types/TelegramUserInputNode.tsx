
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageCircle } from 'lucide-react';

const TelegramUserInputNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-br from-violet-950 to-violet-900 text-white rounded-xl p-4 border border-violet-600/40 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="h-5 w-5 text-violet-300" />
        <div className="font-medium text-sm">{data.label || 'Telegram User Input'}</div>
      </div>
      
      <div className="text-xs opacity-75 mb-3">
        {data.description || 'Processes user input from Telegram'}
      </div>

      <div className="text-xs bg-violet-800/30 rounded p-2">
        Input Type: {data.content ? JSON.parse(data.content).inputType || 'text' : 'text'}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default memo(TelegramUserInputNode);
