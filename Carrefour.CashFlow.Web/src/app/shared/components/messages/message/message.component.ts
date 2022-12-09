import { Component, ElementRef, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MessageType } from 'app/core/models/layouts/message-type';
import { MessageService } from 'app/core/services/layouts/message.service';
import { ScrollService } from 'app/core/services/layouts/scroll.service';
import { BaseSubscriptionComponent } from 'app/shared/components/base-subscription.component';
import { Subject } from 'rxjs';
import { ErrorHandlerService } from 'app/core/services/layouts/error-handler.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from 'app/core/services/layouts/loader.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent extends BaseSubscriptionComponent {

  public messageType = MessageType;

  public showField: boolean = false;

  public get show(): boolean {
    return this.showField;
  }
  @Input() public set show(value: boolean) {
    if (this.showField != value) {
      if (value) {
        this.open(this.message, MessageType.fromName(this.type), this.autoClose);
      } else {
        this.close();
      }
    }
  }

  @Input() public message: string = null;
  @Input() public type: 'Information' | 'Success' | 'Warning' | 'Error' = 'Information';

  @Output() public closed = new EventEmitter<boolean>();

  @Input() public scrollIntoView: boolean = false;

  @Input() public autoClose: boolean = false;
  @Input() public autoCloseTimeout: number = 5000;

  public autoCloseCountDown: number = null;
  public autoCloseCountDownHandler: number = null;

  constructor(
    private scrollService: ScrollService,
    public messageService: MessageService,
    private hostElement: ElementRef,
    private router: Router,
    private errorHandlerService: ErrorHandlerService,
    private changeDetector: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private loaderService: LoaderService) {
    super();

    this.messageService.message = this;
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.subscriptions.add(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.close();
      }
    }));
  }

  private messageSubject: Subject<boolean>;

  public open(message?: string, type?: MessageType, autoClose?: boolean, autoCloseTimeout?: number): Promise<boolean> {
    this.dismiss();

    this.message = message;

    if (type) {
      this.type = MessageType.toName(type);
    }

    this.autoClose = autoClose;

    this.showField = true;

    if (this.scrollIntoView) {
      window.setTimeout(() => this.scrollService.scrollToElement(this.hostElement));
    }

    if (this.autoClose) {
      if (!autoCloseTimeout) {
        autoCloseTimeout = this.autoCloseTimeout;
      }

      this.autoCloseCountDown = autoCloseTimeout / 1000;
      this.autoCloseCountDownHandler = window.setInterval(this.countDown.bind(this), 1000);
    }

    this.messageSubject = new Subject<any>();
    return this.messageSubject.toPromise();
  }

  public close(hideServiceErrors: boolean = false): void {
    this.internalClose(true, hideServiceErrors);
  }

  public dismiss(hideServiceErrors: boolean = false): void {
    this.internalClose(false, hideServiceErrors);
  }

  private internalClose(complete: boolean, hideServiceErrors: boolean) {
    var raiseClosed = this.showField;

    this.showField = false;

    this.clearCountDown();

    if (hideServiceErrors) {
      this.errorHandlerService.hide();
    }

    if (raiseClosed) {
      this.closed.emit(complete);
    }

    if (this.messageSubject) {
      this.messageSubject.next(complete);
      this.messageSubject.complete();

      this.messageSubject = null;
    }
  }

  private countDown(): void {
    this.autoCloseCountDown--;

    if (this.autoCloseCountDown == 0) {
      this.close();
    }
    this.changeDetector.detectChanges();
  }

  private clearCountDown() {
    this.autoCloseCountDown = null;

    if (this.autoCloseCountDownHandler) {
      window.clearInterval(this.autoCloseCountDownHandler);

      this.autoCloseCountDownHandler = null;
    }
  }
}
