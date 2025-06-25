import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code,
  Globe,
  Play,
  Square,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Activity,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { APIService } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

interface RestAPIIntegrationProps {
  flowData: {
    nodes: any[];
    edges: any[];
  };
}

const RestAPIIntegration: React.FC<RestAPIIntegrationProps> = ({ flowData }) => {
  const [apiName, setApiName] = useState("YouTube AI Summarizer");
  const [apiPath, setApiPath] = useState("/api/youtube/summarize");
  const [apiMethod, setApiMethod] = useState("POST");
  const [description, setDescription] = useState(
    "Analyze and summarize YouTube videos using AI"
  );
  
  // API Keys Configuration
  const [youtubeApiKey, setYoutubeApiKey] = useState("");
  const [aiProvider, setAiProvider] = useState("OpenAI");
  const [aiApiKey, setAiApiKey] = useState("");
  const [aiModel, setAiModel] = useState("gpt-4o-mini");
  
  const [isDeployed, setIsDeployed] = useState(false);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [testUrl, setTestUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check server status on component mount
    const status = APIService.getServerStatus();
    setServerStatus(status);
    setIsDeployed(status.running);
  }, []);

  const deployAPI = async () => {
    // Validate API keys before deployment
    if (!youtubeApiKey.trim()) {
      toast({
        title: "YouTube API Key Required",
        description: "Please enter your YouTube Data API key to continue",
        variant: "destructive",
      });
      return;
    }

    if (!aiApiKey.trim()) {
      toast({
        title: "AI API Key Required", 
        description: `Please enter your ${aiProvider} API key to continue`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('🚀 Deploying YouTube AI Summarizer API...');
      
      // Store API keys for the session (in a real app, these would be securely stored)
      (window as any).YOUTUBE_API_KEY = youtubeApiKey;
      (window as any).AI_API_KEY = aiApiKey;
      (window as any).AI_PROVIDER = aiProvider;
      (window as any).AI_MODEL = aiModel;
      
      // Start the API server
      const serverMessage = await APIService.startAPIServer();
      console.log(serverMessage);
      
      // Deploy the YouTube AI Summarizer endpoint
      const endpoint = await APIService.deployYouTubeAISummarizer();
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
    if (!testUrl || !isDeployed || !serverStatus) {
      toast({
        title: "Cannot Test API",
        description: "Please deploy the API first and provide a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    try {
      const response = await APIService.executeAPIRequest('youtube-ai-summarizer', {
        url: testUrl
      });
      
      setTestResult(response);
      toast({
        title: "API Test Successful! ✅",
        description: "Your YouTube AI Summarizer API is working correctly",
      });
    } catch (error) {
      console.error('API test error:', error);
      toast({
        title: "API Test Failed",
        description: error instanceof Error ? error.message : "Failed to test API",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const generateCurlExample = () => {
    const baseUrl = serverStatus?.url || 'http://localhost:3000';
    return `curl -X ${apiMethod} ${baseUrl}${apiPath} \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${testUrl}"}'`;
  };

  const generateJavaScriptExample = () => {
    const baseUrl = serverStatus?.url || 'http://localhost:3000';
    return `fetch('${baseUrl}${apiPath}', {
  method: '${apiMethod}',
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

  const generatePythonExample = () => {
    const baseUrl = serverStatus?.url || 'http://localhost:3000';
    return `import requests

url = '${baseUrl}${apiPath}'
data = {
    'url': '${testUrl}'
}

response = requests.${apiMethod.toLowerCase()}(url, json=data)
result = response.json()
print(result)`;
  };

  return (
    <Card className="h-full border-green-600/20 bg-gradient-to-br from-green-950/20 to-black/40 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
            <Code className="h-5 w-5 text-black" />
          </div>
          <div>
            <CardTitle className="matrix-text-glow text-lg">
              REST API Deployment
            </CardTitle>
            <CardDescription className="text-green-400/60">
              Deploy your workflow as a REST API endpoint
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* API Configuration */}
        <div className="matrix-bg-glass p-4 rounded-lg matrix-border">
          <Label className="text-sm font-medium text-green-300 mb-3 block">
            API Configuration
          </Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-green-300/70">API Name</Label>
              <Input
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                className="h-8 text-sm"
                disabled={isDeployed}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-xs text-green-300/70">Method</Label>
                <Select value={apiMethod} onValueChange={setApiMethod} disabled={isDeployed}>
                  <SelectTrigger className="h-8 text-sm">
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
                  className="h-8 text-sm"
                  disabled={isDeployed}
                />
              </div>
            </div>
          </div>
        </div>

        {/* API Keys Configuration */}
        {showApiKeys && (
          <div className="matrix-bg-glass p-4 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-green-300">
                🔑 API Keys Configuration
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKeys(false)}
                className="h-6 w-6 p-0 text-green-400/60 hover:text-green-400"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-green-300/70">YouTube Data API Key</Label>
                <Input
                  type="password"
                  value={youtubeApiKey}
                  onChange={(e) => setYoutubeApiKey(e.target.value)}
                  placeholder="Enter your YouTube Data API key"
                  className="h-8 text-sm"
                  disabled={isDeployed}
                />
                <p className="text-xs text-green-400/50 mt-1">
                  Get it from Google Cloud Console → APIs & Services → Credentials
                </p>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-green-300/70">AI Provider</Label>
                  <Select value={aiProvider} onValueChange={setAiProvider} disabled={isDeployed}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OpenAI">OpenAI</SelectItem>
                      <SelectItem value="Anthropic">Anthropic (Claude)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Label className="text-xs text-green-300/70">Model</Label>
                  <Select value={aiModel} onValueChange={setAiModel} disabled={isDeployed}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiProvider === "OpenAI" ? (
                        <>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                          <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                          <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-green-300/70">{aiProvider} API Key</Label>
                <Input
                  type="password"
                  value={aiApiKey}
                  onChange={(e) => setAiApiKey(e.target.value)}
                  placeholder={`Enter your ${aiProvider} API key`}
                  className="h-8 text-sm"
                  disabled={isDeployed}
                />
                <p className="text-xs text-green-400/50 mt-1">
                  {aiProvider === "OpenAI" 
                    ? "Get it from platform.openai.com → API Keys" 
                    : "Get it from console.anthropic.com → API Keys"
                  }
                </p>
              </div>
              
              {!isDeployed && (
                <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  <span>API keys are required for the YouTube AI Summarizer to work</span>
                </div>
              )}
            </div>
          </div>
        )}

        {!showApiKeys && !isDeployed && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiKeys(true)}
            className="w-full text-green-400 border-green-600/30 hover:bg-green-600/10"
          >
            🔑 Configure API Keys
          </Button>
        )}

        {/* Deployment Status */}
        {deploymentResult && (
          <div className="matrix-bg-glass p-4 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-green-300">
                Deployment Status
              </Label>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-300/70">API URL:</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-black/40 px-2 py-1 rounded text-green-400">
                    {serverStatus?.url}{apiPath}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(`${serverStatus?.url}${apiPath}`, 'API URL')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-300/70">Status:</span>
                <Badge variant="default" className="bg-green-600 text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-300/70">Requests:</span>
                <span className="text-green-400 text-xs">
                  {deploymentResult.executionCount || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* API Testing */}
        {isDeployed && (
          <div className="matrix-bg-glass p-4 rounded-lg matrix-border">
            <Label className="text-sm font-medium text-green-300 mb-3 block">
              Test API
            </Label>
            
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-green-300/70">YouTube URL</Label>
                <Input
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="h-8 text-sm"
                />
              </div>
              
              <Button
                onClick={testAPI}
                size="sm"
                className="w-full"
                disabled={isTesting}
              >
                <Play className="h-3 w-3 mr-1" />
                {isTesting ? "Testing..." : "Test API"}
              </Button>
              
              {testResult && (
                <div className="bg-black/40 p-3 rounded text-xs font-mono text-green-300 max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Code Examples */}
        {isDeployed && (
          <div className="matrix-bg-glass p-4 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-green-300">
                Code Examples
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDocs(!showDocs)}
                className="h-6 text-xs"
              >
                {showDocs ? "Hide" : "Show"}
              </Button>
            </div>
            
            {showDocs && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-green-300/70 mb-1 block">cURL</Label>
                  <div className="bg-black/40 p-2 rounded text-xs font-mono text-green-300 relative">
                    <pre className="whitespace-pre-wrap">
                      {generateCurlExample()}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(generateCurlExample(), 'cURL command')}
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
                
                <div>
                  <Label className="text-xs text-green-300/70 mb-1 block">Python</Label>
                  <div className="bg-black/40 p-2 rounded text-xs font-mono text-green-300 relative">
                    <pre className="whitespace-pre-wrap">
                      {generatePythonExample()}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(generatePythonExample(), 'Python code')}
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

        {/* Workflow Detection */}
        <div className="p-3 rounded-lg bg-blue-900/10 border border-blue-600/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Workflow Detected
            </span>
          </div>
          <p className="text-blue-400/80 text-xs leading-relaxed">
            YouTube AI Summarizer workflow ready for API deployment. 
            This will create an endpoint that accepts YouTube URLs and returns AI-generated summaries.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestAPIIntegration; 