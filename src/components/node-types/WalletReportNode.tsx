import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

interface WalletReportNodeProps {
  data: any;
  isConnectable: boolean;
}

const WalletReportNode: React.FC<WalletReportNodeProps> = ({
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
    <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-2 border-orange-500/30 rounded-xl p-4 min-w-[280px] backdrop-blur-sm">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-500 border-2 border-orange-300"
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">📄</span>
        </div>
        <div>
          <h3 className="font-semibold text-white">
            {data.label || 'Wallet Report Generator'}
          </h3>
          <p className="text-xs text-gray-400">PDF Export</p>
        </div>
      </div>

      <div className="space-y-2">
        {data.reportFormat && (
          <Badge variant="outline" className="text-xs">
            Format: {data.reportFormat}
          </Badge>
        )}
        
        {data.includeCharts && (
          <Badge variant="outline" className="text-xs">
            📊 Include Charts
          </Badge>
        )}
        
        {data.includeTransactionList && (
          <Badge variant="outline" className="text-xs">
            📋 Transaction List
          </Badge>
        )}
        
        {data.includeSummary && (
          <Badge variant="outline" className="text-xs">
            📈 Summary Stats
          </Badge>
        )}

        {data.watermark && (
          <Badge variant="outline" className="text-xs">
            🔖 Watermarked
          </Badge>
        )}

        {data.executionStatus && (
          <Badge 
            className={`text-xs ${getStatusStyles(data.executionStatus)}`}
          >
            Status: {data.executionStatus}
          </Badge>
        )}
        
        {data.reportGenerated && (
          <Badge variant="outline" className="text-xs">
            ✅ Report Ready
          </Badge>
        )}
        
        {data.downloadUrl && (
          <Badge variant="outline" className="text-xs">
            📥 Download Available
          </Badge>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-500 border-2 border-orange-300"
      />
    </div>
  );
};

export default WalletReportNode; 