import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { tap, catchError } from 'rxjs/operators';
import { LoaderService } from '../services/layouts/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // start our loader here
    this.loaderService.show();

    return next.handle(req)
      .pipe(
        tap(event => {
          // if the event is for http response
          if (event instanceof HttpResponse) {
            // stop our loader here
            this.loaderService.hide();
          }
        }, error => {
          // if any error (not for just HttpResponse) we stop our loader bar
          this.loaderService.hide();
        })
      );
  }

}
