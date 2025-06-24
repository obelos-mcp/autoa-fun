import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import {
  Bell,
  Settings,
  Zap,
  CheckCircle,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  AlertTriangle,
} from "lucide-react";

const NotificationNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [title, setTitle] = useState(data.title || "");
  const [message, setMessage] = useState(data.message || "");
  const [channel, setChannel] = useState(data.channel || "email");
  const [recipient, setRecipient] = useState(data.recipient || "");
  const [priority, setPriority] = useState(data.priority || "normal");
  const [enableSound, setEnableSound] = useState(data.enableSound !== false);
  const [templateType, setTemplateType] = useState(
    data.templateType || "custom"
  );
  const [notificationResult, setNotificationResult] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  title,
                  message,
                  channel,
                  recipient,
                  priority,
                  enableSound,
                  templateType,
                  configured: Boolean(title && message && recipient),
                },
              }
            : node
        )
      );
    }
  }, [
    title,
    message,
    channel,
    recipient,
    priority,
    enableSound,
    templateType,
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

  const sendNotification = async () => {
    if (!title || !message || !recipient) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSending(true);

    try {
      // Simulate notification sending
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const notificationId = `notif_${Date.now()}`;

      const result = {
        notification_id: notificationId,
        title,
        message,
        channel,
        recipient,
        priority,
        status: "sent",
        sent_at: new Date().toISOString(),
        delivery_status: "delivered",
        template_used: templateType,
        sound_enabled: enableSound,
        estimated_delivery: new Date(Date.now() + 5000).toISOString(),
      };

      setNotificationResult(result);
      alert(
        `✅ Notification sent successfully!\nChannel: ${channel}\nRecipient: ${recipient}`
      );
    } catch (error) {
      alert(`❌ Failed to send notification: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const channels = [
    { value: "email", label: "📧 Email", icon: Mail },
    { value: "sms", label: "📱 SMS", icon: Smartphone },
    { value: "slack", label: "💬 Slack", icon: MessageSquare },
    { value: "webhook", label: "🔗 Webhook", icon: Globe },
    { value: "push", label: "🔔 Push Notification", icon: Bell },
    { value: "discord", label: "🎮 Discord", icon: MessageSquare },
  ];

  const priorities = [
    { value: "low", label: "🟢 Low", color: "text-green-400" },
    { value: "normal", label: "🟡 Normal", color: "text-yellow-400" },
    { value: "high", label: "🟠 High", color: "text-orange-400" },
    { value: "urgent", label: "🔴 Urgent", color: "text-red-400" },
  ];

  const templates = [
    { value: "custom", label: "✏️ Custom Message" },
    { value: "alert", label: "🚨 System Alert" },
    { value: "welcome", label: "👋 Welcome Message" },
    { value: "reminder", label: "⏰ Reminder" },
    { value: "success", label: "✅ Success Notification" },
    { value: "error", label: "❌ Error Alert" },
  ];

  const getChannelIcon = (channel: string) => {
    const channelObj = channels.find((c) => c.value === channel);
    return channelObj?.icon || Bell;
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find((p) => p.value === priority);
    return priorityObj?.color || "text-gray-400";
  };

  const ChannelIcon = getChannelIcon(channel);

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <Bell className="h-4 w-4 mr-2 text-blue-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-green-300 mb-1 block">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
          />
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">Message</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your notification message..."
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">Channel</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {channels.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Priority
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className={p.color}>{p.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">Recipient</Label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={
              channel === "email"
                ? "user@example.com"
                : channel === "sms"
                ? "+1234567890"
                : channel === "slack"
                ? "#channel or @user"
                : channel === "webhook"
                ? "https://webhook.url"
                : "recipient identifier"
            }
          />
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">Template</Label>
          <Select value={templateType} onValueChange={setTemplateType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Enable Sound</Label>
          <Switch checked={enableSound} onCheckedChange={setEnableSound} />
        </div>

        {notificationResult && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">
                Notification Status:
              </span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <Badge variant="default" className="bg-green-600 text-xs">
                  Sent
                </Badge>
              </div>
            </div>
            <div className="text-xs text-green-300/70 space-y-1">
              <div>ID: {notificationResult.notification_id}</div>
              <div>Channel: {notificationResult.channel}</div>
              <div>Status: {notificationResult.delivery_status}</div>
              <div>
                Sent: {new Date(notificationResult.sent_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={sendNotification}
          size="sm"
          className="w-full"
          disabled={isSending}
        >
          <Zap className="h-3 w-3 mr-1" />
          {isSending ? "Sending..." : "Send Notification"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge variant="outline" className="matrix-badge text-xs">
          <ChannelIcon className="h-3 w-3 mr-1" />
          {channel}
        </Badge>
        <Badge
          variant="outline"
          className={`matrix-badge text-xs ${getPriorityColor(priority)}`}
        >
          {priority}
        </Badge>
        {enableSound && (
          <Badge
            variant="outline"
            className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs"
          >
            🔊 Sound
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
            ? "✓ Notification Sent"
            : data.executionStatus === "error"
            ? "✗ Send Failed"
            : "⟳ Sending"}
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

export default NotificationNode;
