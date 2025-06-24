export const getNodeDescription = (type: string): string => {
  const descriptions: Record<string, string> = {
    input: 'Provide text input for your flow',
    output: 'Display the final result',
    system: 'System message or prompt',
    action: 'Perform an action',
    api: 'Make API calls',
    tool: 'Use external tools',
    condition: 'Add conditional logic',
    youtubeinput: 'Extract video information from YouTube URL',
    videofetcher: 'Download video from URL',
    videotranscriber: 'Convert video speech to text',
    viralclipdetector: 'Detect viral moments in video',
    autoclipper: 'Automatically clip best segments',
    captionadder: 'Add captions to video clips',
    localfilesaver: 'Generate video with autoa.fun and download',
    callautomation: 'AI-powered phone call automation with Bland Labs',
    aimodel: 'Use AI models for processing',
    memory: 'Store and retrieve data',
    vectorstore: 'Vector database operations',
    notification: 'Send notifications',
    datalogger: 'Log and track data',
    webhook: 'Handle webhook requests',
    telegramresponse: 'Send Telegram bot responses',
    telegramuserinput: 'Get input from Telegram users',
    telegramdata: 'Access Telegram message data',
    telegramcondition: 'Telegram-specific conditions',
    customcommands: 'Custom bot commands',
    calendartrigger: 'Schedule-based triggers',
    meetingcreator: 'Create calendar meetings',
    pdfgenerator: 'Generate PDF documents',
    mcp: 'Execute tools via Model Context Protocol'
  };
  
  return descriptions[type] || 'AI Flow Node';
};

export const validateFlow = (nodes: any[], edges: any[]): string[] => {
  const errors: string[] = [];
  
  // Check for disconnected nodes
  const connectedNodeIds = new Set();
  edges.forEach(edge => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });
  
  const disconnectedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
  if (disconnectedNodes.length > 0) {
    errors.push(`Disconnected nodes found: ${disconnectedNodes.map(n => n.data.label).join(', ')}`);
  }
  
  // Check for circular dependencies
  const hasCircularDependency = (nodeId: string, visited: Set<string>, path: Set<string>): boolean => {
    if (path.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    
    visited.add(nodeId);
    path.add(nodeId);
    
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    for (const edge of outgoingEdges) {
      if (hasCircularDependency(edge.target, visited, path)) {
        return true;
      }
    }
    
    path.delete(nodeId);
    return false;
  };
  
  const visited = new Set<string>();
  for (const node of nodes) {
    if (!visited.has(node.id) && hasCircularDependency(node.id, visited, new Set())) {
      errors.push('Circular dependency detected in flow');
      break;
    }
  }
  
  return errors;
};
