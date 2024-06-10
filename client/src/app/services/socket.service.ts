import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  userId: string | null;

  constructor() {
    this.socket = io('http://host.docker.internal:3001');
    this.userId = localStorage.getItem('user_id');  // Retrieve userId from local storage
    if (this.userId) {
      this.connectUser(this.userId);
    }
  }

  connectUser(userId: string) {
    this.userId = userId;
    this.socket.emit('userConnected', userId);
  }

  onMessage() {
    return new Observable<{ text: string; recipientId: string; senderId: string }>(observer => {
      console.log('senderId:', this.userId);
      this.socket.on('message', (message: { text: string; recipientId: string; senderId: string }) => {
        observer.next(message);
      });
    });
  }

  sendMessage(message: { text: string; recipientId: string; senderId: string, created_at: string }): void {
    console.log(`Sending message with senderId: ${this.userId}`);
    this.socket.emit('message', message);
  }

}