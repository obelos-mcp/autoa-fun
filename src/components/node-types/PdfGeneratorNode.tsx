
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

const PdfGeneratorNode = ({ data }: { data: any }) => {
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

  const extractVideoContent = () => {
    const result = data.executionResult;
    console.log('PDF Generator extracting content from:', result);
    
    // Handle AI model processed content first (highest priority)
    if (result?.processedContent) {
      return {
        title: result.videoInfo?.title || 'AI Processed Summary',
        content: result.processedContent,
        videoInfo: result.videoInfo,
        type: `AI Summary (${result.wordCount || 'unknown'} words)`,
        instructions: result.instructions
      };
    }
    
    // Handle different possible data structures from the flow
    if (result?.aiSummary || result?.videoDetails) {
      return {
        title: result.videoDetails?.title || 'Video Analysis',
        content: result.aiSummary || result.transcript || 'Video content analysis',
        videoInfo: result.videoDetails,
        type: 'AI Video Summary'
      };
    }
    
    // Handle transcript data
    if (result?.transcript) {
      return {
        title: result.videoDetails?.title || 'Video Transcript',
        content: result.transcript,
        videoInfo: result.videoDetails,
        type: 'Video Transcript'
      };
    }
    
    // Handle direct string content
    if (typeof result === 'string') {
      return {
        title: 'Video Content',
        content: result,
        type: 'Analysis'
      };
    }
    
    // Handle nested result structures
    if (result && typeof result === 'object') {
      const possibleContent = result.content || result.summary || result.text || result.data;
      if (possibleContent) {
        return {
          title: result.title || 'Content Summary',
          content: possibleContent,
          type: 'Summary'
        };
      }
    }
    
    return {
      title: 'Video Content',
      content: 'No content available for PDF generation. Make sure the YouTube URL analysis and AI processing completed successfully.',
      type: 'Error'
    };
  };

  const handleDownload = () => {
    const { title, content, videoInfo, type, instructions } = extractVideoContent();
    console.log('Generating PDF with:', { title, content: content.substring(0, 100), videoInfo, instructions });
    
    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 30;
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yPosition);
    yPosition += 15;
    
    // Type and date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`${type} • Generated ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 10;
    
    // Instructions if available
    if (instructions) {
      doc.text(`Processing Instructions: ${instructions}`, margin, yPosition);
      yPosition += 7;
    }
    
    // Video info if available
    if (videoInfo) {
      doc.text(`Channel: ${videoInfo.channelTitle || 'Unknown'}`, margin, yPosition);
      yPosition += 7;
      if (videoInfo.duration) {
        const minutes = Math.floor(videoInfo.duration / 60);
        const seconds = videoInfo.duration % 60;
        doc.text(`Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`, margin, yPosition);
        yPosition += 7;
      }
      if (videoInfo.viewCount) {
        doc.text(`Views: ${videoInfo.viewCount.toLocaleString()}`, margin, yPosition);
        yPosition += 7;
      }
    }
    
    yPosition += 10;
    
    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const splitText = doc.splitTextToSize(content, maxWidth);
    const lineHeight = 6;
    
    for (let i = 0; i < splitText.length; i++) {
      if (yPosition > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.text(splitText[i], margin, yPosition);
      yPosition += lineHeight;
    }
    
    // Generate and download
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.pdf`;
    doc.save(fileName);
  };

  // More permissive content check
  const hasContent = data.executionResult || data.executionStatus === 'completed';
  const contentPreview = hasContent && data.executionResult ? extractVideoContent() : null;

  return (
    <div className="bg-black text-white rounded-xl p-4 border border-white/20 min-w-[200px]">
      <div className="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-red-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" x2="8" y1="13" y2="13"/>
          <line x1="16" x2="8" y1="17" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
        <div className="font-medium text-white">{data.label}</div>
      </div>
      
      <div className="text-sm text-gray-300 mb-3">{data.description}</div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        <Badge variant="outline" className="bg-background/30 text-xs border-white/20 text-white">
          PDF Generator
        </Badge>
        <Badge variant="outline" className="bg-background/30 text-xs border-white/20 text-white">
          Download
        </Badge>
      </div>
      
      <div className="text-xs text-gray-400 mb-3">
        Generates formatted PDF from video content
      </div>
      
      {data.executionStatus && (
        <div className={`text-xs mb-3 ${getStatusStyles()}`}>
          {data.executionStatus === 'completed' ? '✓ PDF Ready for Download' : 
           data.executionStatus === 'error' ? '✗ Generation Failed' : 
           '⟳ Processing Content'}
        </div>
      )}

      {/* Show content preview when available */}
      {contentPreview && contentPreview.content !== 'No content available for PDF generation. Make sure the YouTube URL analysis and AI processing completed successfully.' && (
        <div className="mb-3 p-2 bg-gray-800 rounded text-xs">
          <div className="font-medium text-green-400 mb-1">Content Preview:</div>
          <div className="text-gray-300 line-clamp-3">
            {contentPreview.content.substring(0, 120) + '...'}
          </div>
          {contentPreview.instructions && (
            <div className="text-blue-300 text-xs mt-1">
              Instructions: {contentPreview.instructions}
            </div>
          )}
        </div>
      )}

      {hasContent && (
        <Button 
          onClick={handleDownload}
          size="sm"
          variant="outline"
          className="w-full text-xs border-white/30 text-white hover:bg-white/10"
        >
          <Download className="w-3 h-3 mr-1" />
          Download PDF
        </Button>
      )}
      
      <Handle type="target" position={Position.Top} id="in" style={{ top: 0 }} />
      <Handle type="source" position={Position.Bottom} id="out" style={{ bottom: 0 }} />
    </div>
  );
};

export default PdfGeneratorNode;
