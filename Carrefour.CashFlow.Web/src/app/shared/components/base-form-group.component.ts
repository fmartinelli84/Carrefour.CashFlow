import { ChangeDetectorRef, Directive, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'app/core/services/layouts/message.service';
import { BaseFormComponent } from 'app/shared/components/base-form.component';

@Directive()
export abstract class BaseFormGroupComponent<TModel> extends BaseFormComponent<TModel, FormGroup> {

    constructor(fb: FormBuilder, changeDetector: ChangeDetectorRef, messageService: MessageService) {
        super(fb, changeDetector, messageService);

        this.form = new FormGroup({});
    }
}
