import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
 
  private apiUrl = 'http://localhost:8089/gaspillagezero/chat';
 
  body= {
    userId:1,
    userMessage:''
  }
 
  constructor(private http: HttpClient) { }
 
  sendMessage(userId: number, userMessage: string): Observable<any> {
    this.body.userId=userId;
    this.body.userMessage=userMessage;
    return this.http.post(`${this.apiUrl}/send`, this.body, { responseType: 'text' });
  }
 
  getChatHistory(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${userId}`);
  }
}
 