export interface AutoaRenderRequest {
  template_id: string;
  modifications: any[];
}

export interface AutoaRenderResponse {
  id: string;
  status: string;
  url?: string;
  snapshot_url?: string;
  progress?: number;
}

export class AutoaService {
  private static readonly API_KEY = 'b2a9c8e9ff8e4b9c9a8e9f8c8e9f8c8e';
  private static readonly BASE_URL = 'https://api.creatomate.com/v1';

  static async createVideoRender(customInputs: any): Promise<AutoaRenderResponse> {
    console.log('=== CREATOMATE API CALL ===');
    console.log('Custom inputs received:', customInputs);

    try {
      // Template ID for the video template
      const templateId = 'c4e8e9f8-8e9f-8c8e-9f8c-8e9f8c8e9f8c';
      
      // Prepare modifications based on custom inputs
      const modifications: any[] = [];

      // Add text modifications
      if (customInputs.text1) {
        modifications.push({
          find: 'Text 1',
          replace: customInputs.text1
        });
      }

      if (customInputs.text2) {
        modifications.push({
          find: 'Text 2', 
          replace: customInputs.text2
        });
      }

      // Add video source modification
      if (customInputs.videoSource) {
        modifications.push({
          find: 'Video Source',
          replace: customInputs.videoSource
        });
      }

      const renderRequest: AutoaRenderRequest = {
        template_id: templateId,
        modifications: modifications
      };

      console.log('Sending render request:', renderRequest);

      const response = await fetch(`${this.BASE_URL}/renders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(renderRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Creatomate API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Creatomate API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Creatomate render response:', result);

      return {
        id: result.id,
        status: result.status,
        url: result.url,
        snapshot_url: result.snapshot_url,
        progress: result.progress || 0
      };

    } catch (error) {
      console.error('Error creating video render:', error);
      throw new Error(`Failed to create video render: ${error.message}`);
    }
  }

  static async getRenderStatus(renderId: string): Promise<AutoaRenderResponse> {
    try {
      console.log(`Getting render status for ID: ${renderId}`);
      
      const response = await fetch(`${this.BASE_URL}/renders/${renderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Creatomate status check error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Creatomate status check error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Render status response:', result);

      return {
        id: result.id,
        status: result.status,
        url: result.url,
        snapshot_url: result.snapshot_url,
        progress: result.progress || 0
      };

    } catch (error) {
      console.error('Error getting render status:', error);
      throw new Error(`Failed to get render status: ${error.message}`);
    }
  }

  static async pollRenderStatus(renderId: string): Promise<AutoaRenderResponse> {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const status = await this.getRenderStatus(renderId);
        
        console.log(`Render ${renderId} status: ${status.status} (${status.progress || 0}%)`);

        if (status.status === 'succeeded' && status.url) {
          console.log(`Render ${renderId} completed successfully!`);
          return status;
        }

        if (status.status === 'failed') {
          throw new Error(`Render ${renderId} failed`);
        }

        // Wait 5 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;

      } catch (error) {
        console.error(`Error polling render status (attempt ${attempts + 1}):`, error);
        if (attempts >= maxAttempts - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      }
    }

    throw new Error(`Render ${renderId} timed out after ${maxAttempts} attempts`);
  }

  static async waitForRenderCompletion(renderId: string, maxWaitTime = 180000): Promise<AutoaRenderResponse> {
    console.log(`Waiting for render ${renderId} to complete...`);
    
    const startTime = Date.now();
    const pollInterval = 3000; // 3 seconds

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const status = await this.getRenderStatus(renderId);
        
        console.log(`Render ${renderId} status: ${status.status} (Progress: ${status.progress || 0}%)`);

        if (status.status === 'succeeded' && status.url) {
          console.log(`✅ Render ${renderId} completed successfully!`);
          console.log(`📹 Video URL: ${status.url}`);
          return status;
        }

        if (status.status === 'failed') {
          throw new Error(`❌ Render ${renderId} failed`);
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));

      } catch (error) {
        console.error(`Error checking render status:`, error);
        
        // If we're close to timeout, throw the error
        if (Date.now() - startTime > maxWaitTime - pollInterval) {
          throw error;
        }
        
        // Otherwise, wait and try again
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    throw new Error(`⏰ Render ${renderId} timed out after ${maxWaitTime / 1000} seconds`);
  }
}
