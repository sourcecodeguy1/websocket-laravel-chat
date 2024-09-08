import { Injectable } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import { Message } from '../models/message';
import { io } from 'socket.io-client';
import { scan } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // Import the HttpClient module

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket;
  private messagesSubject = new Subject<Message>();

  constructor(private http: HttpClient) { // Inject the HttpClient module
    this.socket = io('http://host.docker.internal:3002');
    this.socket.on('message', (message: Message) => {
      this.messagesSubject.next(message);
    });
  }

  /* sendMessage(senderId: string, recipientId: string, text: string): void {
    this.socket.emit('message', { senderId: senderId, recipientId: recipientId, text });
  } */

  getMessages(userId: string, recipientId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`/api/messages?userId=${userId}&recipientId=${recipientId}`);
  }
}
