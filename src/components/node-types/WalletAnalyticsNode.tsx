import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

interface WalletAnalyticsNodeProps {
  data: any;
  isConnectable: boolean;
}

const WalletAnalyticsNode: React.FC<WalletAnalyticsNodeProps> = ({
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
    <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-2 border-emerald-500/30 rounded-xl p-4 min-w-[280px] backdrop-blur-sm">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-emerald-500 border-2 border-emerald-300"
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">📊</span>
        </div>
        <div>
          <h3 className="font-semibold text-white">
            {data.label || 'Wallet Analytics'}
          </h3>
          <p className="text-xs text-gray-400">Data Analysis</p>
        </div>
      </div>

      <div className="space-y-2">
        {data.analysisType && (
          <Badge variant="outline" className="text-xs">
            Type: {data.analysisType}
          </Badge>
        )}
        
        {data.generateCharts && (
          <Badge variant="outline" className="text-xs">
            📈 Charts Enabled
          </Badge>
        )}
        
        {data.includePatterns && (
          <Badge variant="outline" className="text-xs">
            🔍 Pattern Analysis
          </Badge>
        )}
        
        {data.riskAssessment && (
          <Badge variant="outline" className="text-xs">
            ⚠️ Risk Assessment
          </Badge>
        )}

        {data.portfolioAnalysis && (
          <Badge variant="outline" className="text-xs">
            💼 Portfolio Analysis
          </Badge>
        )}

        {data.executionStatus && (
          <Badge 
            className={`text-xs ${getStatusStyles(data.executionStatus)}`}
          >
            Status: {data.executionStatus}
          </Badge>
        )}
        
        {data.insightsGenerated && (
          <Badge variant="outline" className="text-xs">
            Generated: {data.insightsGenerated} insights
          </Badge>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-emerald-500 border-2 border-emerald-300"
      />
    </div>
  );
};

export default WalletAnalyticsNode; 