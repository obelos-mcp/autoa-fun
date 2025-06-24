
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

const TelegramConditionNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-br from-teal-950 to-teal-900 text-white rounded-xl p-4 border border-teal-600/40 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="h-5 w-5 text-teal-300" />
        <div className="font-medium text-sm">{data.label || 'Telegram Condition'}</div>
      </div>
      
      <div className="text-xs opacity-75 mb-3">
        {data.description || 'Conditional logic for Telegram messages'}
      </div>

      <div className="text-xs bg-teal-800/30 rounded p-2">
        Condition: {data.content ? JSON.parse(data.content).type || 'Not configured' : 'Not configured'}
      </div>

      <Handle type="source" position={Position.Bottom} id="true" className="w-3 h-3" style={{ left: '30%' }} />
      <Handle type="source" position={Position.Bottom} id="false" className="w-3 h-3" style={{ left: '70%' }} />
      
      <div className="absolute bottom-[-20px] left-[25%] text-xs text-teal-300">True</div>
      <div className="absolute bottom-[-20px] right-[25%] text-xs text-teal-300">False</div>
    </div>
  );
};

export default memo(TelegramConditionNode);
