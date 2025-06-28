import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

interface WalletInputNodeProps {
  data: any;
  isConnectable: boolean;
}

const WalletInputNode: React.FC<WalletInputNodeProps> = ({
  data,
  isConnectable,
}) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-2 border-blue-500/30 rounded-xl p-4 min-w-[280px] backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">💰</span>
        </div>
        <div>
          <h3 className="font-semibold text-white">
            {data.label || 'Wallet Address Input'}
          </h3>
          <p className="text-xs text-gray-400">Blockchain Wallet</p>
        </div>
      </div>

      <div className="space-y-2">
        {data.walletAddress && (
          <Badge variant="outline" className="text-xs">
            Address: {data.walletAddress.slice(0, 10)}...{data.walletAddress.slice(-6)}
          </Badge>
        )}
        
        {data.blockchain && (
          <Badge variant="outline" className="text-xs">
            Chain: {data.blockchain}
          </Badge>
        )}
        
        {data.configured && (
          <Badge variant="outline" className="text-xs">
            ✅ Configured
          </Badge>
        )}

        {data.executionStatus && (
          <Badge 
            className={`text-xs ${getStatusStyles(data.executionStatus)}`}
          >
            Status: {data.executionStatus}
          </Badge>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 border-2 border-blue-300"
      />
    </div>
  );
};

export default WalletInputNode; 