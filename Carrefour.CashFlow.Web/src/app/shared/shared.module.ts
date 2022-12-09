import { CommonModule, CurrencyPipe, DecimalPipe, LowerCasePipe, PercentPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { LoaderComponent } from 'app/shared/components/loaders/loader/loader.component';
import { NotFoundComponent } from 'app/shared/pages/not-found/not-found.component';
import { DeleteButtonComponent } from 'app/shared/components/buttons/delete-button/delete-button.component';
import { InputComponent } from 'app/shared/components/inputs/input/input.component';
import { BackButtonComponent } from 'app/shared/components/buttons/back-button/back-button.component';
import { DateFormatPipe } from 'app/shared/pipes/date-format.pipe';
import { DateTimeFormatPipe } from 'app/shared/pipes/date-time-format.pipe';
import { MinValidatorDirective } from 'app/shared/directives/min-validator.directive';
import { MaxValidatorDirective } from 'app/shared/directives/max-validator.directive';
import { EnumInputComponent } from 'app/shared/components/inputs/enum-input/enum-input.component';
import { MessageComponent } from 'app/shared/components/messages/message/message.component';
import { NotFoundMessageComponent } from 'app/shared/components/messages/not-found-message/not-found-message.component';
import { ErrorMessageComponent } from 'app/shared/components/messages/error-message/error-message.component';
import { EnumDisplayNamePipe } from 'app/shared/pipes/enum-display-name.pipe';
import { NewButtonComponent } from 'app/shared/components/buttons/new-button/new-button.component';
import { LabelComponent } from 'app/shared/components/labels/label/label.component';
import { InputLoaderComponent } from 'app/shared/components/loaders/input-loader/input-loader.component';
import { BooleanDisplayNamePipe } from 'app/shared/pipes/boolean-display-name.pipe';
import { SaveButtonComponent } from 'app/shared/components/buttons/save-button/save-button.component';
import { PageTitleComponent } from 'app/shared/components/labels/page-title/page-title.component';
import { NullFormatPipe } from 'app/shared/pipes/null-format.pipe';
import { InputErrorMessageComponent } from 'app/shared/components/messages/input-error-message/input-error-message.component';
import { ControlLoaderComponent } from 'app/shared/components/loaders/control-loader/control-loader.component';
import { TimeFormatPipe } from 'app/shared/pipes/time-format.pipe';
import { ParentRouteContainerComponent } from 'app/shared/components/routing/parent-route-container/parent-route-container.component';
import { OkButtonComponent } from 'app/shared/components/buttons/ok-button/ok-button.component';
import { CancelButtonComponent } from 'app/shared/components/buttons/cancel-button/cancel-button.component';
import { EditButtonComponent } from 'app/shared/components/buttons/edit-button/edit-button.component';
import { RoundPipe } from 'app/shared/pipes/round.pipe';
import { ButtonComponent, TemplateButtonComponent } from 'app/shared/components/buttons/button/button.component';
import { CloseButtonComponent } from 'app/shared/components/buttons/close-button/close-button.component';
import { ReloadButtonComponent } from 'app/shared/components/buttons/reload-button/reload-button.component';
import { ResetButtonComponent } from 'app/shared/components/buttons/reset-button/reset-button.component';
import { BooleanInputComponent } from 'app/shared/components/inputs/boolean-input/boolean-input.component';
import { ListFormatPipe } from 'app/shared/pipes/list-format.pipe';
import { FlagsEnumDisplayNamePipe } from './pipes/flags-enum-display-name.pipe';
import { LabelHeaderDirective } from 'app/shared/components/base-label.component';

@NgModule({
  declarations: [
    LabelHeaderDirective,
    LabelComponent,
    LoaderComponent,
    NotFoundComponent,
    DeleteButtonComponent,
    InputComponent,
    BackButtonComponent,
    DateFormatPipe,
    DateTimeFormatPipe,
    MinValidatorDirective,
    MaxValidatorDirective,
    EnumInputComponent,
    MessageComponent,
    NotFoundMessageComponent,
    ErrorMessageComponent,
    EnumDisplayNamePipe,
    NewButtonComponent,
    InputLoaderComponent,
    BooleanDisplayNamePipe,
    SaveButtonComponent,
    PageTitleComponent,
    NullFormatPipe,
    InputErrorMessageComponent,
    ControlLoaderComponent,
    TimeFormatPipe,
    ParentRouteContainerComponent,
    OkButtonComponent,
    CancelButtonComponent,
    EditButtonComponent,
    RoundPipe,
    ButtonComponent,
    CloseButtonComponent,
    ReloadButtonComponent,
    ResetButtonComponent,
    TemplateButtonComponent, // Este componente é de uso interno do módulo shared e não deve ser exportado
    BooleanInputComponent,
    ListFormatPipe,
    FlagsEnumDisplayNamePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    RouterModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    TooltipModule,
    LabelHeaderDirective,
    LabelComponent,
    LoaderComponent,
    DeleteButtonComponent,
    InputComponent,
    BackButtonComponent,
    DateFormatPipe,
    DateTimeFormatPipe,
    MinValidatorDirective,
    MaxValidatorDirective,
    EnumInputComponent,
    MessageComponent,
    NotFoundMessageComponent,
    ErrorMessageComponent,
    EnumDisplayNamePipe,
    FlagsEnumDisplayNamePipe,
    NewButtonComponent,
    InputLoaderComponent,
    BooleanDisplayNamePipe,
    SaveButtonComponent,
    PageTitleComponent,
    NullFormatPipe,
    InputErrorMessageComponent,
    ControlLoaderComponent,
    TimeFormatPipe,
    ParentRouteContainerComponent,
    OkButtonComponent,
    CancelButtonComponent,
    EditButtonComponent,
    RoundPipe,
    ButtonComponent,
    CloseButtonComponent,
    ReloadButtonComponent,
    ResetButtonComponent,
    BooleanInputComponent,
    ListFormatPipe
  ],
  providers: [
    NullFormatPipe,
    EnumDisplayNamePipe,
    FlagsEnumDisplayNamePipe,
    BooleanDisplayNamePipe,
    ListFormatPipe,

    DateFormatPipe,
    DateTimeFormatPipe,
    TimeFormatPipe,

    DecimalPipe,
    CurrencyPipe,
    PercentPipe,
    RoundPipe,

    UpperCasePipe,
    LowerCasePipe,
    TitleCasePipe
  ]
})
export class SharedModule { }
