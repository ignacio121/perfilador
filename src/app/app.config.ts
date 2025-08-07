import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAuth0 } from '@auth0/auth0-angular';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../core/services/token.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';


const authConfig = require('../../auth_config.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([])),
    provideAuth0({
      domain: authConfig.domain,
      clientId: authConfig.clientId,
      authorizationParams: {
        audience: "https://myapp/api",
        redirect_uri: window.location.origin + "/home",
        scope: "openid profile email",
      },
      errorPath: "/error",
      skipRedirectCallback: false,
      cacheLocation: "localstorage",
    }),
    importProvidersFrom(
      HttpClientModule, // Agregado para proveer HttpClient
      MatToolbarModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatDividerModule,
      MatPaginatorModule
    ),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
};
