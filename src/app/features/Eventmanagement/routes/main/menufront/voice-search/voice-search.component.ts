import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { VoiceSearchService } from '../../../../Services/voice-search.service';

@Component({
  selector: 'app-voice-search',
  templateUrl: './voice-search.component.html',
  styleUrls: ['./voice-search.component.css']
})
export class VoiceSearchComponent implements OnInit {
  @Output() searchQuery = new EventEmitter<string>();
  
  isRecording = false;
  isProcessing = false;
  error: string | null = null;
  countdownValue = 30; 
  countdownInterval: any;
  recordingVolume = 0;
  transcript = '';

  constructor(private voiceSearchService: VoiceSearchService) { }

  ngOnInit(): void {
    // You can set your Deepgram API key here or in an environment file
    this.voiceSearchService.setApiKey('4afe0eee3fc16779ee0a4018dc3f4232d5aad027');
  }

  startVoiceSearch(): void {
    // If already recording, stop it
    if (this.isRecording) {
      this.resetState();
      return;
    }
    
    // If processing, allow user to cancel
    if (this.isProcessing) {
      this.resetState();
      return;
    }

    this.isRecording = true;
    this.error = '';
    this.transcript = '';
    this.countdownValue = 30;
    
    // Start the countdown timer
    this.startCountdown();
    
    // Start the audio visualization (simulated)
    this.simulateAudioVisualization();

    this.voiceSearchService.recordAudio().subscribe({
      next: (transcript) => {
        this.isRecording = false;
        this.isProcessing = false;
        
        if (transcript) {
          this.transcript = transcript;
          this.searchQuery.emit(transcript);
        } else {
          // Show a friendly message when no speech is detected
          this.showNoSpeechMessage();
        }
      },
      error: (err) => {
        this.resetState();
        this.error = 'Could not access microphone. Please check permissions.';
        console.error('Recording error:', err);
      },
      complete: () => {
        // If recording completed but we're still in recording state, reset
        if (this.isRecording) {
          this.resetState();
        }
      }
    });
  }


  
  /**
   * Show a friendly message when no speech is detected
   */
  private showNoSpeechMessage(): void {
    this.error = 'No speech detected. Please try speaking more clearly or check your microphone.';
    
    // Clear the error message after 5 seconds
    setTimeout(() => {
      if (this.error === 'No speech detected. Please try speaking more clearly or check your microphone.') {
        this.error = '';
      }
    }, 5000);
    
    this.resetState();
  }
  

  
  /**
   * Reset all state variables to their default values
   */
  private resetState(): void {
    this.isRecording = false;
    this.isProcessing = false;
    this.stopCountdown();
    this.recordingVolume = 0;
  }
  
  /**
   * Start the countdown timer for recording
   */
  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdownValue--;
      if (this.countdownValue <= 0) {
        this.stopCountdown();
        // If we're still recording when countdown reaches zero, stop it
        if (this.isRecording) {
          this.resetState();
        }
      }
    }, 1000);
  }
  
  /**
   * Stop the countdown timer
   */
  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
  
  /**
   * Simulate microphone volume for visualization
   * In a real implementation, this would use the actual microphone input levels
   */
  private simulateAudioVisualization(): void {
    if (!this.isRecording) return;
    
    // Simulate varying microphone levels
    const simulationInterval = setInterval(() => {
      if (!this.isRecording) {
        clearInterval(simulationInterval);
        this.recordingVolume = 0;
        return;
      }
      
      // Random value between 0.3 and 1 to simulate voice activity
      this.recordingVolume = 0.3 + Math.random() * 0.7;
    }, 150);
  }
}
