import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxEditorModule} from 'ngx-editor';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {provideHttpClient} from '@angular/common/http';
import {provideNativeDateAdapter} from '@angular/material/core';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    importProvidersFrom(
      BrowserAnimationsModule,
      NgxEditorModule,
      MatSnackBarModule
    ),
    provideNativeDateAdapter(),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.fake-dark-selector',
        }
      },
    })]

};
