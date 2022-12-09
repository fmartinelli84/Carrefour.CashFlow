import { Injectable, ElementRef } from '@angular/core';
import { MessageComponent } from '../../../shared/components/messages/message/message.component';
import { MessageType } from 'app/core/models/layouts/message-type';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageComponent: MessageComponent = null;

  public get message(): MessageComponent {
    return this.messageComponent;
  }
  public set message(value: MessageComponent) {
    if (!this.messageComponent) {
      this.messageComponent = value;
    }
  }

  constructor() {
  }

  public getAlertCssClass(type: MessageType): any {
    return {
      'alert-primary': type == MessageType.Information,
      'alert-success': type == MessageType.Success,
      'alert-warning': type == MessageType.Warning,
      'alert-danger': type == MessageType.Error
    };
  }

  public getIconCssClass(type: MessageType): any {
    return {
      'text-primary': type == MessageType.Information,
      'text-success': type == MessageType.Success,
      'text-warning': type == MessageType.Warning,
      'text-danger': type == MessageType.Error
    };
  }

  public getIcon(type: MessageType): any {
    switch (type) {
      case MessageType.Information:
        return ['fas', 'info-circle'];
      case MessageType.Success:
        return ['fas', 'check-circle'];
      case MessageType.Warning:
        return ['fas', 'exclamation-triangle'];
      case MessageType.Error:
        return ['fas', 'times-circle'];
      default:
        return null;
    }
  }
}
