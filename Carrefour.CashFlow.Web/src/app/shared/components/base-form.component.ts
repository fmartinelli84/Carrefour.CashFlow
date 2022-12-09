import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Input, Directive, Component } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { MessageType } from 'app/core/models/layouts/message-type';
import { MessageService } from 'app/core/services/layouts/message.service';
import { BaseModelComponent } from 'app/shared/components/base-model.component';
import { IResetComponent } from 'app/shared/components/buttons/reset-button/reset-button.component';

@Directive()
export abstract class BaseFormComponent<TModel, TForm extends AbstractControl> extends BaseModelComponent<TModel> implements IBaseFormComponent {

  @Input() public required: boolean = false;
  @Input() public invalid: boolean = false;
  @Input() public readonly: boolean = false;
  @Input() public disabled: boolean = false;

  private formField: TForm = null;
  public get form(): TForm {
    return this.formField;
  }
  @Input() public set form(value: TForm) {
    var oldValue = this.formField;
    this.formField = value;

    if (oldValue != value && value)
      this.formChanged(oldValue, value);
  }

  constructor(
    protected fb: FormBuilder,
    changeDetector: ChangeDetectorRef,
    protected messageService: MessageService) {
    super(changeDetector);
  }

  public isFormValid(options?: GetFormValueOptions): boolean {
    this.getForm(options).markAllAsTouched();

    if (!this.getForm(options).valid && !options?.hideErrorMessage) {
      this.messageService.message.open($localize`:@@Verifique os campos inválidos.:Verifique os campos inválidos.`, MessageType.Warning);
    }

    return this.getForm(options).valid;
  }

  public tryGetFormValue<T>(initialValue: T, options?: GetFormValueOptions): boolean {

    if (this.isFormValid(options)) {
      initialValue = this.getFormValue(initialValue, options);

      this.getForm(options).markAsUntouched();
      this.getForm(options).markAsPristine();
      return true;
    }

    return false;
  }

  public getFormValue<T>(initialValue: T, options?: GetFormValueOptions): T {

    if (options && options.includesModel)
      Object.assign(initialValue, this.model);

    Object.assign(initialValue, this.getForm(options).value);

    return initialValue;
  }

  public showFormValue<T>(value: T, options?: ShowFormValueOptions) {

    if (options && options.includesModel)
      this.model = <any>value;

    this.getForm(options).reset();
    this.getForm(options).patchValue(value);
  }

  public reset(): void {
    this.messageService.message.close(true);
    this.form?.reset();
  }

  public formChanged(oldForm: TForm, newForm: TForm): void {
  }

  private getForm(options?: GetFormValueOptions): AbstractControl {
    return options?.form ?? this.form;
  }
}

export class ShowFormValueOptions {
  public includesModel?: boolean = false;
  public form?: AbstractControl = null;
}

export class GetFormValueOptions extends ShowFormValueOptions {
  public hideErrorMessage?: boolean = false;
}

export interface IBaseFormComponent extends IResetComponent {
  formChanged(oldForm: AbstractControl, newForm: AbstractControl): void;
}
