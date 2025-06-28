import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface PDFGeneratorNodeProps {
  data: any;
  id: string;
  setNodes?: (updater: (nodes: any[]) => any[]) => void;
}

export const PDFGeneratorNode: React.FC<PDFGeneratorNodeProps> = ({ data, id, setNodes }) => {
  const isMobile = useIsMobile();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Configuration from node data
  const pdfFormat = data.pdfFormat || 'A4';
  const includeCharts = data.includeCharts || true;
  const includeSummary = data.includeSummary || true;
  const template = data.template || 'standard';

  return (
    <div 
      className={`${isMobile ? 'p-2 min-w-[200px]' : 'p-4 min-w-[280px]'} relative bg-black/90 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-lg`}
      style={{
        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
        boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3)'
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-purple-400 bg-purple-600"
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-purple-500/20">
          <FileText className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-purple-400`} />
        </div>
        <div>
          <div className={`font-semibold text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>
            PDF Generator
          </div>
          <div className={`text-purple-300 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            Transaction Report
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-3">
        <Badge className={`${getStatusStyles(data.executionStatus)} ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'}`}>
          {data.executionStatus === 'processing' && (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          )}
          {data.executionStatus || 'Ready'}
        </Badge>
        
        {data.executionStatus === 'completed' && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            <Download className="w-3 h-3 mr-1" />
            Ready
          </Badge>
        )}
      </div>

      {/* Configuration Display */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>Format:</span>
          <span className={`text-purple-300 font-mono ${isMobile ? 'text-xs' : 'text-sm'}`}>{pdfFormat}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>Template:</span>
          <span className={`text-purple-300 font-mono ${isMobile ? 'text-xs' : 'text-sm'}`}>{template}</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {includeCharts && (
            <Badge className="bg-purple-500/20 text-purple-300 text-xs">Charts</Badge>
          )}
          {includeSummary && (
            <Badge className="bg-purple-500/20 text-purple-300 text-xs">Summary</Badge>
          )}
        </div>
      </div>

      {/* Processing Status */}
      {data.executionResult && (
        <div className="mt-2 p-2 bg-purple-500/10 rounded border border-purple-500/20">
          <div className={`text-purple-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-1`}>
            Generated Report
          </div>
          <div className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            {data.executionResult.message || 'PDF report generated successfully'}
          </div>
          {data.executionResult.downloadUrl && (
            <div className="mt-1">
              <a 
                href={data.executionResult.downloadUrl}
                download
                className="text-purple-400 hover:text-purple-300 text-xs underline"
              >
                Download PDF
              </a>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {data.executionError && (
        <div className="mt-2 p-2 bg-red-500/10 rounded border border-red-500/20">
          <div className={`text-red-400 ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
            Error
          </div>
          <div className={`text-red-300 ${isMobile ? 'text-xs' : 'text-xs'} mt-1`}>
            {data.executionError}
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-purple-400 bg-purple-600"
      />
    </div>
  );
};

export default PDFGeneratorNode;