

import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileVideo, Clock, CheckCircle, XCircle, ExternalLink, Play, AlertCircle } from 'lucide-react';

const LocalFileSaverNode = ({ data }: { data: any }) => {
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
        return <Play className="w-3 h-3" />;
    }
  };

  const downloadVideo = async (file: any) => {
    try {
      console.log('Downloading video from:', file.downloadUrl);
      
      if (!file.downloadUrl) {
        throw new Error('No download URL available');
      }

      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.download = file.fileName || 'video.mp4';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Video download initiated for:', file.fileName);
    } catch (error) {
      console.error('Error downloading video:', error);
      alert(`Error downloading video: ${error.message}`);
    }
  };

  const openVideoPreview = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const savedFiles = data.executionResult?.savedFiles || [];

  return (
    <div className="bg-card border border-border rounded-lg p-4 min-w-[280px] shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <FileVideo className="w-5 h-5 text-purple-500" />
        <div className="font-medium text-foreground">{data.label || 'Video Creator'}</div>
      </div>
      
      <div className="text-sm text-muted-foreground mb-3">
        Generate video with Creatomate and download
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="outline" className="text-xs">
          MP4 Export
        </Badge>
        <Badge variant="outline" className="text-xs">
          Creatomate
        </Badge>
      </div>
      
      {/* Execution Status */}
      {data.executionStatus && (
        <div className={`flex items-center gap-2 mb-3 text-sm ${getStatusStyles()}`}>
          {getStatusIcon()}
          <span>
            {data.executionStatus === 'completed' ? 'Video Ready for Download' : 
             data.executionStatus === 'error' ? 'Video Creation Failed' : 
             'Creating Video with Creatomate...'}
          </span>
        </div>
      )}

      {!data.executionStatus && (
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Play className="w-3 h-3" />
          <span>Ready to create video</span>
        </div>
      )}

      {/* Error Message */}
      {data.executionStatus === 'error' && data.executionError && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-3 mb-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-600 dark:text-red-400">
              {data.executionError}
            </div>
          </div>
        </div>
      )}

      {/* Download Section */}
      {data.executionStatus === 'completed' && savedFiles.length > 0 && (
        <div className="border-t border-border pt-3">
          <div className="text-sm font-medium text-foreground mb-2">Ready for Download:</div>
          <div className="space-y-3">
            {savedFiles.map((file: any, index: number) => (
              <div key={index} className="bg-muted/30 rounded-md p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-foreground truncate pr-2">
                    {file.fileName}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {file.duration}s
                  </Badge>
                </div>
                
                {/* Video Preview */}
                {file.downloadUrl && (
                  <div className="w-full">
                    <video 
                      controls 
                      className="w-full h-32 bg-black rounded-md object-cover"
                      poster={file.snapshotUrl}
                      preload="metadata"
                      onError={(e) => console.error('Video load error:', e)}
                    >
                      <source src={file.downloadUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => downloadVideo(file)}
                    className="flex-1 h-8 text-xs"
                    disabled={!file.downloadUrl}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download MP4
                  </Button>
                  
                  {file.downloadUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openVideoPreview(file.downloadUrl)}
                      className="h-8 text-xs px-2"
                      title="Open in New Tab"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                {file.downloadUrl && (
                  <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    MP4 video ready - Creatomate CDN
                  </div>
                )}
                
                {!file.downloadUrl && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Video URL not available
                  </div>
                )}

                {file.renderId && (
                  <div className="text-xs text-muted-foreground">
                    Render ID: {file.renderId}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {data.executionResult?.message && data.executionStatus === 'completed' && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
          {data.executionResult.message}
        </div>
      )}

      {/* Instructions when not connected */}
      {!data.executionStatus && (
        <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/20 rounded">
          Connect to an Input node or use Test Flow to create videos with custom text content.
        </div>
      )}
      
      <Handle type="target" position={Position.Top} id="in" className="!bg-purple-500" />
      <Handle type="source" position={Position.Bottom} id="out" className="!bg-purple-500" />
    </div>
  );
};

export default LocalFileSaverNode;
