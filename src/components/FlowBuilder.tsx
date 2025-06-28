import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeTypes from "./node-types";
import Sidebar from "./Sidebar";
import NodePanel from "./NodePanel";
import IntegrationPanel from "./IntegrationPanel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { initialNodes, initialEdges } from "./initial-elements";
import {
  Menu,
  X,
  ZoomIn,
  ZoomOut,
  Save,
  Play,
  Globe,
  Zap,
  Home,
} from "lucide-react";
import FlowTestModal from "./FlowTestModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useFlowExecution } from "@/hooks/useFlowExecution";
import { useFlowStorage } from "@/hooks/useFlowStorage";
import { getNodeDescription } from "@/utils/flowUtils";
import { FlowNode } from "@/services/flowExecutionService";
import { Workflow } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contextMenuEdge, setContextMenuEdge] = useState<any>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [connectionType, setConnectionType] = useState<
    "smoothstep" | "straight"
  >("smoothstep");
  const flowInstance = useRef<any>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Use custom hooks
  const { isRunning, executionResults, runFlowWithInputs } = useFlowExecution(
    nodes,
    edges,
    setNodes
  );
  const { savedFlows, saveFlow, loadFlow, loadTemplate, arrangeNodes } =
    useFlowStorage();

  const flowData = useMemo(() => ({ nodes, edges }), [nodes, edges]);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Update existing edges when connection type changes
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        type: connectionType,
        className: "animated",
      }))
    );
  }, [connectionType, setEdges]);

  // Clean up function to remove edges targeting input nodes
  const cleanupInputNodeEdges = useCallback((edges: any[]) => {
    return edges.filter(edge => {
      // Remove any edges that target input nodes (since input nodes should not have incoming connections)
      const targetNode = nodes.find(node => node.id === edge.target);
      if (targetNode && targetNode.type === 'input') {
        console.log(`Removing problematic edge targeting input node: ${edge.id}`);
        return false;
      }
      return true;
    });
  }, [nodes]);

  // Load last flow on mount
  useEffect(() => {
    try {
      const lastFlow = localStorage.getItem("ai-flow");
      if (lastFlow) {
        const flowData = JSON.parse(lastFlow);
        if (flowData.nodes && flowData.edges) {
          // Comprehensive edge cleanup before setting them
          const cleanedEdges = flowData.edges.filter((edge: any) => {
            const sourceNode = flowData.nodes.find((node: any) => node.id === edge.source);
            const targetNode = flowData.nodes.find((node: any) => node.id === edge.target);
            
            // Remove edges that target input nodes (input nodes should only be starting points)
            if (targetNode && targetNode.type === 'input') {
              console.log(`Removing problematic edge targeting input node: ${edge.id}`);
              return false;
            }
            
            // Remove edges that source from output nodes (output nodes should only be ending points)
            if (sourceNode && sourceNode.type === 'output') {
              console.log(`Removing problematic edge sourcing from output node: ${edge.id}`);
              return false;
            }
            
            // Remove self-referencing edges
            if (edge.source === edge.target) {
              console.log(`Removing self-referencing edge: ${edge.id}`);
              return false;
            }
            
            // Remove edges where source or target node doesn't exist
            if (!sourceNode || !targetNode) {
              console.log(`Removing edge with missing nodes: ${edge.id}`);
              return false;
            }
            
            return true;
          });
          
          // If we cleaned up edges, save the cleaned version
          if (cleanedEdges.length !== flowData.edges.length) {
            const cleanedFlowData = {
              nodes: flowData.nodes,
              edges: cleanedEdges
            };
            localStorage.setItem('ai-flow', JSON.stringify(cleanedFlowData));
            console.log(`Cleaned up ${flowData.edges.length - cleanedEdges.length} problematic edges`);
          }
          
          setNodes(flowData.nodes);
          setEdges(cleanedEdges);
          toast({
            title: "Flow loaded",
            description: "Your last saved flow has been loaded and cleaned up",
          });
        }
      }
    } catch (error) {
      console.error("Error loading saved flows:", error);
    }
  }, [setNodes, setEdges, toast]);

  const onConnect = useCallback(
    (params: any) => {
      // Validate connection before creating it
      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);
      
      // Prevent connections to input nodes
      if (targetNode && targetNode.type === 'input') {
        toast({
          title: "Invalid Connection",
          description: "Input nodes can only be starting points and cannot receive connections",
          variant: "destructive"
        });
        return;
      }
      
      // Prevent connections from output nodes
      if (sourceNode && sourceNode.type === 'output') {
        toast({
          title: "Invalid Connection", 
          description: "Output nodes can only be ending points and cannot connect to other nodes",
          variant: "destructive"
        });
        return;
      }
      
      // Prevent self-connections
      if (params.source === params.target) {
        toast({
          title: "Invalid Connection",
          description: "Nodes cannot connect to themselves",
          variant: "destructive"
        });
        return;
      }
      
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            type: connectionType,
            style: {
              stroke: "#00ff88",
              strokeWidth: 3,
              filter: "drop-shadow(0 0 4px rgba(0, 255, 136, 0.3))",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 24,
              height: 24,
              color: "#00ff88",
            },
            className: "animated",
          },
          eds
        )
      );
    },
    [setEdges, connectionType, nodes, toast]
  );

  const onNodeClick = useCallback(
    (event: any, node: any) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: any) => {
      event.preventDefault();
      setContextMenuEdge(edge);
    },
    []
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
      setContextMenuEdge(null);
      toast({
        title: "Connection deleted",
        description: "The connection has been removed from your flow",
      });
    },
    [setEdges, toast]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;
      const position = {
        x:
          event.clientX -
          (event.currentTarget as Element).getBoundingClientRect().left -
          20,
        y:
          event.clientY -
          (event.currentTarget as Element).getBoundingClientRect().top -
          40,
      };

      // Generate a unique ID
      const id = `${type}-${Date.now()}`;

      // Create the new node with the proper type structure
      const newNode: FlowNode = {
        id,
        type,
        position,
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          description: getNodeDescription(type),
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleSaveFlow = () => {
    saveFlow(nodes, edges);
  };

  const handleLoadFlow = (index: number) => {
    loadFlow(index, setNodes, setEdges);
  };

  const handleLoadTemplate = (templateData: any) => {
    loadTemplate(templateData, setNodes, setEdges);
    setSelectedNode(null);

    // Don't auto-arrange again since loadTemplate already does the arrangement
    // This prevents the arranged positions from being overwritten
  };

  const runFlow = () => {
    setShowTestModal(true);
  };

  const clearCanvas = () => {
    if (nodes.length === 0) return;
    if (confirm("Are you sure you want to clear the canvas?")) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  };

  const closeNodePanel = () => {
    setSelectedNode(null);
  };

  return (
    <div className="flex h-screen matrix-bg">
      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={toggleSidebar} />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-black border-r border-green-600/30">
            <Sidebar
              savedFlows={savedFlows}
              onLoadFlow={handleLoadFlow}
              onLoadTemplate={handleLoadTemplate}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "w-0" : "w-80"
          } border-r border-green-600/30`}
        >
          {!sidebarCollapsed && (
            <Sidebar
              savedFlows={savedFlows}
              onLoadFlow={handleLoadFlow}
              onLoadTemplate={handleLoadTemplate}
            />
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col h-full min-w-0">
        {/* Header */}
        <div className="border-b border-green-600/30 matrix-bg-glass backdrop-blur-xl p-2 sm:p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="matrix-button touch-target"
              >
                {sidebarCollapsed ? <Menu /> : <X />}
              </Button>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center matrix-border-glow">
                  <Workflow className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
                </div>
                <div>
                  <h1 className="font-bold matrix-text-glow text-sm sm:text-base lg:text-lg">
                    autoa.fun
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className="text-green-400/70 font-mono text-xs hidden sm:block">
                      AI Workflow Builder
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="matrix-button touch-target"
                size={isMobile ? "sm" : "default"}
                title="Go to Homepage"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <Button
                variant="outline"
                onClick={clearCanvas}
                className="matrix-button touch-target"
                size={isMobile ? "sm" : "default"}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setConnectionType(
                    connectionType === "smoothstep" ? "straight" : "smoothstep"
                  )
                }
                className="matrix-button touch-target"
                size={isMobile ? "sm" : "default"}
                title={`Switch to ${
                  connectionType === "smoothstep" ? "straight" : "curved"
                } connections`}
              >
                <div className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 flex items-center justify-center">
                  {connectionType === "smoothstep" ? "〰️" : "📏"}
                </div>
                <span className="hidden sm:inline">
                  {connectionType === "smoothstep" ? "Curved" : "Straight"}
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveFlow}
                className="matrix-button touch-target"
                size={isMobile ? "sm" : "default"}
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button
                variant="outline"
                className="matrix-button touch-target hidden sm:flex"
                onClick={() => setShowDeployModal(true)}
                size={isMobile ? "sm" : "default"}
              >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Deploy</span>
              </Button>
              <Button
                onClick={runFlow}
                disabled={nodes.length === 0}
                className="matrix-button matrix-border-glow touch-target"
                size={isMobile ? "sm" : "default"}
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Test</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 h-full relative">
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div
                  className="flex-1 h-full"
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                >
                  <ReactFlow
                    ref={flowInstance}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onEdgeContextMenu={onEdgeContextMenu}
                    nodeTypes={NodeTypes}
                    fitView
                    className="bg-transparent"
                  >
                    <Controls className="react-flow__controls" />
                    <MiniMap
                      className="react-flow__minimap !bg-black/80 !border !border-green-600/30"
                      nodeColor={() => "#00ff00"}
                      maskColor="rgba(0, 0, 0, 0.8)"
                      pannable
                      zoomable
                    />
                    <Background
                      variant={BackgroundVariant.Dots}
                      color="#00ff00"
                      gap={20}
                      size={1}
                    />

                    <Panel
                      position="top-left"
                      className="matrix-bg-glass matrix-border rounded-lg backdrop-blur-xl p-2 sm:p-4"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-4 w-4 sm:h-6 sm:w-6 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                          <Zap className="h-2 w-2 sm:h-3 sm:w-3 text-black" />
                        </div>
                        <div>
                          <p className="matrix-text font-bold text-xs sm:text-sm">
                            {isMobile ? "DRAG" : "DRAG COMPONENTS"}
                          </p>
                          <p className="text-green-400/70 font-mono text-xs hidden sm:block">
                            {nodes.length > 0
                              ? `${nodes.length} nodes • ${edges.length} connections`
                              : "Build your AI workflow"}
                          </p>
                        </div>
                      </div>
                    </Panel>

                    <Panel
                      position="bottom-right"
                      className="matrix-bg-glass matrix-border rounded-lg backdrop-blur-xl p-2 sm:p-3"
                    >
                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="matrix-button touch-target p-1 sm:p-2"
                          onClick={() => {
                            const el =
                              document.querySelector(".react-flow__pane");
                            if (el)
                              el.dispatchEvent(
                                new WheelEvent("wheel", {
                                  deltaY: -100,
                                  ctrlKey: true,
                                })
                              );
                          }}
                        >
                          <ZoomIn size={12} className="sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="matrix-button touch-target p-1 sm:p-2"
                          onClick={() => {
                            const el =
                              document.querySelector(".react-flow__pane");
                            if (el)
                              el.dispatchEvent(
                                new WheelEvent("wheel", {
                                  deltaY: 100,
                                  ctrlKey: true,
                                })
                              );
                          }}
                        >
                          <ZoomOut size={12} className="sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </Panel>
                  </ReactFlow>
                </div>
              </ContextMenuTrigger>
              {contextMenuEdge && (
                <ContextMenuContent className="matrix-dropdown">
                  <ContextMenuItem
                    onClick={() => deleteEdge(contextMenuEdge.id)}
                    className="matrix-dropdown-item"
                  >
                    Delete Connection
                  </ContextMenuItem>
                </ContextMenuContent>
              )}
            </ContextMenu>
          </div>

          {/* Node Panel */}
          {selectedNode && (
            <div
              className={`${
                isMobile
                  ? "fixed inset-x-0 bottom-0 top-auto h-3/4 z-40 rounded-t-xl"
                  : "w-80 h-full"
              }`}
            >
              <NodePanel
                node={selectedNode}
                setNodes={setNodes}
                onClose={closeNodePanel}
              />
            </div>
          )}
        </div>
      </div>

      {/* Deploy Modal - Controlled with no animations */}
      {showDeployModal && (
        <IntegrationPanel
          nodes={nodes}
          edges={edges}
          onClose={() => setShowDeployModal(false)}
        />
      )}

      {/* Test Modal */}
      <FlowTestModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        nodes={nodes}
        edges={edges}
        onRunFlow={runFlowWithInputs}
        isRunning={isRunning}
        executionResults={executionResults}
      />
    </div>
  );
};

export default FlowBuilder;
