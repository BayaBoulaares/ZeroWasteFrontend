import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent {
  message = '';
  response = '';
  userId = 1;

  constructor(private http: HttpClient) {}

  sendMessage(): void {
    const body = { userId: this.userId, userMessage: this.message };
    this.http.post<string>('http://localhost:8089/chat/send', body).subscribe(res => {
      this.response = res;
    });
  }
}
