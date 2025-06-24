#!/bin/bash

# Array of missing node names and their icons
declare -A nodes=(
    ["RateLimiterNode"]="Clock"
    ["EncryptionNode"]="Lock"
    ["CompressionNode"]="Archive"
    ["QRCodeGeneratorNode"]="QrCode"
    ["WeatherNode"]="Cloud"
    ["CurrencyConverterNode"]="DollarSign"
    ["StockDataNode"]="TrendingUp"
    ["NewsAggregatorNode"]="Newspaper"
    ["SocialMediaNode"]="Share2"
    ["PaymentProcessorNode"]="CreditCard"
    ["AnalyticsNode"]="BarChart"
    ["A11yTestNode"]="Eye"
    ["SEOAnalyzerNode"]="Search"
    ["PerformanceMonitorNode"]="Activity"
    ["SecurityScannerNode"]="Shield"
    ["BackupNode"]="Save"
    ["MigrationNode"]="ArrowRight"
    ["DeploymentNode"]="Upload"
    ["HealthCheckNode"]="Heart"
    ["LoadBalancerNode"]="Zap"
    ["CDNNode"]="Globe"
    ["MonitoringNode"]="Monitor"
    ["AlertNode"]="Bell"
)

# Create each missing node file
for node in "${!nodes[@]}"; do
    icon="${nodes[$node]}"
    filename="src/components/node-types/${node}.tsx"
    
    if [ ! -f "$filename" ]; then
        cat > "$filename" << NODE_EOF
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { ${icon} } from 'lucide-react';

const ${node} = ({ data }: { data: any }) => (
  <>
    <div className="flex items-center mb-1">
      <${icon} className="mr-2 h-4 w-4 text-blue-400" />
      <div className="node-label">{data.label}</div>
    </div>
    <div className="node-desc">{data.description}</div>
    <Badge variant="outline" className="bg-background/30 text-xs">${node/Node/}</Badge>
    <Handle type="target" position={Position.Top} id="in" />
    <Handle type="source" position={Position.Bottom} id="out" />
  </>
);

export default ${node};
NODE_EOF
        echo "Created $filename"
    else
        echo "$filename already exists"
    fi
done
