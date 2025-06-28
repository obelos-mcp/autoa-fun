import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Wallet, CheckCircle, Settings, TrendingUp, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const WalletTrackerNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const isMobile = useIsMobile();

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

  // Get configuration from data or defaults
  const walletAddress = data.walletAddress || "";
  const blockchain = data.blockchain || "ethereum";
  const transactionLimit = data.transactionLimit || "100";
  const includeTokens = data.includeTokens !== false;

  return (
    <div
      className={`${isMobile ? 'p-2 min-w-[200px]' : 'p-4 min-w-[280px]'} relative bg-black/90 backdrop-blur-sm rounded-xl border border-green-500/30 shadow-lg`}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 26, 0, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%)',
        boxShadow: '0 0 15px rgba(0, 255, 0, 0.2)',
      }}
    >
      <div className="flex items-center mb-2">
        <Wallet
          className={`mr-2 text-green-400 ${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
        />
        <div className={`font-medium matrix-text ${isMobile ? "text-sm" : ""}`}>
          {data.label}
        </div>
      </div>

      <div
        className={`text-green-300/70 mb-3 font-mono ${
          isMobile ? "text-xs" : "text-sm"
        }`}
      >
        {data.description}
      </div>

      <div className={`flex flex-wrap gap-1 ${isMobile ? "mt-2" : "mt-3"}`}>
        <Badge
          variant="outline"
          className={`matrix-badge ${isMobile ? "mobile-badge" : "text-xs"}`}
        >
          {blockchain}
        </Badge>
        <Badge
          variant="outline"
          className={`matrix-badge ${isMobile ? "mobile-badge" : "text-xs"}`}
        >
          {transactionLimit} txns
        </Badge>
        {includeTokens && (
          <Badge
            variant="outline"
            className={`bg-blue-600/20 text-blue-400 border-blue-600/30 ${
              isMobile ? "mobile-badge" : "text-xs"
            }`}
          >
            Tokens
          </Badge>
        )}
        {walletAddress ? (
          <Badge
            variant="default"
            className={`bg-green-600 ${isMobile ? "mobile-badge" : "text-xs"}`}
          >
            <CheckCircle
              className={`mr-1 ${isMobile ? "h-2 w-2" : "h-3 w-3"}`}
            />
            Ready
          </Badge>
        ) : (
          <Badge
            variant="destructive"
            className={isMobile ? "mobile-badge" : "text-xs"}
          >
            <Settings className={`mr-1 ${isMobile ? "h-2 w-2" : "h-3 w-3"}`} />
            Address Required
          </Badge>
        )}
      </div>

      {data.executionStatus && (
        <div
          className={`mt-2 ${getStatusStyles()} ${
            isMobile ? "text-xs" : "text-xs"
          }`}
        >
          {data.executionStatus === "completed"
            ? "✓ Transactions Fetched"
            : data.executionStatus === "error"
            ? "✗ Fetch Error"
            : "⟳ Fetching Transactions"}
        </div>
      )}

      {/* Wallet tracker nodes receive wallet address and output transaction data */}
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

export default WalletTrackerNode; 