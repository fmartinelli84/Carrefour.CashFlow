import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageType } from 'app/core/models/layouts/message-type';
import { MovementType } from 'app/core/models/movement-type';
import { MessageService } from 'app/core/services/layouts/message.service';
import { MovementService } from 'app/core/services/movement.service';
import { BaseFormGroupComponent } from 'app/shared/components/base-form-group.component';

@Component({
  selector: 'app-movement-edit',
  templateUrl: './movement-edit.component.html',
  styleUrls: ['./movement-edit.component.scss']
})
export class MovementEditComponent extends BaseFormGroupComponent<any> {

  public movementType = MovementType;

  constructor(
    fb: FormBuilder,
    private router: Router,
    changeDetector: ChangeDetectorRef,
    messageService: MessageService,
    private movementService: MovementService,
    private activeRoute: ActivatedRoute) {
    super(fb, changeDetector, messageService);
    this.model = {};
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.activeRoute.paramMap.subscribe(params => {
      this.load(+params.get('id'));
    });
  }

  public load(id: number): void {
    if (id) {
      this.movementService.getById(id).subscribe(data => {
        this.showFormValue(data, { includesModel: true });
      });
    }
    else {
      this.showFormValue({}, { includesModel: true });
    }
  }

  public formChanged(oldForm: FormGroup, newForm: FormGroup): void {
    super.formChanged(oldForm, newForm);

    newForm.setControl('id', this.fb.control({ value: null, disabled: true }));
    newForm.setControl('date', this.fb.control(null));
    newForm.setControl('type', this.fb.control(null));
    newForm.setControl('value', this.fb.control(null));
  }

  public save() {
    const movement: any = {};

    if (this.tryGetFormValue(movement, { includesModel: true })) {

      if (movement.id > 0) {
        this.movementService.update(movement).subscribe(data => {
          this.showFormValue(data, { includesModel: true });

          this.messageService.message.open('Lançamento salvo com sucesso.', MessageType.Success, true)
            .finally(this.navigateTo.bind(this));
        });
      } else {

        this.movementService.create(movement).subscribe(data => {
          this.showFormValue(data, { includesModel: true });

          this.messageService.message.open('Lançamento salvo com sucesso.', MessageType.Success, true)
            .finally(this.navigateTo.bind(this));
        });
      }
    }
  }

  private navigateTo(): any {
    this.router.navigate(['/movements']);
  }

}

