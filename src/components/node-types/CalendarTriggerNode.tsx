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
  Calendar,
  Settings,
  Play,
  CheckCircle,
  Copy,
  Clock,
  Bell,
  Webhook,
  Users,
} from "lucide-react";

const CalendarTriggerNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [provider, setProvider] = useState(data.provider || "google");
  const [eventType, setEventType] = useState(data.eventType || "all");
  const [triggerTime, setTriggerTime] = useState(data.triggerTime || "start");
  const [beforeMinutes, setBeforeMinutes] = useState(
    data.beforeMinutes || "15"
  );
  const [calendarFilter, setCalendarFilter] = useState(
    data.calendarFilter || ""
  );
  const [keywordFilter, setKeywordFilter] = useState(data.keywordFilter || "");
  const [enableWebhook, setEnableWebhook] = useState(
    data.enableWebhook !== false
  );
  const [includeAttendees, setIncludeAttendees] = useState(
    data.includeAttendees !== false
  );
  const [triggerResult, setTriggerResult] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  provider,
                  eventType,
                  triggerTime,
                  beforeMinutes,
                  calendarFilter,
                  keywordFilter,
                  enableWebhook,
                  includeAttendees,
                  configured: Boolean(provider),
                },
              }
            : node
        )
      );
    }
  }, [
    provider,
    eventType,
    triggerTime,
    beforeMinutes,
    calendarFilter,
    keywordFilter,
    enableWebhook,
    includeAttendees,
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

  const testTrigger = async () => {
    setIsListening(true);

    try {
      // Simulate calendar connection and event detection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsConnected(true);

      // Simulate finding events
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const sampleEvent = {
        id: `event_${Date.now()}`,
        title: "Team Meeting - Q4 Planning",
        start_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
        location: "Conference Room A",
        description: "Quarterly planning session for Q4 objectives",
        attendees: includeAttendees
          ? [
              { email: "john@company.com", name: "John Doe" },
              { email: "jane@company.com", name: "Jane Smith" },
            ]
          : [],
        calendar_name: "Work Calendar",
        organizer: "manager@company.com",
      };

      const result = {
        trigger_id: `trig_${Date.now()}`,
        provider: provider,
        event_type: eventType,
        trigger_time: triggerTime,
        minutes_before: parseInt(beforeMinutes),
        event: sampleEvent,
        triggered_at: new Date().toISOString(),
        webhook_sent: enableWebhook,
        filter_matched:
          !keywordFilter ||
          sampleEvent.title.toLowerCase().includes(keywordFilter.toLowerCase()),
        message: `Calendar trigger activated for ${sampleEvent.title}`,
      };

      setTriggerResult(result);
      alert(
        `✅ Calendar trigger activated!\nEvent: ${
          sampleEvent.title
        }\nTime: ${new Date(sampleEvent.start_time).toLocaleString()}`
      );
    } catch (error) {
      alert(`❌ Calendar trigger failed: ${error.message}`);
    } finally {
      setIsListening(false);
    }
  };

  const connectCalendar = async () => {
    setIsListening(true);

    try {
      // Simulate calendar connection
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsConnected(true);
      alert(`✅ Connected to ${provider} calendar successfully!`);
    } catch (error) {
      alert(`❌ Failed to connect to calendar: ${error.message}`);
    } finally {
      setIsListening(false);
    }
  };

  const copyWebhookUrl = () => {
    const webhookUrl = `https://api.autoa.fun/webhooks/calendar/${id}`;
    navigator.clipboard.writeText(webhookUrl);
    alert("Webhook URL copied to clipboard!");
  };

  const providers = [
    { value: "google", label: "📅 Google Calendar", color: "text-blue-500" },
    { value: "outlook", label: "📧 Outlook", color: "text-blue-600" },
    { value: "apple", label: "🍎 Apple Calendar", color: "text-gray-400" },
    { value: "caldav", label: "🔗 CalDAV", color: "text-green-400" },
    { value: "exchange", label: "🏢 Exchange", color: "text-blue-700" },
    { value: "notion", label: "📝 Notion", color: "text-gray-500" },
  ];

  const eventTypes = [
    { value: "all", label: "🌟 All Events" },
    { value: "meetings", label: "👥 Meetings" },
    { value: "appointments", label: "📋 Appointments" },
    { value: "reminders", label: "⏰ Reminders" },
    { value: "birthdays", label: "🎂 Birthdays" },
    { value: "holidays", label: "🎉 Holidays" },
    { value: "tasks", label: "✅ Tasks" },
  ];

  const triggerTimes = [
    { value: "start", label: "🚀 Event Start" },
    { value: "before", label: "⏰ Before Event" },
    { value: "end", label: "🏁 Event End" },
    { value: "created", label: "➕ Event Created" },
    { value: "updated", label: "✏️ Event Updated" },
    { value: "cancelled", label: "❌ Event Cancelled" },
  ];

  const getProviderColor = (provider: string) => {
    const providerObj = providers.find((p) => p.value === provider);
    return providerObj?.color || "text-gray-400";
  };

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <Calendar className="h-4 w-4 mr-2 text-blue-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Provider
            </Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className={p.color}>{p.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Event Type
            </Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Trigger Time
            </Label>
            <Select value={triggerTime} onValueChange={setTriggerTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {triggerTimes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {triggerTime === "before" && (
            <div>
              <Label className="text-sm text-green-300 mb-1 block">
                Minutes Before
              </Label>
              <Input
                value={beforeMinutes}
                onChange={(e) => setBeforeMinutes(e.target.value)}
                placeholder="15"
                type="number"
                min="1"
                max="1440"
              />
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Calendar Filter (optional)
          </Label>
          <Input
            value={calendarFilter}
            onChange={(e) => setCalendarFilter(e.target.value)}
            placeholder="Work Calendar, Personal Calendar"
          />
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">
            Keyword Filter (optional)
          </Label>
          <Input
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
            placeholder="meeting, standup, review"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Enable Webhook</Label>
          <Switch checked={enableWebhook} onCheckedChange={setEnableWebhook} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Include Attendees</Label>
          <Switch
            checked={includeAttendees}
            onCheckedChange={setIncludeAttendees}
          />
        </div>

        {enableWebhook && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">Webhook URL:</span>
              <Webhook className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-xs text-green-300/70 font-mono break-all">
              https://api.autoa.fun/webhooks/calendar/{id}
            </div>
            <Button
              onClick={copyWebhookUrl}
              size="sm"
              variant="outline"
              className="mt-2 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy URL
            </Button>
          </div>
        )}

        {triggerResult && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">Last Trigger:</span>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-xs text-green-300/70 space-y-1">
              <div>Event: {triggerResult.event.title}</div>
              <div>Provider: {triggerResult.provider}</div>
              <div>Type: {triggerResult.event_type}</div>
              <div>
                Start:{" "}
                {new Date(triggerResult.event.start_time).toLocaleString()}
              </div>
              {triggerResult.event.attendees.length > 0 && (
                <div>Attendees: {triggerResult.event.attendees.length}</div>
              )}
              <div>
                Filter Match: {triggerResult.filter_matched ? "✅" : "❌"}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={isConnected ? testTrigger : connectCalendar}
            size="sm"
            className="flex-1"
            disabled={isListening}
          >
            {isListening ? (
              <>
                <Clock className="h-3 w-3 mr-1 animate-spin" />
                {isConnected ? "Listening..." : "Connecting..."}
              </>
            ) : isConnected ? (
              <>
                <Play className="h-3 w-3 mr-1" />
                Test Trigger
              </>
            ) : (
              <>
                <Calendar className="h-3 w-3 mr-1" />
                Connect Calendar
              </>
            )}
          </Button>
          {isConnected && (
            <Button
              onClick={() => {
                setIsConnected(false);
                setTriggerResult(null);
              }}
              size="sm"
              variant="outline"
            >
              Disconnect
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge
          variant="outline"
          className={`matrix-badge text-xs ${getProviderColor(provider)}`}
        >
          {provider}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {eventType}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {triggerTime}
        </Badge>
        {triggerTime === "before" && (
          <Badge
            variant="outline"
            className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30 text-xs"
          >
            {beforeMinutes}min
          </Badge>
        )}
        {enableWebhook && (
          <Badge
            variant="outline"
            className="bg-purple-600/20 text-purple-400 border-purple-600/30 text-xs"
          >
            🔗 Webhook
          </Badge>
        )}
        {includeAttendees && (
          <Badge
            variant="outline"
            className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs"
          >
            👥 Attendees
          </Badge>
        )}
        {isConnected ? (
          <Badge variant="default" className="bg-green-600 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Not Connected
          </Badge>
        )}
      </div>

      {data.executionStatus && (
        <div className={`text-xs mt-2 ${getStatusStyles()}`}>
          {data.executionStatus === "completed"
            ? "✓ Listening"
            : data.executionStatus === "error"
            ? "✗ Connection Error"
            : "⟳ Connecting"}
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

export default CalendarTriggerNode;
