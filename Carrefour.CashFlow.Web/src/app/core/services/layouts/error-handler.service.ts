import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'app/core/services/layouts/message.service';
import { ErrorDetail } from 'app/core/models/exceptions/error-detail';
import { ErrorType } from 'app/core/models/exceptions/error-type';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private showErrorSubject = new Subject<HttpErrorResponse>();
  private hideErrorSubject = new Subject<string>();

  public showError = this.showErrorSubject.asObservable();
  public hideError = this.hideErrorSubject.asObservable();

  constructor(private messageService: MessageService) {
  }

  public show(data: HttpErrorResponse | { error: XMLHttpRequest } | (HttpErrorResponse | { error: XMLHttpRequest })[]): void {
    if (Array.isArray(data)) {
      for (let index = 0; index < data.length; index++) {

        if (data[index]?.error instanceof XMLHttpRequest) {
          let request = <XMLHttpRequest>data[index].error;

          this.showErrorSubject.next(this.toHttpErrorResponse(request));

        } else if (data[index] instanceof HttpErrorResponse) {
          let error = <HttpErrorResponse>data[index];

          this.showErrorSubject.next(error);
        }

      }

    } else if (data?.error instanceof XMLHttpRequest) {
      let request = <XMLHttpRequest>data.error;

      this.showErrorSubject.next(this.toHttpErrorResponse(request));

    } else if (data instanceof HttpErrorResponse) {
      let error = <HttpErrorResponse>data;

      this.showErrorSubject.next(error);
    }
  }

  public hide(url?: string): void {
    if (this.messageService.message && this.messageService.message.show) {
      this.messageService.message.dismiss();
    }

    this.hideErrorSubject.next(url);
  }

  public toHttpErrorResponse(request: XMLHttpRequest): HttpErrorResponse {
    try {
      var error = JSON.parse(request.response);
    } catch(e) {
      console.warn(e);
    }

    return new HttpErrorResponse({
      error: !Array.isArray(error) ? [<ErrorDetail>{
        type: ErrorType.Unhandled,
        message: error?.error?.message ?? request.statusText,
        description: error?.error?.innererror?.stacktrace
      }] : error,
      status: request.status,
      statusText: request.statusText,
      url: request.responseURL
    });
  }
}
