import { Component, ChangeDetectorRef } from '@angular/core';
import { BaseButtonComponent } from 'app/shared/components/base-button.component';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends BaseButtonComponent {

  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }
}

// O componente 'app-template-button' só existe para resolver o seguinte bug: o evento click do componente 'app-button'
// é disparado quando ele está desabilitado e é utilizado diretamente nas páginas. Esse bug não acontece quando ele é
// utilizado dentro dos outros buttons ('app-save-button', 'app-cancel-button', etc).

// Para não disparar o evento click dos outros buttons quando eles estão desabilitados, foi adicionado um tratamento
// na classe BaseButtonComponent, utilizando um HostListener.

// Porém esse tratamento com o HostListener não funcionava para o 'app-button', então o componente abaixo foi
// criado, para ser utilizado exclusivamente dentro do template do 'app-button'.
@Component({
  selector: 'app-template-button',
  template: `<button [type]="type"
        [attr.class]="'m-1 btn ' + buttonCssClass"
        [attr.disabled]="disabled ? true : null"
        [attr.hidden]="hidden ? true : null"
        [attr.id]="id"
        [attr.form]="form"
        *ngIf="type != 'icon'">
  <fa-icon [icon]="icon" [size]="iconSize" class="mr-1"></fa-icon>
  <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
</button>

<ng-template #contentTemplate><ng-content></ng-content></ng-template>

<a href="javascript:void(0)"
   [attr.class]="'m-1 ' + iconCssClass"
   [attr.disabled]="disabled ? true : null"
   [tooltip]="showTooltip ? contentTemplate : null "
   [id]="id"
   [attr.hidden]="hidden ? true : null"
   *ngIf="type == 'icon'">
  <fa-icon [icon]="icon" [size]="iconSize"></fa-icon>
</a>`
})
export class TemplateButtonComponent extends BaseButtonComponent {

  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }
}
