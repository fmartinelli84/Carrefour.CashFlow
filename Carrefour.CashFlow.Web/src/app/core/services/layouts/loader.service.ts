import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private enabled: boolean = true;
  private loaderSubject = new Subject<boolean>();

  public loader = this.loaderSubject.asObservable();

  constructor() { }

  public show(): void {
    if (this.enabled) {
      this.loaderSubject.next(true);
    }
  }

  public hide(): void {
    if (this.enabled) {
      this.loaderSubject.next(false);
    }
    this.enabled = true;
  }

  public disableNextShow(): void {
    this.enabled = false;
  }
}
