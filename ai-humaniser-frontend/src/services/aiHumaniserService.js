/**
 * AI Humaniser Service
 * Integrates with the AI text humanization model
 */
import { supabase } from '../supabaseClient';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class AIHumaniserService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper to get authorization headers
  async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    const headers = {
          'Content-Type': 'application/json',
    };
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    return headers;
  }

  /**
   * Humanize AI-generated text using the main model
   * @param {string} text - The AI-generated text to humanize
   * @returns {Promise<Object>} - Humanized text and metadata
   */
  async humanizeText(text) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/api/humanize/text`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ text }),
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in to use this feature.');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        originalText: text,
        humanizedText: result.humanized_text,
        processingTime: result.processing_time,
        wordCount: result.word_count,
        changesMade: result.changes_made,
      };
    } catch (error) {
      console.error('Text humanization error:', error);
      return {
        success: false,
        error: error.message,
        originalText: text,
        humanizedText: text, // Fallback to original
      };
    }
  }

  /**
   * Humanize numbers and data in text
   * @param {string} text - Text containing numbers to humanize
   * @returns {Promise<Object>} - Humanized text with formatted numbers
   */
  async humanizeNumbers(text) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/api/humanize/numbers`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ text }),
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in to use this feature.');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        originalText: text,
        humanizedText: result.humanized_text,
        numbersProcessed: result.numbers_processed,
        processingTime: result.processing_time,
      };
    } catch (error) {
      console.error('Number humanization error:', error);
      return {
        success: false,
        error: error.message,
        originalText: text,
        humanizedText: text, // Fallback to original
      };
    }
  }

  /**
   * Comprehensive text humanization (both text and numbers)
   * @param {string} text - The text to humanize
   * @returns {Promise<Object>} - Fully humanized text
   */
  async humanizeComprehensive(text) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/api/humanize/comprehensive`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ text }),
      });
      
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in to use this feature.');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        originalText: text,
        humanizedText: result.humanized_text,
        processingTime: result.processing_time,
        textChanges: result.text_changes,
        numberChanges: result.number_changes,
        totalChanges: result.total_changes,
      };
    } catch (error) {
      console.error('Comprehensive humanization error:', error);
      return {
        success: false,
        error: error.message,
        originalText: text,
        humanizedText: text, // Fallback to original
      };
    }
  }

  /**
   * Detect if text is AI-generated
   * @param {string} text - Text to analyze
   * @returns {Promise<Object>} - AI detection results
   */
  async detectAI(text) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/api/detect/ai`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ text }),
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in to use this feature.');
}
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        isAIGenerated: result.is_ai_generated,
        confidence: result.confidence,
        indicators: result.indicators,
        analysis: result.analysis,
      };
    } catch (error) {
      console.error('AI detection error:', error);
      return {
        success: false,
        error: error.message,
        isAIGenerated: false,
        confidence: 0,
      };
    }
  }

  /**
   * Get processing statistics
   * @returns {Promise<Object>} - Processing statistics
   */
  async getStats() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/api/stats`, { headers });

      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in to use this feature.');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        totalProcessed: result.total_processed,
        averageProcessingTime: result.average_processing_time,
        successRate: result.success_rate,
        popularFeatures: result.popular_features,
      };
    } catch (error) {
      console.error('Stats error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Client-side text preprocessing (fallback when API is unavailable)
   * @param {string} text - Text to preprocess
   * @returns {string} - Preprocessed text
   */
  preprocessText(text) {
    if (!text) return '';

    // Basic text cleaning
    let processed = text.trim();

    // Remove excessive whitespace
    processed = processed.replace(/\s+/g, ' ');

    // Fix common punctuation issues
    processed = processed.replace(/\s+([.,!?;:)/g, '$1');
    processed = processed.replace(/([.,!?;:])(?=\w)/g, '$1 ');

    return processed;
  }

  /**
   * Client-side number formatting (fallback)
   * @param {string} text - Text with numbers
   * @returns {string} - Text with formatted numbers
   */
  formatNumbers(text) {
    if (!text) return '';

    let processed = text;

    // Format large numbers with commas
    processed = processed.replace(/\b(\d{1,3}(,\d{3})*)\b/g, (match) => {
      return parseInt(match.replace(/,/g, '')).toLocaleString();
    });

    // Format currency amounts
    processed = processed.replace(/(\d{5,})\s?(INR|USD|Rs\.?)/gi, (match, amount, currency) => {
      const num = parseInt(amount);
      if (num >= 10000000) {
        return `${(num / 10000000).toFixed(1)} crore ${currency}`;
      } else if (num >= 100000) {
        return `${(num / 100000).toFixed(1)} lakh ${currency}`;
      }
      return `${num.toLocaleString()} ${currency}`;
    });

    return processed;
  }

  /**
   * Get service health status
   * @returns {Promise<Object>} - Health status
   */
  async getHealth() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseURL}/api/health`, { headers });

      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in to use this feature.');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        status: result.status,
        timestamp: result.timestamp,
        version: result.version,
        services: result.services,
      };
    } catch (error) {
      console.error('Health check error:', error);
      return {
        success: false,
        error: error.message,
        status: 'offline',
      };
    }
  }
}

// Export singleton instance
export const aiHumaniserService = new AIHumaniserService();

// Export utility functions for direct use
export const humanizeText = (text) => aiHumaniserService.humanizeText(text);
export const humanizeNumbers = (text) => aiHumaniserService.humanizeNumbers(text);
export const humanizeComprehensive = (text) => aiHumaniserService.humanizeComprehensive(text);
export const detectAI = (text) => aiHumaniserService.detectAI(text);
export const getStats = () => aiHumaniserService.getStats();
export const getHealth = () => aiHumaniserService.getHealth(); 