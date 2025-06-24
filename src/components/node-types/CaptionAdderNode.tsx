
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Type, Clock, CheckCircle, XCircle } from 'lucide-react';

const CaptionAdderNode = ({ data }: { data: any }) => {
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

  const getStatusIcon = () => {
    switch (data.executionStatus) {
      case 'processing':
        return <Clock className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'error':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleDownload = async (clip: any) => {
    try {
      console.log('Downloading captioned clip:', clip);
      
      // Create a downloadable content for the captioned clip
      const clipContent = `Captioned Clip: ${clip.title || 'AI Generated Short'}
Duration: ${clip.duration || 30}s
Format: 9:16 (1080x1920)
Captions: Added
Start Time: ${clip.startTime || 0}s
End Time: ${clip.endTime || 30}s
Virality Score: ${clip.viralityScore || 'N/A'}

Segments:
${clip.segments?.map((seg: any, idx: number) => `${idx + 1}. ${seg.text || 'Caption text'}`).join('\n') || 'No segments available'}`;

      const blob = new Blob([clipContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `captioned_clip_${clip.startTime || 0}-${clip.endTime || 30}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading clip:', error);
      alert('Error downloading clip. Please try again.');
    }
  };

  const processedClips = data.executionResult?.viralClips || [];

  return (
    <div className="bg-card border border-border rounded-lg p-4 min-w-[280px] shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Type className="w-5 h-5 text-indigo-500" />
        <div className="font-medium text-foreground">{data.label || 'Caption Adder'}</div>
      </div>
      
      <div className="text-sm text-muted-foreground mb-3">
        {data.description || 'Add engaging captions to clips'}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="outline" className="text-xs">
          Requires Clip
        </Badge>
        <Badge variant="outline" className="text-xs">
          9:16 Format
        </Badge>
      </div>
      
      <div className="text-xs text-muted-foreground mb-3">
        Formats to 9:16 and adds captions
      </div>
      
      {/* Execution Status */}
      {data.executionStatus && (
        <div className={`flex items-center gap-2 mb-3 text-sm ${getStatusStyles()}`}>
          {getStatusIcon()}
          <span>
            {data.executionStatus === 'completed' ? 'Captions Added' : 
             data.executionStatus === 'error' ? 'Formatting Error' : 
             'Processing Video'}
          </span>
        </div>
      )}

      {/* Error Message */}
      {data.executionStatus === 'error' && data.executionError && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-2 mb-3">
          <div className="text-xs text-red-600 dark:text-red-400">
            {data.executionError}
          </div>
        </div>
      )}

      {/* Download Section */}
      {data.executionStatus === 'completed' && processedClips.length > 0 && (
        <div className="border-t border-border pt-3">
          <div className="text-sm font-medium text-foreground mb-2">Captioned Clips:</div>
          <div className="space-y-2">
            {processedClips.map((clip: any, index: number) => (
              <div key={index} className="bg-muted/30 rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-foreground truncate">
                    {clip.title || `Clip ${index + 1}`}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {clip.duration || 30}s
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Virality Score: {clip.viralityScore ? (clip.viralityScore * 100).toFixed(0) + '%' : 'N/A'}
                </div>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleDownload(clip)}
                  className="w-full h-8 text-xs"
                >
                  <Download className="w-3 h-3 mr-2" />
                  Download Info
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Processing Message */}
      {data.executionResult?.message && data.executionStatus === 'completed' && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
          {data.executionResult.message}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} id="in" className="!bg-indigo-500" />
      <Handle type="source" position={Position.Bottom} id="out" className="!bg-indigo-500" />
    </div>
  );
};

export default CaptionAdderNode;
