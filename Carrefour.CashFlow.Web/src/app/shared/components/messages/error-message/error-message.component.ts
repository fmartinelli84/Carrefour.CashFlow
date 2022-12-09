import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ErrorDetail } from 'app/core/models/exceptions/error-detail';
import { ErrorType } from 'app/core/models/exceptions/error-type';
import { ErrorHandlerService } from 'app/core/services/layouts/error-handler.service';
import { BaseSubscriptionComponent } from 'app/shared/components/base-subscription.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent extends BaseSubscriptionComponent {

  public errors: HttpErrorResponse[] = [];

  public businessErrors: ErrorDetail[] = [];

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    public sanitizer: DomSanitizer) {
    super();
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.subscriptions.add(this.errorHandlerService.showError
      .subscribe(error => {
        this.addError(error);
      }));

    this.subscriptions.add(this.errorHandlerService.hideError
      .subscribe(url => {
        this.removeError(url);
      }));

    this.subscriptions.add(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.clearErrors();
      }
    }));
  }

  public refreshBusinessErrors(): void {
    let errors = this.errors
      .flatMap(e => e.error)
      .filter((e: ErrorDetail) => e.type == ErrorType.Business);

    this.businessErrors = errors;
  }

  public getUnhandledHttpErrors(): HttpErrorResponse[] {
    return this.errors.filter(
      e => !(<ErrorDetail[]>e.error).length ||
        (<ErrorDetail[]>e.error)[0].type != ErrorType.Business);
  }

  public isArray(array: any): boolean {
    return Array.isArray(array);
  }

  public clearErrors() {
    this.errors.length = 0;

    this.refreshBusinessErrors();
  }

  private addError(error: HttpErrorResponse): void {
    this.removeError(error.url);
    this.errors.push(error);

    this.refreshBusinessErrors();
  }

  private removeError(url: string): void {
    if (url) {
      var index = this.errors.findIndex(e => e.url == url);
      if (index > -1) {
        this.errors.splice(index);
      }
    } else {
      this.clearErrors();
    }

    this.refreshBusinessErrors();
  }
}
