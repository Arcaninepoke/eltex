import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {ARTICLE_SERVICE_TOKEN} from './services/articles/articles-service.token';
import {ArticlesService} from './services/articles/articles.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), provideRouter(routes),
    {provide: ARTICLE_SERVICE_TOKEN, useClass: ArticlesService}
  ]
};
