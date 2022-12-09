import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { SharedModule } from './shared/shared.module';
import { environment } from 'environments/environment';
import { SupportedCultures } from './core/models/localization/supported-cultures';
import { MovementComponent } from './pages/movement/movement.component';
import { ConsolidatedComponent } from './pages/consolidated/consolidated.component';
import { MovementEditComponent } from './pages/movement-edit/movement-edit.component';
import { HomeComponent } from './pages/home/home.component';

import '@angular/common/locales/pt';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    MovementComponent,
    ConsolidatedComponent,
    MovementEditComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: SupportedCultures.Default
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    {
      provide: 'BASE_URL',
      useFactory: getBaseUrl
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(far);
    library.addIconPacks(fas);
    library.addIcons(faCoffee);
  }
}

export function getBaseUrl(): string {
  return environment.baseUrl;
}
