import { Input, Directive, Component, ChangeDetectorRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { BaseSubscriptionComponent } from 'app/shared/components/base-subscription.component';

@Directive()
export abstract class BaseModelComponent<TModel> extends BaseSubscriptionComponent implements AfterContentInit, AfterViewInit {

  private initialized: boolean = false;

  @Input() public id: string = null;
  @Input() public label: string = null;

  private modelField: TModel = null;
  public get model(): TModel {
    return this.modelField;
  }
  @Input() public set model(value: TModel) {
    var oldValue = this.modelField;
    this.modelField = value;

    if (oldValue != value)
      this.modelChanged(oldValue, value);
  }

  constructor(public changeDetector: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.initialized = true;
  }

  public ngAfterContentInit(): void {
    this.detectChanges();
  }

  public ngAfterViewInit(): void {
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this.initialized = false;
  }

  protected modelChanged(oldModel: TModel, newModel: TModel): void {
  }

  protected detectChanges() {
    if (this.initialized) {
      this.changeDetector.detectChanges();
    }
  }
}
