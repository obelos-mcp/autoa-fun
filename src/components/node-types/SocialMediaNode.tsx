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
  Share2,
  Settings,
  Send,
  CheckCircle,
  Copy,
  Image,
  Calendar,
  BarChart,
  Users,
} from "lucide-react";

const SocialMediaNode = ({
  data,
  id,
  setNodes,
}: {
  data: any;
  id: string;
  setNodes?: any;
}) => {
  const [platform, setPlatform] = useState(data.platform || "twitter");
  const [postContent, setPostContent] = useState(data.postContent || "");
  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || "");
  const [hashtags, setHashtags] = useState(data.hashtags || "");
  const [scheduleTime, setScheduleTime] = useState(data.scheduleTime || "");
  const [enableAnalytics, setEnableAnalytics] = useState(
    data.enableAnalytics !== false
  );
  const [autoRepost, setAutoRepost] = useState(data.autoRepost || false);
  const [targetAudience, setTargetAudience] = useState(
    data.targetAudience || "general"
  );
  const [socialResult, setSocialResult] = useState<any>(null);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (setNodes) {
      setNodes((nodes: any[]) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  platform,
                  postContent,
                  mediaUrl,
                  hashtags,
                  scheduleTime,
                  enableAnalytics,
                  autoRepost,
                  targetAudience,
                  configured: Boolean(postContent),
                },
              }
            : node
        )
      );
    }
  }, [
    platform,
    postContent,
    mediaUrl,
    hashtags,
    scheduleTime,
    enableAnalytics,
    autoRepost,
    targetAudience,
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

  const postToSocial = async () => {
    if (!postContent) {
      alert("Please enter post content first");
      return;
    }

    setIsPosting(true);

    try {
      // Simulate social media posting
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const postId = `post_${Date.now()}`;
      const isScheduled = Boolean(scheduleTime);

      const result = {
        post_id: postId,
        platform: platform,
        content: postContent,
        media_url: mediaUrl,
        hashtags: hashtags.split(" ").filter((tag) => tag.startsWith("#")),
        status: isScheduled ? "scheduled" : "published",
        scheduled_for: scheduleTime || null,
        published_at: isScheduled ? null : new Date().toISOString(),
        analytics: enableAnalytics
          ? {
              estimated_reach: Math.floor(Math.random() * 10000) + 1000,
              estimated_engagement: Math.floor(Math.random() * 500) + 50,
              target_audience: targetAudience,
            }
          : null,
        url: `https://${platform}.com/post/${postId}`,
        auto_repost: autoRepost,
        message: `Post ${
          isScheduled ? "scheduled" : "published"
        } successfully on ${platform}`,
      };

      setSocialResult(result);
      alert(
        `✅ Post ${
          isScheduled ? "scheduled" : "published"
        }!\nPlatform: ${platform}\nReach: ${
          result.analytics?.estimated_reach || "N/A"
        }`
      );
    } catch (error) {
      alert(`❌ Failed to post: ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  const copyPost = () => {
    const fullPost = `${postContent}\n\n${hashtags}`;
    navigator.clipboard.writeText(fullPost);
    alert("Post content copied to clipboard!");
  };

  const loadTemplate = (templateType: string) => {
    const templates = {
      announcement: {
        content:
          "🎉 Exciting news! We're thrilled to announce our latest feature that will revolutionize your workflow.",
        hashtags: "#announcement #exciting #newfeature #productivity",
      },
      promotional: {
        content:
          "🚀 Limited time offer! Get 50% off our premium plan and supercharge your productivity today.",
        hashtags: "#sale #promotion #productivity #limitedtime #deal",
      },
      educational: {
        content:
          "💡 Pro tip: Did you know you can automate your workflow with just a few clicks? Here's how...",
        hashtags: "#protip #education #automation #workflow #productivity",
      },
      engagement: {
        content:
          "🤔 What's your biggest challenge when it comes to workflow automation? Share your thoughts below!",
        hashtags: "#question #engagement #community #workflow #automation",
      },
      behind_scenes: {
        content:
          "👨‍💻 Behind the scenes: Our team working hard to bring you the best automation tools. What would you like to see next?",
        hashtags: "#behindthescenes #team #development #automation #feedback",
      },
    };

    const template = templates[templateType];
    if (template) {
      setPostContent(template.content);
      setHashtags(template.hashtags);
    }
  };

  const platforms = [
    { value: "twitter", label: "🐦 Twitter/X", color: "text-blue-400" },
    { value: "linkedin", label: "💼 LinkedIn", color: "text-blue-600" },
    { value: "facebook", label: "📘 Facebook", color: "text-blue-700" },
    { value: "instagram", label: "📷 Instagram", color: "text-pink-400" },
    { value: "youtube", label: "📺 YouTube", color: "text-red-500" },
    { value: "tiktok", label: "🎵 TikTok", color: "text-black" },
    { value: "discord", label: "🎮 Discord", color: "text-indigo-400" },
    { value: "reddit", label: "🔴 Reddit", color: "text-orange-500" },
  ];

  const audiences = [
    { value: "general", label: "🌍 General Public" },
    { value: "professionals", label: "💼 Professionals" },
    { value: "developers", label: "👨‍💻 Developers" },
    { value: "businesses", label: "🏢 Businesses" },
    { value: "students", label: "🎓 Students" },
    { value: "creators", label: "🎨 Content Creators" },
  ];

  const getPlatformColor = (platform: string) => {
    const platformObj = platforms.find((p) => p.value === platform);
    return platformObj?.color || "text-gray-400";
  };

  const getCharacterLimit = (platform: string) => {
    const limits = {
      twitter: 280,
      linkedin: 3000,
      facebook: 63206,
      instagram: 2200,
      youtube: 5000,
      tiktok: 150,
      discord: 2000,
      reddit: 40000,
    };
    return limits[platform] || 500;
  };

  const characterLimit = getCharacterLimit(platform);
  const currentLength = postContent.length;
  const isOverLimit = currentLength > characterLimit;

  return (
    <div className="matrix-bg-glass matrix-border rounded-xl p-4 min-w-[320px] matrix-hover">
      <div className="flex items-center mb-2">
        <Share2 className="h-4 w-4 mr-2 text-blue-400" />
        <div className="font-medium matrix-text">{data.label}</div>
      </div>

      <div className="text-sm text-green-300/70 mb-3 font-mono">
        {data.description}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Platform
            </Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className={p.color}>{p.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Audience
            </Label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="text-sm text-green-300">Post Content</Label>
            <span
              className={`text-xs ${
                isOverLimit ? "text-red-400" : "text-green-300/70"
              }`}
            >
              {currentLength}/{characterLimit}
            </span>
          </div>
          <Textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder={`Write your ${platform} post here...`}
            className={`min-h-[100px] text-xs ${
              isOverLimit ? "border-red-500" : ""
            }`}
          />
        </div>

        <div>
          <Label className="text-sm text-green-300 mb-1 block">Hashtags</Label>
          <Input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#hashtag1 #hashtag2 #hashtag3"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Media URL
            </Label>
            <Input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label className="text-sm text-green-300 mb-1 block">
              Schedule
            </Label>
            <Input
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              type="datetime-local"
              className="text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Enable Analytics</Label>
          <Switch
            checked={enableAnalytics}
            onCheckedChange={setEnableAnalytics}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-green-300">Auto Repost</Label>
          <Switch checked={autoRepost} onCheckedChange={setAutoRepost} />
        </div>

        {socialResult && (
          <div className="matrix-bg-glass p-3 rounded-lg matrix-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-300">Post Status:</span>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-xs text-green-300/70 space-y-1">
              <div>ID: {socialResult.post_id}</div>
              <div>Platform: {socialResult.platform}</div>
              <div>Status: {socialResult.status}</div>
              {socialResult.analytics && (
                <>
                  <div>
                    Est. Reach: {socialResult.analytics.estimated_reach}
                  </div>
                  <div>
                    Est. Engagement:{" "}
                    {socialResult.analytics.estimated_engagement}
                  </div>
                </>
              )}
              {socialResult.url && (
                <div>
                  URL:{" "}
                  <a
                    href={socialResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View Post
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={postToSocial}
            size="sm"
            className="flex-1"
            disabled={isPosting || isOverLimit}
          >
            <Send className="h-3 w-3 mr-1" />
            {isPosting
              ? "Posting..."
              : scheduleTime
              ? "Schedule Post"
              : "Post Now"}
          </Button>
          <Button onClick={copyPost} size="sm" variant="outline">
            <Copy className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          <Button
            onClick={() => loadTemplate("announcement")}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            📢 Announcement
          </Button>
          <Button
            onClick={() => loadTemplate("promotional")}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            🚀 Promo
          </Button>
          <Button
            onClick={() => loadTemplate("educational")}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            💡 Tip
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        <Badge
          variant="outline"
          className={`matrix-badge text-xs ${getPlatformColor(platform)}`}
        >
          {platform}
        </Badge>
        <Badge variant="outline" className="matrix-badge text-xs">
          {targetAudience}
        </Badge>
        {mediaUrl && (
          <Badge
            variant="outline"
            className="bg-purple-600/20 text-purple-400 border-purple-600/30 text-xs"
          >
            📷 Media
          </Badge>
        )}
        {scheduleTime && (
          <Badge
            variant="outline"
            className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs"
          >
            ⏰ Scheduled
          </Badge>
        )}
        {enableAnalytics && (
          <Badge
            variant="outline"
            className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30 text-xs"
          >
            📊 Analytics
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
            ? "✓ Post Published"
            : data.executionStatus === "error"
            ? "✗ Post Failed"
            : "⟳ Posting"}
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

export default SocialMediaNode;
