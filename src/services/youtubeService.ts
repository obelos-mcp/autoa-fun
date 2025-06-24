
// Legacy YouTube service - now uses YouTubeDataService
import { YouTubeDataService } from './youtubeDataService';

export class YouTubeService {
  static extractVideoId(url: string): string | null {
    return YouTubeDataService.extractVideoId(url);
  }

  static async getVideoInfo(videoId: string) {
    try {
      // Use the new YouTube Data API service
      const videoDetails = await YouTubeDataService.getVideoDetails(videoId);
      
      // Transform to match legacy format for backward compatibility
      return {
        videoId: videoDetails.videoId,
        url: videoDetails.url,
        title: videoDetails.title,
        duration: videoDetails.duration,
        thumbnailUrl: videoDetails.thumbnailUrl,
        channelName: videoDetails.channelTitle,
        viewCount: videoDetails.viewCount,
        uploadDate: videoDetails.publishedAt
      };
    } catch (error) {
      throw new Error(`Failed to get video info: ${error}`);
    }
  }

  static generateTranscript(videoInfo: any): string {
    // Simulate realistic transcript based on video duration
    const segments = Math.floor(videoInfo.duration / 30); // One segment per 30 seconds
    const topics = [
      "content creation", "viral videos", "social media", "marketing", "growth",
      "audience engagement", "storytelling", "trends", "algorithms", "success"
    ];
    
    let transcript = "";
    for (let i = 0; i < segments; i++) {
      const timestamp = i * 30;
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const minutes = Math.floor(timestamp / 60);
      const seconds = timestamp % 60;
      
      transcript += `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}] `;
      transcript += `In this section, we discuss ${topic} and how it impacts your content strategy. `;
      transcript += `This is crucial for understanding the ${topic} landscape. `;
    }
    
    return transcript;
  }
}
