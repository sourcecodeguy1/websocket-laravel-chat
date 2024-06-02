import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  sendMessage(senderId: string, recipientId: string, message: string): Observable<any> {
    const url = `/api/send-message`;
    return this.http.post(url, { sender_id: senderId, recipient_id: recipientId, message }, {withCredentials: true});
  }

  getMessages(): Observable<any> {
    const url = '/api/messages';
    return this.http.get(url);
  }
}
