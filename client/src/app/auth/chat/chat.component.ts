import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message = '';
  messages: { text: string; senderId: string; recipientId: string }[] = [];
  recipientId: string;
  users = new Map<number, User>();
  usersArray: [number, User][] = [];
  errorMessage: string | null = null;
  userNames = new Map<number, string>();

  constructor(public socketService: SocketService, private userService: UserService) { 
    this.recipientId = '';
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((response: { users: User[] }) => {
      response.users.forEach(user => {
        if (user.id && user.name) {
          const userId = Number(user.id);
          this.users.set(userId, user);
          this.userNames.set(userId, user.name);
        }
      });
      this.usersArray = Array.from(this.users.entries());
    }, error => {
      console.error('Failed to fetch users:', error);
    });

    this.socketService.onMessage().subscribe((message: { text: string; recipientId: string; senderId: string }) => {
      if (message.recipientId === this.socketService.userId || message.senderId === this.socketService.userId) {
        this.messages.push(message);
        console.log('Received message:', message.text);
      }
    });
  }

  sendMessage(form: NgForm) {
    
    if (!this.recipientId) {
      this.errorMessage = 'Cannot send message: No recipient selected';
      return;
    }

    if (!this.message || this.message.trim() === '') {
      this.errorMessage = 'Cannot send message: Message is empty';
      return;
    }

    if (this.socketService.userId) {
      const message = { text: this.message, recipientId: this.recipientId, senderId: this.socketService.userId};
      this.socketService.sendMessage(message);
      this.message = '';
      form.resetForm();
    } else {
      console.error('Cannot send message: userId is null');
    }
  }
  onRecipientChange(newRecipientId: string) {
    console.log('Recipient ID changed:', newRecipientId);
    this.recipientId = newRecipientId;
    this.errorMessage = '';
  }
}