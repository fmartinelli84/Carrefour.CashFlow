import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { Observable, throwError, timer, of } from "rxjs";
import { retry, catchError, retryWhen, delay, take, concat, flatMap, mergeMap, finalize, tap, map } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/layouts/error-handler.service';
import { Router } from '@angular/router';
import { MessageService } from '../services/layouts/message.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private router: Router) {
  }

  private genericRetryStrategy = ({
    maxRetryAttempts = 2,
    scalingDuration = 3000,
    statusCodes = [
      408, // Request Timeout
      503, // Service Unavailable
      504  // Gateway Timeout
    ]
  }: {
    maxRetryAttempts?: number,
    scalingDuration?: number,
    statusCodes?: number[]
  } = {}) => (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const retryAttempt = i + 1;

        if (retryAttempt > maxRetryAttempts) {
          console.warn(`${retryAttempt}° attempt fail, maximum number of attempts reached.`);
        }

        // if maximum number of retries have been met
        // or response is a status code we don't wish to retry, throw error
        if (retryAttempt > maxRetryAttempts || !statusCodes.find(e => e === error.status)) {
          return throwError(error);
        }
        console.warn(`${retryAttempt}° attempt fail, waiting ${retryAttempt * scalingDuration}ms...`);
        // retry after 1s, 2s, etc...
        return timer(retryAttempt * scalingDuration).pipe(
          finalize(() => console.log('Retrying...'))
        );
      })
    );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
      .pipe(
        retryWhen(this.genericRetryStrategy()),
        mergeMap((event, i) => {
          const retryAttempt = i;

          if (event instanceof HttpResponse && retryAttempt > 1) {
            console.log(`${retryAttempt}° attempt success.`);
          }

          return of(event);
        }),
        tap(
          (event: HttpEvent<any>) => {
            if (event.type == HttpEventType.Sent) {
              this.errorHandlerService.hide(req.urlWithParams);
            }
          },
          (error: HttpErrorResponse) => {
            if (error.status != 401) {
              this.errorHandlerService.show(error);
            }
          },
          null)
      );
  }
}
