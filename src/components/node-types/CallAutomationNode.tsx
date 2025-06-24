
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Download, FileText, ExternalLink } from 'lucide-react';

const CallAutomationNode = ({ data }: { data: any }) => {
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

  const handleDownloadRecording = () => {
    if (data.executionResult?.recording_url) {
      window.open(data.executionResult.recording_url, '_blank');
    }
  };

  const handleViewTranscript = () => {
    if (data.executionResult?.concatenated_transcript) {
      const transcriptWindow = window.open('', '_blank');
      if (transcriptWindow) {
        transcriptWindow.document.write(`
          <html>
            <head><title>Call Transcript</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
              <h2>Call Transcript</h2>
              <p><strong>Call ID:</strong> ${data.executionResult.call_id}</p>
              <p><strong>Duration:</strong> ${data.executionResult.call_length} minutes</p>
              <p><strong>From:</strong> ${data.executionResult.from}</p>
              <p><strong>To:</strong> ${data.executionResult.to}</p>
              <hr>
              <h3>Conversation:</h3>
              <pre style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${data.executionResult.concatenated_transcript}</pre>
            </body>
          </html>
        `);
      }
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-blue-900/90 to-blue-800/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 min-w-[200px] shadow-lg">
      <div className="flex items-center mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 mr-3">
          <Phone className="h-4 w-4 text-blue-300" />
        </div>
        <div>
          <div className="font-semibold text-white text-sm">{data.label}</div>
          <div className="text-blue-200 text-xs opacity-80">{data.description}</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        <Badge variant="outline" className="bg-blue-500/10 text-blue-200 border-blue-400/30 text-xs">
          AI Powered
        </Badge>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-400/30 text-xs">
          Voice Calls
        </Badge>
      </div>
      
      {data.executionResult && (
        <div className="mb-2 space-y-2">
          {data.executionResult.call_id ? (
            <div className="space-y-2">
              <div className="bg-green-500/10 border border-green-400/30 rounded px-2 py-1">
                <div className="text-green-300 text-xs">
                  <div>Call ID: {data.executionResult.call_id.substring(0, 8)}...</div>
                  <div>Duration: {data.executionResult.call_length} min</div>
                  <div>Status: {data.executionResult.status}</div>
                </div>
              </div>
              
              {data.executionResult.recording_url && (
                <Button
                  onClick={handleDownloadRecording}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs bg-blue-500/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download Recording
                </Button>
              )}
              
              {data.executionResult.concatenated_transcript && (
                <Button
                  onClick={handleViewTranscript}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs bg-purple-500/10 border-purple-400/30 text-purple-200 hover:bg-purple-500/20"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  View Transcript
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-blue-500/10 border border-blue-400/30 rounded px-2 py-1">
              <span className="text-blue-300 text-xs">Ready to Call</span>
            </div>
          )}
        </div>
      )}
      
      {data.executionStatus && (
        <div className={`text-xs font-medium flex items-center gap-1 ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? (
            <>
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Call Completed
            </>
          ) : data.executionStatus === 'error' ? (
            <>
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              Call Failed
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Calling...
            </>
          )}
        </div>
      )}
      
      <Handle 
        type="target" 
        position={Position.Top} 
        id="in" 
        className="w-3 h-3 bg-blue-500 border-2 border-blue-300" 
        style={{ top: -6 }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="out" 
        className="w-3 h-3 bg-blue-500 border-2 border-blue-300" 
        style={{ bottom: -6 }} 
      />
    </div>
  );
};

export default CallAutomationNode;
