import { Component, forwardRef, Input, Optional, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer, FormControl, SelectControlValueAccessor } from '@angular/forms';
import { BaseInputComponent } from 'app/shared/components/base-input.component';
import { LoaderService } from 'app/core/services/layouts/loader.service';
import { Enum } from 'app/core/enums/enum';
import { InputComponent } from 'app/shared/components/inputs/input/input.component';

@Component({
  selector: 'app-enum-input',
  templateUrl: './enum-input.component.html',
  styleUrls: ['./enum-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EnumInputComponent),
    multi: true
  }]
})
export class EnumInputComponent extends BaseInputComponent {

  // public get formControl(): FormControl {
  //   return super.formControl;
  // }
  // @Input() public set formControl(value: FormControl) {
  //   super.formControl = value;
  // }

  @Input() public valueType: 'number' | 'string' = 'number';
  @Input() public flags: boolean = false;

  private enumTypeField: any;

  public get enumType(): any {
    return this.enumTypeField;

  }
  @Input() public set enumType(value: any) {
    if (this.enumTypeField != value) {
      this.enumTypeField = value;

      this.items = this.getNameValues();
    }
  }

  private enumMembersField: any[];

  public get enumMembers(): any[] {
    return this.enumMembersField;

  }
  @Input() public set enumMembers(value: any[]) {
    if (this.enumMembersField != value) {
      this.enumMembersField = value;

      this.items = this.getNameValues();

      if (!this.multiple) {
        window.setTimeout(() => this.syncSelectedIndexWithFormControl());
      }
    }
  }

  constructor(
    loaderService: LoaderService,
    @Optional() controlContainer: ControlContainer,
    changeDetector: ChangeDetectorRef) {
    super(loaderService, controlContainer, changeDetector);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    // if (this.formControl) {
    //   this.handleEnumInput();
    // }
  }

  private getNameValues(): { name: string, value: number | string }[] {
    var nameValues: { name: string, value: number | string }[] = [];

    if (this.enumType) {
      if (this.enumMembers && this.enumMembers.length) {

        for (var i = 0; i < this.enumMembers.length; i++) {
          nameValues.push(this.getNameValue(this.enumMembers[i]));
        }
      } else {

        for (var enumMember in this.enumType) {
          if (!isNaN(parseInt(enumMember))) {
            nameValues.push(this.getNameValue(parseInt(enumMember)));
          }
        }
      }
    }

    return nameValues;
  }

  private getNameValue(enumMember: number): { name: string, value: number | string } {
    return {
      name: this.enumType.toDisplayName ? this.enumType.toDisplayName(enumMember) : this.enumType[enumMember],
      value: this.valueType == 'number' ? enumMember : this.enumType[enumMember]
    }
  }

  private syncSelectedIndexWithFormControl() {
    let valueAccessor = <any>this.valueAccessor;
    let nativeElement = valueAccessor.valueAccessor._elementRef.nativeElement;

    const selectedIndex = nativeElement.selectedIndex;
    const formControlIndex = valueAccessor.items.indexOf(valueAccessor.findItemByValue(this.formControl.value));

    if (selectedIndex != formControlIndex) {
      nativeElement.selectedIndex = formControlIndex;
    }
  }

  // private handleEnumInput(): void {
  //   this.subscriptions.add(this.formControl.valueChanges
  //     .subscribe(value => {
  //       let enumValue = this.getEnumValue(value);

  //       setTimeout(() => this.onSelectionChanged({ name: null, value: enumValue }));
  //     }));
  // }

  // private getEnumValue(value: any): any {
  //   let enumValue = value;

  //   if (this.enumType && this.flags && value) {
  //     let arrayValue = [];

  //     if (!Array.isArray(value)) {
  //       enumValue = value;

  //       if (this.valueType == 'number') {
  //         arrayValue = Enum.getValues(value, this.enumType);
  //       } else if (this.valueType == 'string') {
  //         arrayValue = Enum.getNames(value, this.enumType);
  //       }
  //     }
  //     else {
  //       arrayValue = value;

  //       if (this.valueType == 'number') {
  //         enumValue = Enum.fromValues(value, this.enumType);
  //       } else if (this.valueType == 'string') {
  //         enumValue = Enum.fromNames(value, this.enumType);
  //       }
  //     }

  //     this.formControl.setValue(arrayValue, { emitEvent: false, emitViewToModelChange: false });
  //     this.formControl.setValue(enumValue, { emitEvent: false, emitModelToViewChange: false });
  //   }

  //   return enumValue;
  // }
}
