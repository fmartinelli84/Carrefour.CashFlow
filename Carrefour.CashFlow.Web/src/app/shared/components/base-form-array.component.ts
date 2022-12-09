import { ChangeDetectorRef, Directive, Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'app/core/services/layouts/message.service';
import { BaseFormComponent } from 'app/shared/components/base-form.component';

@Directive()
export abstract class BaseFormArrayComponent<TModel extends any[]> extends BaseFormComponent<TModel, FormArray> {

  constructor(fb: FormBuilder, changeDetector: ChangeDetectorRef, messageService: MessageService) {
    super(fb, changeDetector, messageService);

    this.form = new FormArray([]);
  }

  public addFormItem(item: any = {}): void {
    this.form.push(this.createFormItem(this.form.length));

    if (this.model)
      this.model.push(item);

    this.detectChanges();
  }

  public removeFormItem(index: number): void {
    this.form.removeAt(index);

    if (this.model)
      this.model.splice(index, 1);

    this.detectChanges();
  }

  public clearFormItems(): void {
    this.form.clear();

    if (this.model)
      this.model.length = 0;

    this.detectChanges();
  }

  protected modelChanged(oldModel: TModel, newModel: TModel): void {
    super.modelChanged(oldModel, newModel);

    this.loadFormArray();
  }

  public formChanged(oldForm: FormArray, newForm: FormArray): void {
    super.formChanged(oldForm, newForm);

    this.loadFormArray();
  }

  protected loadFormArray(model: TModel = this.model): void {
    if (this.form && model) {
      var models = [...model];

      this.clearFormItems();

      for (var i = 0; i < models.length; i++) {
        this.addFormItem(models[i]);
      }

      this.form.patchValue(models);
    }
  }

  protected createFormItem(index: number): AbstractControl {
    var form = this.fb.group({
      index: [index]
    });

    return form;
  }

  public reset(): void {
    super.reset();

    this.clearFormItems();
    this.loadFormArray();
  }
}
