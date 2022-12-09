import { OnInit, OnDestroy, Directive, Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive()
export abstract class BaseSubscriptionComponent implements OnInit, OnDestroy {

  protected subscriptions = new Subscription();

  constructor() {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
