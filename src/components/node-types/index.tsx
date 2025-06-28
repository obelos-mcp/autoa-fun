import SystemNode from "./SystemNode";
import InputNode from "./InputNode";
import OutputNode from "./OutputNode";
import ActionNode from "./ActionNode";
import ApiNode from "./ApiNode";
import AiModelNode from "./AiModelNode";
import VectorStoreNode from "./VectorStoreNode";
import WebhookNode from "./WebhookNode";
import MemoryNode from "./MemoryNode";
import ToolNode from "./ToolNode";
import CustomCommandsNode from "./CustomCommandsNode";
import TelegramConditionNode from "./TelegramConditionNode";
import TelegramUserInputNode from "./TelegramUserInputNode";
import TelegramDataNode from "./TelegramDataNode";
import TelegramResponseNode from "./TelegramResponseNode";
import ConditionNode from "./ConditionNode";
import YouTubeInputNode from "./YouTubeInputNode";
import VideoFetcherNode from "./VideoFetcherNode";
import VideoTranscriberNode from "./VideoTranscriberNode";
import ViralClipDetectorNode from "./ViralClipDetectorNode";
import AutoClipperNode from "./AutoClipperNode";
import CaptionAdderNode from "./CaptionAdderNode";
import LocalFileSaverNode from "./LocalFileSaverNode";
import PdfGeneratorNode from "./PdfGeneratorNode";
import CallAutomationNode from "./CallAutomationNode";
import MCPNode from "./MCPNode";
// Additional nodes
import NotificationNode from "./NotificationNode";
import DataLoggerNode from "./DataLoggerNode";
import MeetingCreatorNode from "./MeetingCreatorNode";
import CalendarTriggerNode from "./CalendarTriggerNode";
import SEOAnalyzerNode from "./SEOAnalyzerNode";
import A11yTestNode from "./A11yTestNode";
import AnalyticsNode from "./AnalyticsNode";
import PaymentProcessorNode from "./PaymentProcessorNode";
import SocialMediaNode from "./SocialMediaNode";
import NewsAggregatorNode from "./NewsAggregatorNode";
import StockDataNode from "./StockDataNode";
import CurrencyConverterNode from "./CurrencyConverterNode";
import AlertNode from "./AlertNode";
import MonitoringNode from "./MonitoringNode";
import CDNNode from "./CDNNode";
import LoadBalancerNode from "./LoadBalancerNode";
import HealthCheckNode from "./HealthCheckNode";
import DeploymentNode from "./DeploymentNode";
import MigrationNode from "./MigrationNode";
import BackupNode from "./BackupNode";
import SecurityScannerNode from "./SecurityScannerNode";
import PerformanceMonitorNode from "./PerformanceMonitorNode";
// Wallet Analyzer nodes
import WalletInputNode from "./WalletInputNode";
import TransactionFetcherNode from "./TransactionFetcherNode";
import WalletAnalyticsNode from "./WalletAnalyticsNode";
import WalletReportNode from "./WalletReportNode";

const NodeTypes = {
  system: SystemNode,
  input: InputNode,
  output: OutputNode,
  action: ActionNode,
  api: ApiNode,
  aimodel: AiModelNode,
  vectorstore: VectorStoreNode,
  webhook: WebhookNode,
  memory: MemoryNode,
  tool: ToolNode,
  customcommands: CustomCommandsNode,
  telegramcondition: TelegramConditionNode,
  telegramuserinput: TelegramUserInputNode,
  telegramdata: TelegramDataNode,
  telegramresponse: TelegramResponseNode,
  condition: ConditionNode,
  youtubeinput: YouTubeInputNode,
  videofetcher: VideoFetcherNode,
  videotranscriber: VideoTranscriberNode,
  viralclipdetector: ViralClipDetectorNode,
  autoclipper: AutoClipperNode,
  captionadder: CaptionAdderNode,
  localfilesaver: LocalFileSaverNode,
  pdfgenerator: PdfGeneratorNode,
  callautomation: CallAutomationNode,
  mcp: MCPNode,
  // Additional nodes
  notification: NotificationNode,
  datalogger: DataLoggerNode,
  meetingcreator: MeetingCreatorNode,
  calendartrigger: CalendarTriggerNode,
  seoanalyzer: SEOAnalyzerNode,
  a11ytest: A11yTestNode,
  analytics: AnalyticsNode,
  paymentprocessor: PaymentProcessorNode,
  socialmedia: SocialMediaNode,
  newsaggregator: NewsAggregatorNode,
  stockdata: StockDataNode,
  currencyconverter: CurrencyConverterNode,
  alert: AlertNode,
  monitoring: MonitoringNode,
  cdn: CDNNode,
  loadbalancer: LoadBalancerNode,
  healthcheck: HealthCheckNode,
  deployment: DeploymentNode,
  migration: MigrationNode,
  backup: BackupNode,
  securityscanner: SecurityScannerNode,
  performancemonitor: PerformanceMonitorNode,
  // Wallet Analyzer nodes
  walletinput: WalletInputNode,
  transactionfetcher: TransactionFetcherNode,
  walletanalytics: WalletAnalyticsNode,
  walletreport: WalletReportNode,
};

export default NodeTypes;
