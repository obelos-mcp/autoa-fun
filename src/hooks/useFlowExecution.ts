
import { useState, useCallback } from 'react';
import { FlowExecutionService, FlowNode } from '@/services/flowExecutionService';
import { useToast } from '@/hooks/use-toast';

export const useFlowExecution = (
  nodes: FlowNode[],
  edges: any[],
  setNodes: (updater: (nodes: FlowNode[]) => FlowNode[]) => void
) => {
  const [isRunning, setIsRunning] = useState(false);
  const [executionResults, setExecutionResults] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const runFlowWithInputs = useCallback(async (customInputs: Record<string, any>) => {
    setIsRunning(true);
    setExecutionResults({});

    // Reset all nodes to waiting state
    setNodes(nds => nds.map(n => ({
      ...n,
      data: {
        ...n.data,
        executionStatus: 'waiting',
        executionResult: undefined,
        executionError: undefined
      },
      style: {
        ...n.style,
        boxShadow: undefined
      }
    })));
    
    try {
      const processedResults: Record<string, any> = {};

      // Step 1: Process nodes with custom inputs (prioritize callautomation if it has direct inputs)
      console.log('Step 1: Processing nodes with custom inputs...');
      
      // Check if callautomation node has direct custom inputs
      const callautomationNodes = nodes.filter(node => node.type === 'callautomation');
      
      for (const node of callautomationNodes) {
        const customInput = customInputs[node.id];
        if (customInput && customInput.phone_number && customInput.task) {
          console.log(`Processing callautomation node ${node.id} with direct custom inputs:`, customInput);
          
          const result = await FlowExecutionService.processNodeWithCustomInput(
            node, 
            customInput, 
            setNodes, 
            setExecutionResults
          );
          processedResults[node.id] = result;
          console.log(`Callautomation node ${node.id} completed:`, result);
        }
      }
      
      // Process other input nodes with custom inputs
      const inputNodes = nodes.filter(node => 
        ['input', 'system', 'youtubeinput', 'localfilesaver'].includes(node.type) &&
        !processedResults[node.id] // Skip if already processed
      );
      
      for (const node of inputNodes) {
        const customInput = customInputs[node.id];
        console.log(`Processing input node ${node.id} with input:`, customInput);
        
        const result = await FlowExecutionService.processNodeWithCustomInput(
          node, 
          customInput, 
          setNodes, 
          setExecutionResults
        );
        processedResults[node.id] = result;
        console.log(`Input node ${node.id} completed:`, result);
      }

      // Step 2: Process remaining nodes in dependency order
      console.log('Step 2: Processing remaining nodes...');
      const remainingNodes = nodes.filter(node => 
        !['input', 'system', 'youtubeinput', 'localfilesaver', 'callautomation'].includes(node.type) ||
        (node.type === 'callautomation' && !processedResults[node.id]) // Include callautomation if not already processed
      );
      
      // Create a topological sort based on edges
      const getNodeDependencies = (nodeId: string) => {
        return edges.filter(edge => edge.target === nodeId).map(edge => edge.source);
      };

      const processedNodeIds = new Set(Object.keys(processedResults));
      const nodesToProcess = [...remainingNodes];

      while (nodesToProcess.length > 0) {
        const initialLength = nodesToProcess.length;
        
        for (let i = nodesToProcess.length - 1; i >= 0; i--) {
          const node = nodesToProcess[i];
          const dependencies = getNodeDependencies(node.id);
          
          // Check if all dependencies are processed
          const allDependenciesProcessed = dependencies.every(depId => processedNodeIds.has(depId));
          
          if (allDependenciesProcessed) {
            console.log(`Processing node ${node.id} of type ${node.type}...`);
            
            // Collect inputs from dependencies
            const nodeInputs: Record<string, any> = {};
            dependencies.forEach(depId => {
              if (processedResults[depId]) {
                nodeInputs[depId] = processedResults[depId];
              }
            });

            console.log(`Node ${node.id} inputs:`, nodeInputs);

            try {
              const result = await FlowExecutionService.processNode(
                node, 
                nodeInputs, 
                setNodes, 
                nodes, 
                edges, 
                setExecutionResults
              );
              
              processedResults[node.id] = result;
              processedNodeIds.add(node.id);
              nodesToProcess.splice(i, 1);
              
              console.log(`Node ${node.id} completed successfully:`, result);
            } catch (error) {
              console.error(`Node ${node.id} failed:`, error);
              throw error;
            }
          }
        }

        // Prevent infinite loop - if no nodes were processed in this iteration
        if (nodesToProcess.length === initialLength) {
          const remainingNodeIds = nodesToProcess.map(n => n.id);
          console.error('Circular dependency or unresolved dependencies detected for nodes:', remainingNodeIds);
          throw new Error(`Cannot process nodes due to unresolved dependencies: ${remainingNodeIds.join(', ')}`);
        }
      }
      
      console.log('Flow execution completed successfully. Final results:', processedResults);
      
      toast({
        title: "Flow executed successfully",
        description: "All nodes have been processed"
      });
      
    } catch (error) {
      console.error('Flow execution failed:', error);
      toast({
        title: "Flow execution failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  }, [nodes, edges, setNodes, toast]);

  return {
    isRunning,
    executionResults,
    runFlowWithInputs,
    setExecutionResults
  };
};
