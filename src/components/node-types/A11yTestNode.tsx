import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
const A11yTestNode = ({ data }: { data: any }) => (
  <>
    <div className="flex items-center mb-1">
      <Eye className="mr-2 h-4 w-4 text-blue-400" />
      <div className="node-label">{data.label}</div>
    </div>
    <div className="node-desc">{data.description}</div>
    <Badge variant="outline" className="bg-background/30 text-xs">A11yTest</Badge>
    <Handle type="target" position={Position.Top} id="in" />
    <Handle type="source" position={Position.Bottom} id="out" />
  </>
);
export default A11yTestNode;
