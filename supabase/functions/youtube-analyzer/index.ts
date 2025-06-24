
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_DATA_API_KEY');

serve(async (req) => {
  console.log('YouTube analyzer function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtubeUrl } = await req.json();
    
    if (!youtubeUrl) {
      throw new Error('YouTube URL is required');
    }

    console.log('Processing YouTube URL:', youtubeUrl);

    // Check if required API key is available
    if (!YOUTUBE_API_KEY) {
      console.error('YouTube Data API key is missing');
      throw new Error('YouTube Data API key is not configured. Please set YOUTUBE_DATA_API_KEY in environment variables.');
    }

    console.log('YouTube API key found, proceeding with analysis');

    // Extract video ID from URL
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    console.log('Extracted video ID:', videoId);

    // Fetch video details from YouTube Data API
    const videoDetails = await fetchVideoDetails(videoId);
    console.log('Fetched video details:', videoDetails.title);
    
    // Create a simple summary from the video description instead of using AI
    const simpleSummary = createSimpleSummary(videoDetails);
    console.log('Created simple summary');

    const result = {
      videoId,
      videoDetails,
      aiSummary: simpleSummary,
      status: 'analyzed'
    };

    console.log('Analysis complete for video:', videoId);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in youtube-analyzer function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to analyze YouTube video'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  // Handle both youtube.com and youtu.be formats
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function fetchVideoDetails(videoId: string) {
  try {
    console.log('Fetching video details for:', videoId);
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      console.error('YouTube API response not OK:', response.status, response.statusText);
      throw new Error(`YouTube API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('YouTube API response received');
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found or not accessible');
    }

    const video = data.items[0];
    
    return {
      videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      duration: parseDuration(video.contentDetails.duration),
      viewCount: parseInt(video.statistics.viewCount || '0'),
      likeCount: parseInt(video.statistics.likeCount || '0'),
      thumbnailUrl: video.snippet.thumbnails.maxres?.url || 
                    video.snippet.thumbnails.high?.url || 
                    video.snippet.thumbnails.medium?.url,
      tags: video.snippet.tags || [],
      url: `https://www.youtube.com/watch?v=${videoId}`
    };
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    throw error;
  }
}

function parseDuration(duration: string): number {
  // Parse ISO 8601 duration format (PT4M13S) to seconds
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

function createSimpleSummary(videoDetails: any): string {
  const title = videoDetails.title || 'Untitled Video';
  const channel = videoDetails.channelTitle || 'Unknown Channel';
  const duration = Math.floor(videoDetails.duration / 60);
  const views = videoDetails.viewCount?.toLocaleString() || 'N/A';
  
  // Create a basic summary from the description
  let description = videoDetails.description || '';
  if (description.length > 200) {
    description = description.substring(0, 200) + '...';
  }
  
  return `"${title}" by ${channel} is a ${duration}-minute video with ${views} views. ${description || 'No description available.'}`;
}
