import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Define interfaces for Web Speech API types
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
      length: number;
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class VoiceSearchService {
  private apiKey = '4afe0eee3fc16779ee0a4018dc3f4232d5aad027';
  private apiUrl = 'https://api.deepgram.com/v1/listen';

  constructor(private http: HttpClient) {}

  /**
   * Record audio and transcribe it using Web Speech API
   * @returns Observable of the transcribed text
   */
  recordAudio(): Observable<string> {
    return this.transcribeWithWebSpeech();
  }

  /**
   * Transcribe audio using either Web Speech API or Deepgram API
   * @param audioBlob The audio blob to transcribe
   * @returns Observable of the transcribed text
   */
  transcribeAudio(audioBlob: Blob): Observable<string> {
    // First try Web Speech API if available
    if ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition) {
      return this.transcribeWithWebSpeech();
    } else {
      // Fallback to Deepgram API
      const headers = new HttpHeaders({
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'audio/wav'
      });

      // Use HttpClient for the API request
      return this.http.post<any>(this.apiUrl, audioBlob, { headers })
        .pipe(
          map(data => {
            if (data && data.results && data.results.channels && data.results.channels.length > 0) {
              const transcript = data.results.channels[0].alternatives[0].transcript;
              return transcript;
            }
            return '';
          }),
          catchError(error => {
            console.error('Error transcribing with Deepgram:', error);
            return of('');
          })
        );
    }
  }

  /**
   * Transcribe speech using the Web Speech API with enhanced food term recognition
   * @returns Observable of the transcribed text
   */
  private transcribeWithWebSpeech(): Observable<string> {
    return new Observable<string>(observer => {
      try {
        // Check if Web Speech API is available
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
          observer.error('Speech recognition not supported in this browser');
          return;
        }
        
        // Create a new speech recognition instance
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 3; // Increase alternatives to improve accuracy
        recognition.continuous = false;
        
        // Start listening
        recognition.start();
        
        // Food-related terms to watch for
        const foodTerms = [
          'chinese', 'italian', 'mexican', 'japanese', 'indian', 'french', 'mediterranean', 'korean', 'tunisian',
          'food', 'cuisine', 'restaurant', 'dinner', 'lunch', 'breakfast', 'meal', 'cooking', 'chef',
          'pizza', 'pasta', 'sushi', 'taco', 'curry', 'noodle', 'rice', 'bread', 'dessert', 'cake'
        ];
        
        // Handle results
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          // Get the most confident result
          let transcript = event.results[0][0].transcript;
          console.log('Speech recognized (primary):', transcript);
          
          // Check if any food terms are missing by looking at alternatives
          const alternatives: string[] = [];
          for (let i = 0; i < event.results[0].length; i++) {
            alternatives.push(event.results[0][i].transcript.toLowerCase());
          }
          
          // Log all alternatives for debugging
          console.log('All alternatives:', alternatives);
          
          // Check if any food terms are in the alternatives but not in the main transcript
          for (const alt of alternatives) {
            for (const term of foodTerms) {
              if (alt.includes(term) && !transcript.toLowerCase().includes(term)) {
                // Found a food term in an alternative that's missing from the main transcript
                console.log(`Found missing food term "${term}" in alternative: ${alt}`);
                // Use the alternative with the food term instead
                transcript = alt;
                break;
              }
            }
          }
          
          // Special handling for common misrecognitions
          if (transcript.toLowerCase().includes('food event') && !transcript.toLowerCase().includes('chinese')) {
            // Check if any alternative contains 'chinese'
            for (const alt of alternatives) {
              if (alt.includes('chinese')) {
                transcript = transcript.replace('food event', 'chinese food event');
                console.log('Corrected to:', transcript);
                break;
              }
            }
          }
          
          observer.next(transcript);
          observer.complete();
        };
        
        // Handle errors
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          observer.next(''); // Handle no-speech error
          observer.complete();
        };
        
        // Handle end of speech
        recognition.onend = () => {
          observer.complete();
        };
        
        // Return cleanup function
        return () => {
          try {
            recognition.abort();
          } catch (e) {
            console.error('Error stopping recognition:', e);
          }
        };
      } catch (error) {
        console.error('Error in speech recognition:', error);
        observer.next('');
        observer.complete();
        return () => {};
      }
    });
  }

  /**
   * Set the Deepgram API key
   * @param key The API key to set
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }
}
