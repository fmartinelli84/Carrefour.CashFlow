import { EventEmitter, Input, Output, ViewChild, Directive, ChangeDetectorRef, ContentChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators, ControlContainer } from '@angular/forms';
import { LoaderService } from 'app/core/services/layouts/loader.service';
import { getValueFromPath } from 'app/core/value-accessors/get-value-from-path';
import { BaseLabelComponent } from 'app/shared/components/base-label.component';
import { Subscription } from 'rxjs';

@Directive()
export abstract class BaseInputComponent extends BaseLabelComponent implements ControlValueAccessor {

  @Input() public rows: number;
  @Input() public cols: number;

  @Input() public placeholder: string = '';
  @Input() public value: string = '';

  private checkedField: boolean = false;
  public get checked(): boolean {
    return this.checkedField;
  }
  @Input()
  public set checked(value: boolean) {
    if (this.checkedField != value) {
      this.checkedField = value;

      this.formControl?.setValue(this.checkedField);
    }
  }

  @Input() public prependLabel: string = null;
  @Input() public appendLabel: string = null;

  @Input() public patternFormat: string = '';

  @Input() public step: number = null;

  @Input() public items: any[] = [];
  @Input() public selectedValueField: string;
  @Input() public displayNameField: string;

  @Output() public selectionChanged = new EventEmitter<any>();

  @Input() public multiple: boolean = false;

  @Input() public hideSpin: boolean = false;

  @Input() public showInputLoader: boolean = false;

  public selectedValue: any = null;
  public selectedItem: any = null;
  public selectedItems: any[] = [];

  @Input() public pattern: string;

  @Input() public minlength: number;
  @Input() public maxlength: number;

  private minField: number | Date;
  public get min(): number | Date {
    if (this.type === 'date' && !this.minField) {
      return new Date("1753-01-01T00:00:00");
    }
    return this.minField;
  }
  @Input() public set min(value: number | Date) {
    if (this.type == 'date') {
      var minDate = new Date("1753-01-01T00:00:00");
      var dateValue = new Date(value);

      if (dateValue < minDate)
        this.minField = minDate;
      else
        this.minField = dateValue;
    }
    else
      this.minField = value;
  }

  @Input() public max: number | Date;

  @Input() public clearPattern: string = null;

  @Input() public setDisplayNameEnable: boolean = true;



  @ViewChild('valueAccessor', { read: NG_VALUE_ACCESSOR }) public valueAccessor: ControlValueAccessor;

  @Input() public formControlName: string;

  private formControlField: FormControl = null;
  public get formControl(): FormControl {
    return this.formControlField;
  }

  @Input() public set formControl(value: FormControl) {
    if (this.formControlField) {
      this.subscriptions.unsubscribe();
      this.subscriptions = new Subscription();
    }

    this.formControlField = value;

    if (this.formControlField) {
      this.handleInput();
    }
  }

  constructor(
    protected loaderService: LoaderService,
    protected controlContainer: ControlContainer,
    protected changeDetector: ChangeDetectorRef) {
    super();
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    if (this.controlContainer &&
      this.controlContainer.control &&
      this.formControlName) {
      this.formControl = <FormControl>this.controlContainer.control.get(this.formControlName);

    }
    // else if (!this.controlContainer) {
    //   console.error(`'controlContainer' not found for control '${this.id}'.`, this);

    // } else if (!this.controlContainer.control) {
    //   console.error(`'controlContainer.control' not found for control '${this.id}'.`, this);

    // } else if (!this.formControlName) {
    //   console.error(`'formControlName' not found for control '${this.id}'.`, this);

    // } else if (!this.formControl) {
    //   console.error(`'formControl' not found for control '${this.id}'.`, this);
    // }
  }

  public override ngAfterContentInit(): void {
    super.ngAfterContentInit();
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.formControl?.updateValueAndValidity();

    this.changeDetector.detectChanges();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this.selectedItem = null;
    this.selectedValue = null;
    this.selectedItems = [];

    this.formControl?.reset();
    this.formControl?.clearValidators();
    this.formControl?.updateValueAndValidity();
  }


  public onInput(event: InputEvent | any) {
    if (this.clearPattern) {
      let oldValue = this.formControl?.value;

      let newValue = oldValue?.replace(new RegExp(this.clearPattern, 'gi'), '');

      if (newValue != oldValue) {
        this.formControl?.setValue(newValue);
      }
    }
  }

  public onKeyPress(event: KeyboardEvent): boolean {
    if (this.clearPattern) {
      var code = event.key;

      if (!new RegExp(this.clearPattern, 'gi').test(code) || event.key == 'Enter') {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    return true;
  }

  public onChange(event: Event): void {
    if (this.formControl) {
      this.validateEmptyString(this.formControl.value);

      if (this.type == 'number') {
        this.validateNumber(this.formControl.value, true);
      }
    }
  }



  public registerOnChange(fn: (_: any) => void): void {
    if (this.valueAccessor) {
      this.valueAccessor.registerOnChange(fn);
    }
  }
  public registerOnTouched(fn: () => void): void {
    if (this.valueAccessor) {
      this.valueAccessor.registerOnTouched(fn);
    }
  }

  public setDisabledState(isDisabled: boolean): void {
    if (this.valueAccessor) {
      this.valueAccessor.setDisabledState(isDisabled);
    }
  }

  public writeValue(obj: any): void {
    if (this.valueAccessor) {
      this.valueAccessor.writeValue(obj !== '' ? obj : null);
    }
  }

  public showLoader() {
    this.loaderService.disableNextShow();
    this.showInputLoader = true;
  }

  public hideLoader() {
    this.showInputLoader = false;
  }

  public onSelectionChanged(event: any | []): void {
    if (!Array.isArray(event)) {
      if (!this.isEqualValues(this.selectedValue, event)) {
        this.selectedValue = event;
        this.selectedItem = this.findItemByValue(this.selectedValue);
        this.selectedItems = this.selectedItem ? [this.selectedItem] : [];

        this.selectionChanged.emit(this.selectedItem ?? this.selectedValue);
      }

    } else {
      if (!this.isEqualValues(this.selectedItems, event)) {
        this.selectedValue = getValueFromPath(event[0], this.selectedValueField);
        this.selectedItem = event[0] ?? null;
        this.selectedItems = event;

        this.selectionChanged.emit(!this.multiple ? this.selectedItem : this.selectedItems);
      }
    }
  }

  public getSelectedText(selectElement: HTMLSelectElement) {
    var selectedText: string = null

    if (selectElement && selectElement.options && this.formControl) {

      for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        const ngReflectValue = option.attributes.getNamedItem('ng-reflect-value');

        let value = null;

        if (ngReflectValue) {
          value = ngReflectValue.value;
        } else {
          value = option.value;
        }

        if (this.formControl.value == value) {
          selectedText = option.text;
        }
      }
    }
    return selectedText;
  }

  protected handleInput(): void {
    if (this.type == 'number') {
      this.handleNumberInput();
    } else if (this.type == 'date') {
      this.handleDateInput();
    } else if (this.type == 'email') {
      this.handleEmailInput();
    } else if (this.type == 'tel') {
      this.handleTelInput();
    } else if (this.type == 'select') {
      this.handleSelectInput();
    }

    //this.handleEmptyString();
  }


  // private handleEmptyString(): void {
  //   this.subscriptions.add(this.formControl.valueChanges
  //     .subscribe(this.validateEmptyString.bind(this)));
  // }

  private handleNumberInput(): void {
    this.subscriptions.add(this.formControl.valueChanges
      .subscribe(this.validateNumber.bind(this)));
  }

  private handleDateInput(): void {
    this.subscriptions.add(this.formControl.valueChanges
      .subscribe(value => {
        if (typeof value === 'string' && (<string>value).length > 10) {
          let date = (<string>value).substr(0, 10);
          this.formControl.setValue(date);
        }
      }));
  }

  private handleEmailInput(): void {
    this.formControl.setValidators([this.formControl.validator, Validators.email]);
  }

  private handleTelInput(): void {
    this.formControl.setValidators([this.formControl.validator, Validators.pattern('(\\d|\\s|\\-|\\+|\\(|\\))*')]);
  }

  private handleSelectInput(): void {
    this.subscriptions.add(this.formControl.valueChanges
      .subscribe(value => {
        this.setDisplayNameFromValue(value);

        setTimeout(() => this.onSelectionChanged(this.formControl.value));
      }));
  }

  private validateEmptyString(v: string): void {
    if (v === '') {
      this.formControl.setValue(null);
    }
  }

  private validateNumber(v: number, forceUpdate: boolean = false): void {
    var originalValue = parseFloat(<string><unknown>v);

    if (!isNaN(originalValue)) {
      var newValue = this.validateStep(originalValue);
      newValue = this.validateMin(newValue);
      newValue = this.validateMax(newValue);

      if (newValue != originalValue || forceUpdate) {
        this.formControl.setValue(newValue, { emitEvent: false });
      }
    }
  }

  private validateStep(value: number): number {
    if (this.step) {
      var stepValue = parseFloat(<string><unknown>this.step);

      var valueDecimals = this.countDecimals(value);
      var stepValueDecimals = this.countDecimals(stepValue);

      var fixedPointDecimals = valueDecimals > stepValueDecimals ? valueDecimals : stepValueDecimals;
      var roundValue = Math.pow(10, fixedPointDecimals);

      var valueRounded = Math.round(value * roundValue);
      var stepValueRounded = Math.round(stepValue * roundValue);

      value = (valueRounded - (valueRounded % stepValueRounded)) / roundValue;
    }
    return value;
  }

  private validateMin(value: number): number {
    if (this.min !== null && this.min !== undefined) {
      var minValue = parseFloat(<string><unknown>this.min);

      return value >= minValue ? value : minValue;
    }
    return value;
  }

  private validateMax(value: number): number {
    if (this.max !== null && this.max !== undefined) {
      var maxValue = parseFloat(<string><unknown>this.max);

      return value <= maxValue ? value : maxValue;
    }
    return value;
  }

  private countDecimals(value: number): number {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
  }

  public getNumerFormat(): string {
    let format = null;

    if (this.step) {
      let numberParts = this.step.toString().split('.');
      let fractionDigits = 0;

      if (numberParts.length > 1)
        fractionDigits = numberParts[1].length;

      format = `1.${fractionDigits}-${fractionDigits}`
    }

    return format;
  }


  public getSelectedDisplayName(): string {
    return this.selectedItems
      .map(item => getValueFromPath(item, this.displayNameField))
      .filter(text => text !== '' && text !== undefined && text !== null)
      .join(', ');
  }

  protected setDisplayNameFromValue(value: any) {
    if (this.canSetDisplayName()) {
      let item = this.findItemByValue(value);

      this.setDisplayNameFromItem(item);
    }
  }

  protected setDisplayNameFromItem(item: any) {
    if (this.canSetDisplayName()) {
      let displayName = getValueFromPath(item, this.displayNameField);

      this.setDisplayName(displayName);
    }
  }

  protected setDisplayName(displayName: any): void {
    if (this.canSetDisplayName()) {
      this.formControl
        ?.parent
        ?.get(this.displayNameField)
        ?.setValue(displayName, { emitEvent: false, emitModelToViewChange: false });
    }
  }

  protected canSetDisplayName(): boolean {
    return this.setDisplayNameEnable && this.displayNameField && this.selectedValueField != this.displayNameField;
  }

  protected findItemByValue(value: any): any {
    let item: any = null;

    if (value) {
      const currentValue = getValueFromPath(value, this.selectedValueField);

      item = this.items.find(currentItem => getValueFromPath(currentItem, this.selectedValueField) == currentValue);
    }

    return item;
  }

  protected isEqualValues(value1: any | [], value2: any | []): boolean {
    let isEqual = false;

    if ((value1 === null || value1 === undefined) && (value2 === null || value2 === undefined)) {
      isEqual = true;

    } else if (Array.isArray(value1) && Array.isArray(value2)) {

      if (value1.length == value2.length) {
        isEqual = value1.every(v1 => value2.some(v2 => getValueFromPath(v1, this.selectedValueField) == getValueFromPath(v2, this.selectedValueField)));
      }

    } else {
      isEqual = getValueFromPath(value1, this.selectedValueField) == getValueFromPath(value2, this.selectedValueField);
    }

    return isEqual;
  }
}
