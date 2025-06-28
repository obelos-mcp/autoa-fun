export interface TemplateInfo {
  name: string;
  category: string;
  isBasicAIChat: boolean;
  isYouTubeAISummarizer: boolean;
  isWalletTransactionAnalyzer: boolean;
  supportedDeployments: string[];
}

export class TemplateDetectionService {
  static detectTemplate(nodes: any[], edges: any[]): TemplateInfo {
    // Check if it matches Basic AI Chat template structure
    const hasSystemNode = nodes.some(node => node.type === 'system');
    const hasInputNode = nodes.some(node => node.type === 'input');
    const hasAIModelNode = nodes.some(node => node.type === 'aimodel');
    const hasOutputNode = nodes.some(node => node.type === 'output');
    
    // Basic AI Chat has exactly these 4 nodes in this pattern
    if (hasSystemNode && hasInputNode && hasAIModelNode && hasOutputNode && nodes.length === 4) {
      // Verify the system node content matches Basic AI Chat
      const systemNode = nodes.find(node => node.type === 'system');
      const isBasicAIChatContent = systemNode?.data?.content?.includes('helpful AI assistant') || 
                                   systemNode?.data?.label === 'AI Personality';
      
      if (isBasicAIChatContent) {
        return {
          name: 'Basic AI Chat',
          category: 'Conversation',
          isBasicAIChat: true,
          isYouTubeAISummarizer: false,
          isWalletTransactionAnalyzer: false,
          supportedDeployments: ['telegram'] // Only Telegram Bot is supported
        };
      }
    }
    
    // Check for Wallet Transaction Analyzer - comprehensive detection
    const hasWalletInputNode = nodes.some(node => node.type === 'walletinput');
    const hasTransactionFetcherNode = nodes.some(node => node.type === 'transactionfetcher');
    const hasWalletAnalyticsNode = nodes.some(node => node.type === 'walletanalytics');
    const hasWalletReportNode = nodes.some(node => node.type === 'walletreport');
    
    const hasWalletNodes = nodes.some(node => 
      node.type === 'walletinput' || 
      node.type === 'transactionfetcher' ||
      node.type === 'walletanalytics' ||
      node.type === 'walletreport' ||
      node.data?.label?.toLowerCase().includes('wallet') ||
      node.data?.description?.toLowerCase().includes('wallet') ||
      node.data?.description?.toLowerCase().includes('transaction') ||
      node.data?.description?.toLowerCase().includes('blockchain')
    );
    
    // Wallet Transaction Analyzer detection - requires at least wallet input and one other wallet node
    if (hasWalletInputNode || (hasWalletNodes && nodes.length >= 2)) {
      // Additional validation for wallet workflow
      const walletRelatedNodes = nodes.filter(node => 
        node.type === 'walletinput' ||
        node.type === 'transactionfetcher' ||
        node.type === 'walletanalytics' ||
        node.type === 'walletreport' ||
        node.data?.label?.toLowerCase().includes('wallet') ||
        node.data?.description?.toLowerCase().includes('blockchain')
      );
      
      if (walletRelatedNodes.length >= 2 || hasWalletInputNode) {
        return {
          name: 'Wallet Transaction Analyzer',
          category: 'Blockchain Analytics',
          isBasicAIChat: false,
          isYouTubeAISummarizer: false,
          isWalletTransactionAnalyzer: true,
          supportedDeployments: ['telegram'] // Only Telegram Bot is supported for now
        };
      }
    }
    
    // Check for YouTube AI Summarizer - more comprehensive detection
    const hasYouTubeNodes = nodes.some(node => 
      node.type === 'youtubeinput' || 
      node.data?.label?.toLowerCase().includes('youtube') ||
      node.data?.description?.toLowerCase().includes('youtube') ||
      node.data?.content?.toLowerCase().includes('youtube')
    );
    
    const hasYouTubeInputNode = nodes.some(node => node.type === 'youtubeinput');
    const hasTextProcessingNodes = nodes.some(node => 
      node.type === 'textprocessor' || 
      node.type === 'summarizer' ||
      node.data?.label?.toLowerCase().includes('summary') ||
      node.data?.label?.toLowerCase().includes('summarize')
    );
    
    // YouTube AI Summarizer detection
    if (hasYouTubeNodes || hasYouTubeInputNode || hasTextProcessingNodes) {
      // Additional validation for YouTube workflow
      const systemNode = nodes.find(node => node.type === 'system');
      const isYouTubeSummarizerContent = systemNode?.data?.content?.toLowerCase().includes('youtube') ||
                                         systemNode?.data?.content?.toLowerCase().includes('video') ||
                                         systemNode?.data?.content?.toLowerCase().includes('summariz');
      
      if (hasYouTubeInputNode || isYouTubeSummarizerContent || hasYouTubeNodes) {
        return {
          name: 'YouTube AI Summarizer',
          category: 'Content Analysis',
          isBasicAIChat: false,
          isYouTubeAISummarizer: true,
          isWalletTransactionAnalyzer: false,
          supportedDeployments: ['telegram'] // Only Telegram Bot is supported for now
        };
      }
    }
    
    // Default for other templates
    return {
      name: 'Custom Workflow',
      category: 'Custom',
      isBasicAIChat: false,
      isYouTubeAISummarizer: false,
      isWalletTransactionAnalyzer: false,
      supportedDeployments: ['telegram', 'mcp'] // Limited for now
    };
  }
  
  static isDeploymentSupported(templateInfo: TemplateInfo, deploymentType: string): boolean {
    return templateInfo.supportedDeployments.includes(deploymentType);
  }
} 