import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import {
  Globe,
  Server,
  Play,
  Square,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Code,
  BookOpen,
  Activity
} from "lucide-react";
import { APIService } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

const APIDeploymentNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [apiName, setApiName] = useState(data.apiName || "YouTube AI Summarizer");
  const [apiPath, setApiPath] = useState(data.apiPath || "/api/youtube/summarize");
  const [apiMethod, setApiMethod] = useState(data.apiMethod || "POST");
  const [description, setDescription] = useState(
    data.description || "Analyze and summarize YouTube videos using AI"
  );
  const [isDeployed, setIsDeployed] = useState(false);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [testUrl, setTestUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check server status on component mount
    const status = APIService.getServerStatus();
    setServerStatus(status);
    setIsDeployed(status.running);
  }, []);

  const deployAPI = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Deploying YouTube AI Summarizer API...');
      
      // Start the API server
      const serverMessage = await APIService.startAPIServer();
      console.log(serverMessage);
      
      // Get the deployed endpoint
      const endpoint = APIService.getEndpoint('youtube-ai-summarizer');
      setDeploymentResult(endpoint);
      setIsDeployed(true);
      
      // Update server status
      const status = APIService.getServerStatus();
      setServerStatus(status);
      
      toast({
        title: "API Deployed Successfully! 🎉",
        description: "Your YouTube AI Summarizer API is now live and ready to use",
      });
      
    } catch (error) {
      console.error('Deployment error:', error);
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Failed to deploy API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopAPI = () => {
    const message = APIService.stopAPIServer();
    setIsDeployed(false);
    setDeploymentResult(null);
    setServerStatus(APIService.getServerStatus());
    
    toast({
      title: "API Server Stopped",
      description: message,
    });
  };

  const testAPI = async () => {
    if (!testUrl || !isDeployed) return;
    
    setIsLoading(true);
    try {
      console.log('🧪 Testing API with URL:', testUrl);
      
      const request = {
        method: 'POST',
        path: '/api/youtube/summarize',
        query: {},
        body: { url: testUrl },
        headers: { 'Content-Type': 'application/json' }
      };
      
      const response = await APIService.executeAPIRequest(request);
      setTestResult(response);
      
      if (response.success) {
        toast({
          title: "API Test Successful! ✅",
          description: `Video analyzed in ${response.executionTime}ms`,
        });
      } else {
        toast({
          title: "API Test Failed",
          description: response.error,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Failed to test API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully`,
    });
  };

  const generateCurlCommand = () => {
    if (!serverStatus) return '';
    
    return `curl -X POST ${serverStatus.url}${apiPath} \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${testUrl}"}'`;
  };

  const generateJavaScriptExample = () => {
    if (!serverStatus) return '';
    
    return `fetch('${serverStatus.url}${apiPath}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: '${testUrl}'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
  };

  const getStatusStyles = () => {
    if (!data.executionStatus) return "";

    switch (data.executionStatus) {
      case "processing":
        return "animate-pulse text-blue-400";
      case "completed":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="flex items-center mb-1">
        <Globe className="mr-2 h-4 w-4 text-blue-500" />
        <div className="node-label">{data.label || "API Deployment"}</div>
      </div>
      <div className="node-desc">{data.description || "Deploy flow as REST API"}</div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={isDeployed ? "default" : "secondary"} className="text-xs">
          {isDeployed ? (
            <>
              <Activity className="h-3 w-3 mr-1" />
              Live
            </>
          ) : (
            <>
              <Server className="h-3 w-3 mr-1" />
              Stopped
            </>
          )}
        </Badge>
        {serverStatus && (
          <Badge variant="outline" className="text-xs">
            {serverStatus.endpoints} endpoint{serverStatus.endpoints !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {/* API Configuration */}
        <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
          <Label className="text-xs font-medium text-green-300 mb-2 block">
            API Configuration
          </Label>
          
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-green-300/70">API Name</Label>
              <Input
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                className="h-7 text-xs"
                disabled={isDeployed}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-xs text-green-300/70">Method</Label>
                <Select value={apiMethod} onValueChange={setApiMethod} disabled={isDeployed}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-2">
                <Label className="text-xs text-green-300/70">Path</Label>
                <Input
                  value={apiPath}
                  onChange={(e) => setApiPath(e.target.value)}
                  className="h-7 text-xs"
                  disabled={isDeployed}
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-green-300/70">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-16 text-xs resize-none"
                disabled={isDeployed}
              />
            </div>
          </div>
        </div>

        {/* Deployment Status */}
        {deploymentResult && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium text-green-300">
                Deployment Status
              </Label>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-green-300/70">Endpoint:</span>
                <code className="text-blue-400">{deploymentResult.method} {deploymentResult.path}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300/70">Status:</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300/70">Executions:</span>
                <span className="text-green-400">{deploymentResult.executionCount}</span>
              </div>
              {serverStatus && (
                <div className="flex justify-between">
                  <span className="text-green-300/70">URL:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 p-0 text-blue-400 hover:text-blue-300"
                    onClick={() => copyToClipboard(serverStatus.url + apiPath, 'API URL')}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy URL
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* API Testing */}
        {isDeployed && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <Label className="text-xs font-medium text-green-300 mb-2 block">
              Test API
            </Label>
            
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-green-300/70">YouTube URL</Label>
                <Input
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="h-7 text-xs"
                />
              </div>
              
              <Button
                onClick={testAPI}
                size="sm"
                className="w-full h-7"
                disabled={isLoading || !testUrl}
              >
                <Play className="h-3 w-3 mr-1" />
                {isLoading ? "Testing..." : "Test API"}
              </Button>
            </div>
            
            {testResult && (
              <div className="mt-2 p-2 rounded bg-black/20 border border-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  {testResult.success ? (
                    <CheckCircle className="h-3 w-3 text-green-400" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-red-400" />
                  )}
                  <span className="text-xs font-medium">
                    {testResult.success ? 'Success' : 'Failed'}
                  </span>
                  <span className="text-xs text-green-300/70">
                    ({testResult.executionTime}ms)
                  </span>
                </div>
                
                {testResult.success && testResult.data && (
                  <div className="text-xs space-y-1">
                    <div className="text-green-300/70">
                      Video: {testResult.data.video_info?.title?.substring(0, 40)}...
                    </div>
                    <div className="text-green-300/70">
                      Summary: {testResult.data.summary?.word_count} words
                    </div>
                  </div>
                )}
                
                {!testResult.success && (
                  <div className="text-xs text-red-400">
                    {testResult.error}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Code Examples */}
        {isDeployed && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium text-green-300">
                Code Examples
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 p-0"
                onClick={() => setShowDocs(!showDocs)}
              >
                <Code className="h-3 w-3 mr-1" />
                {showDocs ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {showDocs && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-green-300/70 mb-1 block">cURL</Label>
                  <div className="bg-black/40 p-2 rounded text-xs font-mono text-green-300 relative">
                    <pre className="whitespace-pre-wrap break-all">
                      {generateCurlCommand()}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(generateCurlCommand(), 'cURL command')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-green-300/70 mb-1 block">JavaScript</Label>
                  <div className="bg-black/40 p-2 rounded text-xs font-mono text-green-300 relative">
                    <pre className="whitespace-pre-wrap">
                      {generateJavaScriptExample()}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(generateJavaScriptExample(), 'JavaScript code')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isDeployed ? (
            <Button
              onClick={deployAPI}
              size="sm"
              className="flex-1"
              disabled={isLoading}
            >
              <Globe className="h-3 w-3 mr-1" />
              {isLoading ? "Deploying..." : "Deploy API"}
            </Button>
          ) : (
            <Button
              onClick={stopAPI}
              size="sm"
              variant="destructive"
              className="flex-1"
            >
              <Square className="h-3 w-3 mr-1" />
              Stop API
            </Button>
          )}
          
          {isDeployed && serverStatus && (
            <Button
              onClick={() => window.open(`${serverStatus.url}/docs`, '_blank')}
              size="sm"
              variant="outline"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Docs
            </Button>
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 border-2 border-blue-300"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500 border-2 border-blue-300"
      />
    </>
  );
};

export default APIDeploymentNode; 