import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface ChatMessage {
  content: SafeHtml;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {
    // Add initial welcome message
    this.messages.push({
      content: this.sanitizer.bypassSecurityTrustHtml('Hello! I can help you query the mining data. What would you like to know?'),
      isUser: false,
      timestamp: new Date()
    });
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    // Add user message
    this.messages.push({
      content: this.sanitizer.bypassSecurityTrustHtml(this.newMessage),
      isUser: true,
      timestamp: new Date()
    });

    const userMessage = this.newMessage;
    this.newMessage = ''; // Clear input
    this.isLoading = true;

    try {
      const response = await this.apiService.askAI(userMessage);
      // Process the response to handle escape sequences and markdown
      let formattedResponse = response
        .replace(/\\n/g, '\n')  // Convert \n to actual newlines
        .replace(/\\t/g, '\t')  // Convert \t to actual tabs
        .replace(/\\r/g, '\r')  // Convert \r to actual carriage returns
        .replace(/\\\\/g, '\\') // Convert \\ to single \
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Convert **text** to <strong>text</strong>
      
      // Add AI response
      this.messages.push({
        content: this.sanitizer.bypassSecurityTrustHtml(formattedResponse),
        isUser: false,
        timestamp: new Date()
      });
    } catch (error) {
      // Add error message
      this.messages.push({
        content: this.sanitizer.bypassSecurityTrustHtml('Sorry, I encountered an error processing your request. Please try again.'),
        isUser: false,
        timestamp: new Date()
      });
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = 0; // Scroll to top since we reversed the direction
    }, 100);
  }
}
