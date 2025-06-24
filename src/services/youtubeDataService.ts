
// YouTube Data API service for fetching real video information
export class YouTubeDataService {
  private static readonly API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
  
  static extractVideoId(url: string): string | null {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    // Handle both youtube.com and youtu.be formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  static async getVideoDetails(videoId: string, apiKey?: string) {
    if (!apiKey) {
      throw new Error('YouTube Data API key is required. Please configure YOUTUBE_DATA_API_KEY in your environment.');
    }

    try {
      const response = await fetch(
        `${this.API_BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
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
        duration: this.parseDuration(video.contentDetails.duration),
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

  private static parseDuration(duration: string): number {
    // Parse ISO 8601 duration format (PT4M13S) to seconds
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }
}
