
export interface BlandCallRequest {
  phone_number: string;
  task: string;
  voice?: string;
  language?: string;
  model?: string;
  max_duration?: number;
  answered_by_enabled?: boolean;
  wait_for_greeting?: boolean;
  record?: boolean;
  amd?: boolean;
}

export interface BlandCallResponse {
  status: string;
  call_id: string;
  batch_id?: string;
  message?: string;
}

export interface BlandCallStatus {
  call_id: string;
  status: string;
  created_at: string;
  from: string;
  to: string;
  call_length?: number;
  recording_url?: string;
  transcripts?: Array<{
    text: string;
    user: string;
    timestamp: string;
  }>;
  summary?: string;
  concatenated_transcript?: string;
}

export class BlandLabsService {
  private static readonly API_BASE_URL = 'https://api.bland.ai/v1';
  private static readonly API_KEY = 'org_7abdbae9e0f055a615b7836c4ea10887e596a87c996ffbf71b9800f338509b089384971867f816e4988a69';

  static async initiateCall(callRequest: BlandCallRequest): Promise<BlandCallResponse> {
    try {
      console.log('=== BLAND LABS CALL INITIATION ===');
      console.log('Call request:', callRequest);

      const response = await fetch(`${this.API_BASE_URL}/calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.API_KEY
        },
        body: JSON.stringify({
          phone_number: callRequest.phone_number,
          task: callRequest.task,
          voice: callRequest.voice || 'maya',
          language: callRequest.language || 'en',
          model: callRequest.model || 'enhanced',
          max_duration: callRequest.max_duration || 300,
          answered_by_enabled: callRequest.answered_by_enabled !== false,
          wait_for_greeting: callRequest.wait_for_greeting !== false,
          record: callRequest.record !== false,
          amd: callRequest.amd !== false
        })
      });

      console.log('Bland Labs response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Bland Labs API error response:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          const errorMessage = errorJson.message || errorJson.error || errorText;
          throw new Error(`Bland Labs API error (${response.status}): ${errorMessage}`);
        } catch {
          throw new Error(`Bland Labs API error (${response.status}): ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('Bland Labs call initiated successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Error initiating Bland Labs call:', error);
      
      if (error.message.includes('fetch')) {
        throw new Error('Network error connecting to Bland Labs API. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  static async getCallStatus(callId: string): Promise<BlandCallStatus> {
    try {
      console.log(`Getting call status for ID: ${callId}`);
      
      const response = await fetch(`${this.API_BASE_URL}/calls/${callId}`, {
        headers: {
          'Authorization': this.API_KEY
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to get call status:', errorText);
        throw new Error(`Failed to get call status (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log(`Call ${callId} status: ${result.status}`);
      return result;
    } catch (error) {
      console.error('Error getting call status:', error);
      throw error;
    }
  }

  static async waitForCallCompletion(callId: string, maxWaitTime = 600000): Promise<BlandCallStatus> {
    console.log(`Waiting for call ${callId} completion (max ${maxWaitTime / 1000}s)`);
    const startTime = Date.now();
    const pollInterval = 5000; // 5 seconds
    let pollCount = 0;

    while (Date.now() - startTime < maxWaitTime) {
      pollCount++;
      console.log(`Poll attempt ${pollCount} for call ${callId}`);
      
      try {
        const status = await this.getCallStatus(callId);
        
        if (status.status === 'completed') {
          console.log(`✅ Call ${callId} completed!`);
          if (status.recording_url) {
            console.log(`Recording URL: ${status.recording_url}`);
          }
          return status;
        }
        
        if (status.status === 'failed' || status.status === 'busy' || status.status === 'no-answer') {
          console.error(`❌ Call ${callId} failed with status: ${status.status}`);
          throw new Error(`Call failed: ${status.status}`);
        }

        const elapsed = Math.round((Date.now() - startTime) / 1000);
        console.log(`⏳ Call ${callId} status: ${status.status}, waiting ${pollInterval}ms... (${elapsed}s elapsed)`);
        
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
      } catch (error) {
        if (!error.message.includes('failed')) {
          console.warn(`Polling error for call ${callId}:`, error.message);
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          continue;
        }
        throw error;
      }
    }

    throw new Error(`⏰ Call timeout - processing took longer than ${maxWaitTime / 1000}s. The call may still be in progress.`);
  }

  static async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/calls?limit=1`, {
        headers: {
          'Authorization': this.API_KEY
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  static isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic phone number validation (E.164 format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  static getCallSettings(): Array<{key: string, label: string, placeholder: string, type?: string}> {
    return [
      {
        key: 'phone_number',
        label: 'Phone Number (E.164 format)',
        placeholder: '+1234567890',
        type: 'tel'
      },
      {
        key: 'task',
        label: 'Call Task/Prompt',
        placeholder: 'You are a helpful assistant. Please introduce yourself and ask how you can help today.',
        type: 'textarea'
      },
      {
        key: 'voice',
        label: 'Voice (optional)',
        placeholder: 'maya'
      },
      {
        key: 'max_duration',
        label: 'Max Duration (seconds)',
        placeholder: '300',
        type: 'number'
      }
    ];
  }
}
