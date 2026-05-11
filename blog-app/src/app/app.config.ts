import {provideHttpClient} from '@angular/common/http';
import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';

import {environment} from '../environments/environment';

import {routes} from './app.routes';
import {ArticlesApiHttpService} from './services/api/articles-api.service';
import {ARTICLE_SERVICE_TOKEN} from './services/articles/articles-service.token';
import {ArticlesService} from './services/articles/articles.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), provideRouter(routes),
    provideHttpClient(), {
      provide: ARTICLE_SERVICE_TOKEN,
      useClass: environment.production ? ArticlesService :
                                         ArticlesApiHttpService
    }
  ]
};
