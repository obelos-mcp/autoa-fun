import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import {
  Rocket,
  Settings,
  Zap,
  CheckCircle,
  Globe,
  AlertTriangle,
} from "lucide-react";

const DeploymentNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [appName, setAppName] = useState(data.appName || "my-app");
  const [environment, setEnvironment] = useState(data.environment || "staging");
  const [version, setVersion] = useState(data.version || "1.0.0");
  const [platform, setPlatform] = useState(data.platform || "vercel");
  const [autoScale, setAutoScale] = useState(data.autoScale !== false);
  const [buildCommand, setBuildCommand] = useState(
    data.buildCommand || "npm run build"
  );
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  appName,
                  environment,
                  version,
                  platform,
                  autoScale,
                  buildCommand,
                  configured: Boolean(appName && environment && version),
                },
              }
            : node
        )
      );
    }
  }, [
    appName,
    environment,
    version,
    platform,
    autoScale,
    buildCommand,
    setNodes,
    id,
  ]);

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

  const deployApp = async () => {
    if (!appName || !environment || !version) {
      alert("Please fill in all required fields");
      return;
    }

    setIsDeploying(true);
    setDeployProgress(0);

    try {
      // Simulate deployment process with progress updates
      const steps = [
        { message: "Building application...", duration: 2000 },
        { message: "Running tests...", duration: 1500 },
        { message: "Deploying to " + platform + "...", duration: 2500 },
        { message: "Configuring environment...", duration: 1000 },
        { message: "Starting services...", duration: 1500 },
      ];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setDeployProgress(((i + 1) / steps.length) * 100);

        await new Promise((resolve) => setTimeout(resolve, step.duration));
      }

      const deploymentId = `deploy_${Date.now()}`;
      const deploymentUrl = `https://${appName}-${environment}.${platform}.app`;

      const result = {
        deployment_id: deploymentId,
        app_name: appName,
        environment,
        version,
        platform,
        status: "deployed",
        url: deploymentUrl,
        deployed_at: new Date().toISOString(),
        build_time: Math.floor(Math.random() * 300) + 60, // seconds
        auto_scale: autoScale,
      };

      setDeploymentResult(result);
      alert(`✅ Deployment successful!\nURL: ${deploymentUrl}`);
    } catch (error) {
      alert(`❌ Deployment failed: ${error.message}`);
    } finally {
      setIsDeploying(false);
      setDeployProgress(0);
    }
  };

  const platforms = [
    { value: "vercel", label: "🚀 Vercel", description: "Edge deployment" },
    { value: "netlify", label: "🌐 Netlify", description: "JAMstack hosting" },
    { value: "aws", label: "☁️ AWS", description: "Amazon Web Services" },
    {
      value: "gcp",
      label: "🔵 Google Cloud",
      description: "Google Cloud Platform",
    },
    { value: "heroku", label: "🟣 Heroku", description: "Container platform" },
    {
      value: "digital-ocean",
      label: "🌊 DigitalOcean",
      description: "App Platform",
    },
  ];

  const environments = [
    { value: "development", label: "🔧 Development" },
    { value: "staging", label: "🧪 Staging" },
    { value: "production", label: "🚀 Production" },
    { value: "testing", label: "🔍 Testing" },
  ];

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <Rocket className="h-4 w-4 mr-2 text-blue-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-green-300 mb-1 block">App Name</Label>
          <Input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="my-awesome-app"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Environment
            </Label>
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {environments.map((env) => (
                  <SelectItem key={env.value} value={env.value}>
                    {env.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">Version</Label>
            <Input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Build Command
          </Label>
          <Input
            value={buildCommand}
            onChange={(e) => setBuildCommand(e.target.value)}
            placeholder="npm run build"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Auto Scale</Label>
          <Switch checked={autoScale} onCheckedChange={setAutoScale} />
        </div>

        {isDeploying && (
          <div className="space-y-2">
            <Label className="text-sm text-green-300">
              Deployment Progress
            </Label>
            <Progress value={deployProgress} className="h-2" />
            <div className="text-xs text-green-400 animate-pulse">
              🚀 Deploying {appName} to {platform}...
            </div>
          </div>
        )}

        {deploymentResult && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">Deployment Status:</span>
              <Globe className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-sm font-bold text-green-400 mb-1">
              ✅ {deploymentResult.app_name} v{deploymentResult.version}{" "}
              deployed!
            </div>
            <div className="text-xs text-green-300/70">
              URL:{" "}
              <a
                href={deploymentResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {deploymentResult.url}
              </a>
            </div>
            <div className="text-xs text-green-300/70 mt-1">
              Build time: {deploymentResult.build_time}s | Platform:{" "}
              {deploymentResult.platform}
            </div>
          </div>
        )}

        <Button
          onClick={deployApp}
          size="sm"
          className="w-full"
          disabled={isDeploying}
        >
          <Zap className="h-3 w-3 mr-1" />
          {isDeploying ? "Deploying..." : "Deploy Application"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          {platform}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {environment}
        </Badge>
        {autoScale && (
          <Badge
            variant="outline"
            className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs"
          >
            Auto-scale
          </Badge>
        )}
        {data.configured ? (
          <Badge variant="default" className="bg-green-600 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Setup Required
          </Badge>
        )}
      </div>

      {data.executionStatus && (
        <div className={`text-xs mt-2 ${getStatusStyles()}`}>
          {data.executionStatus === "completed"
            ? "✓ Deployment Complete"
            : data.executionStatus === "error"
            ? "✗ Deployment Failed"
            : "⟳ Deploying"}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ top: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ bottom: 0 }}
      />
    </div>
);
};

export default DeploymentNode;
