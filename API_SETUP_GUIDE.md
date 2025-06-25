# 🚀 YouTube AI Summarizer API Setup Guide

This guide will help you set up the required API keys to use the YouTube AI Summarizer REST API deployment feature.

## 📋 Required API Keys

### 1. YouTube Data API Key 🎥

**What it's for:** Fetching video metadata, descriptions, and details from YouTube

**How to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Library**
4. Search for "YouTube Data API v3" and enable it
5. Go to **APIs & Services** → **Credentials**
6. Click **Create Credentials** → **API Key**
7. Copy your API key

**Cost:** Free tier includes 10,000 quota units per day (sufficient for most use cases)

### 2. AI Provider API Key 🤖

Choose one of the following AI providers:

#### Option A: OpenAI (Recommended)
**What it's for:** Generating AI summaries and analysis

**How to get it:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create new secret key**
5. Copy your API key (starts with `sk-`)

**Models available:**
- `gpt-4o-mini` (Recommended - Fast & Cost-effective)
- `gpt-4o` (Most capable)
- `gpt-4` (High quality)
- `gpt-3.5-turbo` (Budget option)

**Cost:** Pay-per-use, starting at $0.0001/1K tokens

#### Option B: Anthropic (Claude)
**What it's for:** Alternative AI provider for summaries

**How to get it:**
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy your API key

**Models available:**
- `claude-3-haiku-20240307` (Fast & Cost-effective)
- `claude-3-sonnet-20240229` (Balanced)
- `claude-3-opus-20240229` (Most capable)

## 🔧 Setup Instructions

### Method 1: Using the UI (Recommended)
1. Load the **YouTube AI Summarizer** template from the sidebar
2. Click the **Deploy** button
3. Select the **REST API** tab
4. In the **🔑 API Keys Configuration** section:
   - Enter your YouTube Data API key
   - Select your AI provider (OpenAI or Anthropic)
   - Choose your preferred model
   - Enter your AI provider API key
5. Click **Deploy API**

### Method 2: Environment Variables (Advanced)
1. Create a `.env` file in your project root:
```bash
# YouTube Data API Configuration
YOUTUBE_DATA_API_KEY=your_youtube_data_api_key_here

# AI Provider API Keys (choose one)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Custom AI Endpoint
CUSTOM_AI_ENDPOINT=your_custom_ai_endpoint_here
CUSTOM_AI_API_KEY=your_custom_ai_api_key_here
```

## 🧪 Testing Your Setup

### 1. Using the Built-in Tester
1. After deployment, scroll to the **API Testing** section
2. Enter a YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. Click **Test API**
4. Check the response for successful processing

### 2. Using cURL
```bash
curl -X POST http://localhost:3001/api/youtube/summarize \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

### 3. Using JavaScript
```javascript
fetch('http://localhost:3001/api/youtube/summarize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## 📊 Expected Response Format

```json
{
  "success": true,
  "data": {
    "summary": {
      "content": "• Main topic 1: Overview of the subject\n• Key insight 2: Important findings\n• Conclusion 3: Final thoughts",
      "word_count": 45,
      "content_type": "video",
      "instructions_used": "Summarize the video content in 5 bullet points",
      "ai_provider": "OpenAI",
      "ai_model": "gpt-4o-mini"
    },
    "video_info": {
      "title": "Example Video Title",
      "description": "Video description...",
      "duration": 300,
      "channel": "Example Channel",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "view_count": 1000000,
      "published_at": "2024-01-15T10:30:00Z"
    },
    "processing_info": {
      "execution_id": "exec_1234567890_abc123",
      "processed_at": "2024-01-15T10:30:00Z",
      "api_version": "1.0",
      "flow_template": "YouTube AI Summarizer",
      "youtube_api_used": true,
      "ai_api_used": true,
      "ai_provider": "OpenAI",
      "ai_model": "gpt-4o-mini"
    }
  },
  "executionTime": 3500,
  "executionId": "exec_1234567890_abc123"
}
```

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables in production**
3. **Rotate API keys regularly**
4. **Monitor API usage and costs**
5. **Set up usage limits and alerts**

## 🚨 Troubleshooting

### Common Issues:

#### "YouTube API key is required but not configured"
- Ensure you've entered your YouTube Data API key
- Verify the key is valid and the YouTube Data API v3 is enabled

#### "OpenAI API error: Incorrect API key"
- Check your OpenAI API key format (should start with `sk-`)
- Verify you have sufficient credits in your OpenAI account

#### "Video not found or not accessible"
- Ensure the YouTube URL is valid and public
- Some videos may be region-restricted or private

#### "Quota exceeded"
- Check your YouTube API quota usage
- Wait for quota reset or upgrade your plan

## 💰 Cost Estimation

### YouTube Data API
- **Free tier:** 10,000 quota units/day
- **Typical video analysis:** 1-5 quota units
- **Cost:** Free for most users

### OpenAI API (GPT-4o-mini)
- **Input:** ~$0.00015 per 1K tokens
- **Output:** ~$0.0006 per 1K tokens  
- **Typical summary:** $0.001-0.005 per video
- **Monthly cost:** $1-10 for moderate usage

### Anthropic API (Claude 3 Haiku)
- **Input:** ~$0.00025 per 1K tokens
- **Output:** ~$0.00125 per 1K tokens
- **Typical summary:** $0.002-0.008 per video
- **Monthly cost:** $2-15 for moderate usage

## 🎯 Next Steps

1. **Set up your API keys** using the instructions above
2. **Deploy your API** using the REST API integration
3. **Test with sample videos** to ensure everything works
4. **Integrate into your applications** using the provided code examples
5. **Monitor usage and costs** through your provider dashboards

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your API keys are correctly configured
3. Test with different YouTube URLs
4. Check your API quotas and billing status

Happy summarizing! 🎉 