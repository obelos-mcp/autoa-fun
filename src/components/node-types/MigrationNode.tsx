import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
const MigrationNode = ({ data }: { data: any }) => (
  <>
    <div className="flex items-center mb-1">
      <ArrowRight className="mr-2 h-4 w-4 text-blue-400" />
      <div className="node-label">{data.label}</div>
    </div>
    <div className="node-desc">{data.description}</div>
    <Badge variant="outline" className="bg-background/30 text-xs">Migration</Badge>
    <Handle type="target" position={Position.Top} id="in" />
    <Handle type="source" position={Position.Bottom} id="out" />
  </>
);
export default MigrationNode;
