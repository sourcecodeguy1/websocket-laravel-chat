import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message = '';
  messages: Message[] = [];
  recipientId: string;
  users = new Map<number, User>();
  usersArray: [number, User][] = [];
  errorMessage: string | null = null;
  userNames = new Map<number, string>();

  constructor(
    public socketService: SocketService,
    private userService: UserService,
    private chatService: ChatService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.recipientId = '';
  }

  ngOnInit(): void {
    if (!this.socketService.userId) {
      console.error('User ID is not set');
      return;
    }
    this.userService.getUsers().subscribe((response: { users: User[] }) => {
      console.log('Users:', response.users);
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
      this.errorMessage = 'Failed to fetch users';
    });

    this.socketService.onMessage().subscribe((message: { text: string; recipientId: string; senderId: string; }) => {
      console.log('Received event:', message); // Log the entire received object
      
      
      if (message.recipientId === this.socketService.userId || message.senderId === this.socketService.userId) {
        const newMessage: Message = {
          sender_id: message.senderId,
          recipient_id: message.recipientId,
          message: message.text, // Access the 'text' property
        };
        this.messages.unshift(newMessage);
        console.log('Received message:', newMessage.message);
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
      const message = { 
        text: this.message, 
        recipientId: this.recipientId, 
        senderId: this.socketService.userId ,
        created_at: new Date().toISOString()
      };
      this.socketService.sendMessage(message);
      console.log('Sent message:', message);
      this.message = '';
      form.resetForm();
    } else {
      console.error('Cannot send message: userId is null');
    }
  }

  onRecipientChange(newRecipientId: string) {
    if (!newRecipientId) {
        console.error('Cannot change recipient: newRecipientId is null or empty');
        return;
    }

    console.log('Recipient ID changed:', newRecipientId);
    this.recipientId = newRecipientId;
    this.errorMessage = '';

    if (this.socketService.userId) {
        console.log('Fetching messages for user:', this.socketService.userId);
        // Fetch the messages between the current user and the new recipient
        this.chatService.getMessages(this.socketService.userId, newRecipientId)
            .subscribe((messages: Message[]) => {
                if (messages.length === 0 ) {
                    console.error('No messages returned from getMessages');
                    this.errorMessage = 'No messages found for this user';
                    return;
                }
                console.log('Messages fetched:', messages);
                this.messages = messages;
                console.log('First message:', this.messages[0]);
                this.changeDetector.detectChanges();
                console.log('detectChanges called');
            }, error => {
                console.error('Error fetching messages:', error);
                this.errorMessage = 'Error fetching messages';
                this.messages = [];
                this.changeDetector.detectChanges();
                console.log('detectChanges called after error');
            });
    } else {
        console.error('Cannot fetch messages: userId is null');
    }
}
}