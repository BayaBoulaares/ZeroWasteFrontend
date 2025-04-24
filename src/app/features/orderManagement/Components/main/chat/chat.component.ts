import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from 'src/app/features/orderManagement/Services/chat-service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  chatForm: FormGroup;
  messages: any[] = [];
  userId: number = 20;
  isLoading: boolean = false;
  chatVisible: boolean = false;

  constructor(
    private chatService: ChatServiceService,
    private fb: FormBuilder
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }
 
  ngOnInit(): void {
    this.loadChatHistory();
  }
  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }
  loadChatHistory(): void {
    this.chatService.getChatHistory(this.userId).subscribe({
      next: (history) => {
        this.messages = history;
      },
      error: (err) => {
        console.error('Error loading chat history:', err);
      }
    });
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      const message = this.chatForm.get('message')?.value;
      this.isLoading = true;
     
      this.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });
     
      this.chatService.sendMessage(this.userId, message).subscribe({
        next: (response) => {
          this.messages.push({
            role: 'assistant',
            content: this.cleanResponse(response),
            timestamp: new Date()
          });
          this.isLoading = false;
          this.chatForm.reset();
          this.scrollToBottom();
        },
        error: (err) => {
          console.log(err)
          console.error('Error sending message:', err);
          this.messages.push({
            role: 'assistant',
            content: 'Sorry, an error occurred while processing your request.',
            timestamp: new Date()
          });
          this.isLoading = false;
          this.scrollToBottom();
        }
    });
  }
}
 
  private cleanResponse(response: string): string {
    return response.replace(/```[\s\S]*?```/g, '')
                   .replace(/`/g, '')
                   .replace(/\*\*/g, '')
                   .trim();
  }
 
  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
}

