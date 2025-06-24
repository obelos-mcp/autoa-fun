
// Viral clip analysis service
export class ViralAnalysisService {
  static analyzeTranscript(transcript: string, maxClips: number = 3, confidenceThreshold: number = 0.7) {
    // Split transcript into segments
    const segments = transcript.split(/\[\d{2}:\d{2}\]/).filter(s => s.trim());
    const clips = [];
    
    // Viral keywords and phrases that indicate engaging content
    const viralKeywords = [
      'shocking', 'amazing', 'incredible', 'secret', 'truth', 'revealed',
      'never', 'always', 'everyone', 'nobody', 'mistake', 'wrong',
      'success', 'failure', 'money', 'rich', 'poor', 'famous',
      'viral', 'trending', 'popular', 'algorithm', 'growth'
    ];
    
    const emotionalWords = [
      'love', 'hate', 'fear', 'excited', 'angry', 'happy', 'sad',
      'surprised', 'shocked', 'disappointed', 'thrilled'
    ];
    
    for (let i = 0; i < segments.length && clips.length < maxClips; i++) {
      const segment = segments[i].toLowerCase();
      let score = 0.5; // Base score
      
      // Check for viral keywords
      viralKeywords.forEach(keyword => {
        if (segment.includes(keyword)) score += 0.1;
      });
      
      // Check for emotional words
      emotionalWords.forEach(word => {
        if (segment.includes(word)) score += 0.05;
      });
      
      // Prefer segments with questions
      if (segment.includes('?')) score += 0.1;
      
      // Prefer segments with numbers
      if (/\d+/.test(segment)) score += 0.05;
      
      // Prefer segments with exclamation marks
      if (segment.includes('!')) score += 0.05;
      
      // Length penalty for very short or very long segments
      if (segment.length < 50) score -= 0.2;
      if (segment.length > 200) score -= 0.1;
      
      if (score >= confidenceThreshold) {
        const startTime = i * 30;
        const endTime = Math.min(startTime + 60, (i + 2) * 30); // 30-60 second clips
        
        clips.push({
          id: `clip_${i + 1}`,
          start: startTime,
          end: endTime,
          duration: endTime - startTime,
          score: Math.min(score, 1.0),
          transcript: segments[i].trim(),
          factors: this.getViralFactors(segment),
          viralPotential: this.getViralPotential(score),
          estimatedViews: this.estimateViews(score)
        });
      }
    }
    
    // Sort by score and return top clips
    return clips
      .sort((a, b) => b.score - a.score)
      .slice(0, maxClips);
  }
  
  private static getViralFactors(segment: string): string[] {
    const factors = [];
    if (segment.includes('secret') || segment.includes('truth')) factors.push('curiosity');
    if (segment.includes('money') || segment.includes('success')) factors.push('aspiration');
    if (segment.includes('?')) factors.push('engagement');
    if (segment.includes('!')) factors.push('emotion');
    if (/\d+/.test(segment)) factors.push('specificity');
    return factors.length > 0 ? factors : ['general'];
  }
  
  private static getViralPotential(score: number): string {
    if (score >= 0.9) return 'very-high';
    if (score >= 0.8) return 'high';
    if (score >= 0.7) return 'medium-high';
    if (score >= 0.6) return 'medium';
    return 'low';
  }
  
  private static estimateViews(score: number): string {
    const baseViews = Math.floor(score * 1000000);
    if (baseViews >= 500000) return '500K+';
    if (baseViews >= 250000) return '250K+';
    if (baseViews >= 100000) return '100K+';
    if (baseViews >= 50000) return '50K+';
    return '10K+';
  }
}
