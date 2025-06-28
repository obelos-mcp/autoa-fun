import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SavedFlow {
  name: string;
  data: any;
}

// Enhanced node arrangement with multiple layout strategies
const arrangeNodesIntelligent = (nodes: any[], edges: any[], layoutType: 'flow' | 'hierarchical' | 'circular' | 'grid' = 'flow') => {
  if (!nodes || nodes.length === 0) return nodes;

  const arrangedNodes = [...nodes];
  
  switch (layoutType) {
    case 'hierarchical':
      return arrangeHierarchical(arrangedNodes, edges);
    case 'circular':
      return arrangeCircular(arrangedNodes, edges);
    case 'grid':
      return arrangeGrid(arrangedNodes);
    default:
      return arrangeFlowOptimized(arrangedNodes, edges);
  }
};

// Enhanced flow-based arrangement with proper left-to-right flow
const arrangeFlowOptimized = (nodes: any[], edges: any[]) => {
  const nodeSpacing = {
    horizontal: 350, // Good spacing between columns
    vertical: 150,   // Vertical spacing between nodes in same column
    startX: 100,     // Left margin
    startY: 100      // Top margin
  };

  // Create connection maps
  const outgoing = new Map(); // source -> [targets]
  const incoming = new Map(); // target -> [sources]
  
  nodes.forEach(node => {
    outgoing.set(node.id, []);
    incoming.set(node.id, []);
  });

  edges.forEach(edge => {
    if (outgoing.has(edge.source) && incoming.has(edge.target)) {
      outgoing.get(edge.source).push(edge.target);
      incoming.get(edge.target).push(edge.source);
    }
  });

  // Find input nodes (no incoming connections) and output nodes (no outgoing connections)
  const inputNodes = nodes.filter(node => incoming.get(node.id).length === 0);
  const outputNodes = nodes.filter(node => outgoing.get(node.id).length === 0);
  
  // If no clear inputs, treat first node as input
  if (inputNodes.length === 0 && nodes.length > 0) {
    inputNodes.push(nodes[0]);
  }

  // Build levels using BFS from input nodes
  const levels = new Map();
  const visited = new Set();
  const nodeToLevel = new Map();

  // Start with input nodes at level 0
  const queue = inputNodes.map(node => ({ node, level: 0 }));
  
  while (queue.length > 0) {
    const { node, level } = queue.shift()!;
    
    if (visited.has(node.id)) continue;
    visited.add(node.id);
    
    // Add to level
    if (!levels.has(level)) {
      levels.set(level, []);
    }
    levels.get(level).push(node);
    nodeToLevel.set(node.id, level);
    
    // Add connected nodes to next level
    const connections = outgoing.get(node.id) || [];
    connections.forEach(targetId => {
      if (!visited.has(targetId)) {
        queue.push({ node: nodes.find(n => n.id === targetId)!, level: level + 1 });
      }
    });
  }

  // Add any unvisited nodes to the end
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      const maxLevel = Math.max(...Array.from(levels.keys()), -1);
      const newLevel = maxLevel + 1;
      if (!levels.has(newLevel)) {
        levels.set(newLevel, []);
      }
      levels.get(newLevel).push(node);
      nodeToLevel.set(node.id, newLevel);
    }
  });

  // Position nodes in each level
  levels.forEach((levelNodes, level) => {
    // Sort nodes in each level by type priority for better visual flow
    const sortedNodes = levelNodes.sort((a, b) => {
      const priority = {
        'input': 0, 'youtubeinput': 0, 'stockdata': 0, 'calendartrigger': 0,
        'system': 1, 'aimodel': 1,
        'action': 2, 'condition': 2,
        'output': 3, 'pdfgenerator': 3, 'notification': 3, 'datalogger': 3, 'socialmedia': 3
      };
      return (priority[a.type] || 2) - (priority[b.type] || 2);
    });

    const totalHeight = (sortedNodes.length - 1) * nodeSpacing.vertical;
    const startY = nodeSpacing.startY + Math.max(0, (200 - totalHeight) / 2); // Center vertically if few nodes
    
    sortedNodes.forEach((node, index) => {
      const x = nodeSpacing.startX + (level * nodeSpacing.horizontal);
      const y = startY + (index * nodeSpacing.vertical);
      
      // Update node position
      const nodeIndex = nodes.findIndex(n => n.id === node.id);
      if (nodeIndex !== -1) {
        nodes[nodeIndex].position = { x, y };
      }
    });
  });

  return nodes;
};

// Hierarchical tree layout with proper left-to-right flow
const arrangeHierarchical = (nodes: any[], edges: any[]) => {
  const spacing = { horizontal: 300, vertical: 120, startX: 100, startY: 100 };
  
  // Build parent-child relationships
  const children = new Map();
  const parents = new Map();
  
  nodes.forEach(node => {
    children.set(node.id, []);
    parents.set(node.id, null);
  });
  
  edges.forEach(edge => {
    children.get(edge.source)?.push(edge.target);
    parents.set(edge.target, edge.source);
  });
  
  // Find root nodes (no parents)
  const roots = nodes.filter(node => parents.get(node.id) === null);
  if (roots.length === 0 && nodes.length > 0) {
    roots.push(nodes[0]);
  }
  
  // Calculate positions using recursive tree layout
  const positions = new Map();
  let nextY = spacing.startY;
  
  const layoutSubtree = (nodeId: string, x: number): number => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return nextY;
    
    const nodeChildren = children.get(nodeId) || [];
    
    if (nodeChildren.length === 0) {
      // Leaf node
      positions.set(nodeId, { x, y: nextY });
      nextY += spacing.vertical;
      return nextY - spacing.vertical;
    } else {
      // Internal node - layout children first
      const childStartY = nextY;
      let childEndY = nextY;
      
      nodeChildren.forEach(childId => {
        childEndY = Math.max(childEndY, layoutSubtree(childId, x + spacing.horizontal));
      });
      
      // Position this node at the center of its children
      const centerY = (childStartY + childEndY) / 2;
      positions.set(nodeId, { x, y: centerY });
      
      return childEndY;
    }
  };
  
  // Layout each root tree
  roots.forEach(root => {
    layoutSubtree(root.id, spacing.startX);
    nextY += spacing.vertical; // Add space between root trees
  });
  
  // Apply positions
  nodes.forEach(node => {
    const pos = positions.get(node.id);
    if (pos) {
      node.position = pos;
    }
  });
  
  return nodes;
};

// Simple grid layout
const arrangeGrid = (nodes: any[]) => {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const spacing = { horizontal: 300, vertical: 150, startX: 100, startY: 100 };
  
  nodes.forEach((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    node.position = {
      x: spacing.startX + col * spacing.horizontal,
      y: spacing.startY + row * spacing.vertical
    };
  });
  
  return nodes;
};

// Circular layout
const arrangeCircular = (nodes: any[], edges: any[]) => {
  const centerX = 400;
  const centerY = 300;
  const radius = Math.max(150, nodes.length * 25);
  
  nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    node.position = { x, y };
  });
  
  return nodes;
};

export const useFlowStorage = () => {
  const [savedFlows, setSavedFlows] = useState<SavedFlow[]>([]);
  const { toast } = useToast();

  // Load saved flows from localStorage on mount
  useEffect(() => {
    try {
      const savedFlowsData = localStorage.getItem('saved-flows');
      if (savedFlowsData) {
        setSavedFlows(JSON.parse(savedFlowsData));
      }
    } catch (error) {
      console.error("Error loading saved flows:", error);
    }
  }, []);

  const saveFlow = useCallback((nodes: any[], edges: any[]) => {
    const flowData = { nodes, edges };
    localStorage.setItem('ai-flow', JSON.stringify(flowData));

    // Show a prompt to name and save the flow
    const flowName = prompt("Enter a name for this flow:", "Flow " + (savedFlows.length + 1));
    if (flowName) {
      const newSavedFlows = [...savedFlows, {
        name: flowName,
        data: flowData
      }];
      setSavedFlows(newSavedFlows);
      localStorage.setItem('saved-flows', JSON.stringify(newSavedFlows));
    }
    toast({
      title: "Flow saved",
      description: "Your AI flow has been saved successfully"
    });
  }, [savedFlows, toast]);

  const loadFlow = useCallback((index: number, setNodes: any, setEdges: any) => {
    try {
      const flow = savedFlows[index].data;
      
      // Clean up any problematic edges that target input nodes
      const cleanedEdges = flow.edges.filter((edge: any) => {
        const targetNode = flow.nodes.find((node: any) => node.id === edge.target);
        if (targetNode && targetNode.type === 'input') {
          console.log(`Removing problematic edge targeting input node in saved flow: ${edge.id}`);
          return false;
        }
        return true;
      });

      setNodes(flow.nodes);
      setEdges(cleanedEdges);
      
      // Update localStorage with cleaned flow
      const cleanedFlow = { nodes: flow.nodes, edges: cleanedEdges };
      localStorage.setItem('ai-flow', JSON.stringify(cleanedFlow));
      
      toast({
        title: "Flow loaded",
        description: `${savedFlows[index].name} has been loaded and cleaned up successfully`
      });
    } catch (error) {
      console.error("Error loading flow:", error);
      toast({
        title: "Error",
        description: "Failed to load the flow"
      });
    }
  }, [savedFlows, toast]);

  const loadTemplate = useCallback((templateData: any, setNodes: any, setEdges: any) => {
    try {
      if (templateData.nodes && templateData.edges) {
        // Comprehensive edge cleanup
        const cleanedEdges = templateData.edges.filter((edge: any) => {
          const sourceNode = templateData.nodes.find((node: any) => node.id === edge.source);
          const targetNode = templateData.nodes.find((node: any) => node.id === edge.target);
          
          // Remove edges that target input nodes (input nodes should only be starting points)
          if (targetNode && targetNode.type === 'input') {
            console.log(`Removing problematic edge targeting input node in template: ${edge.id}`);
            return false;
          }
          
          // Remove edges that source from output nodes (output nodes should only be ending points)
          if (sourceNode && sourceNode.type === 'output') {
            console.log(`Removing problematic edge sourcing from output node in template: ${edge.id}`);
            return false;
          }
          
          // Remove self-referencing edges
          if (edge.source === edge.target) {
            console.log(`Removing self-referencing edge in template: ${edge.id}`);
            return false;
          }
          
          // Remove edges where source or target node doesn't exist
          if (!sourceNode || !targetNode) {
            console.log(`Removing edge with missing nodes in template: ${edge.id}`);
            return false;
          }
          
          return true;
        });

        // Use intelligent arrangement with flow optimization
        const arrangedNodes = arrangeNodesIntelligent(templateData.nodes, cleanedEdges, 'flow');
        
        setNodes(arrangedNodes);
        setEdges(cleanedEdges);

        // Save the loaded template as current flow with arranged positions and cleaned edges
        const arrangedTemplateData = {
          nodes: arrangedNodes,
          edges: cleanedEdges
        };
        localStorage.setItem('ai-flow', JSON.stringify(arrangedTemplateData));
        
        toast({
          title: "Template loaded",
          description: "Template arranged with optimized layout and cleaned up",
        });
      }
    } catch (error) {
      console.error("Error loading template:", error);
      toast({
        title: "Error",
        description: "Failed to load the template",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Enhanced arrange function with layout options
  const arrangeNodes = useCallback((nodes: any[], edges: any[], layoutType: 'flow' | 'hierarchical' | 'circular' | 'grid' = 'flow') => {
    return arrangeNodesIntelligent(nodes, edges, layoutType);
  }, []);

  return {
    savedFlows,
    saveFlow,
    loadFlow,
    loadTemplate,
    arrangeNodes // Export for use in FlowBuilder
  };
};
