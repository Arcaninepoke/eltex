import {provideHttpClient} from '@angular/common/http';
import {ApplicationConfig, inject, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {InMemoryCache} from '@apollo/client';
import {provideApollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';

import {environment} from '../environments/environment';

import {routes} from './app.routes';
import {graphqlProvider} from './graphql.provider';
import {ArticlesApiHttpService} from './services/api/articles-api.service';
import {ARTICLE_SERVICE_TOKEN} from './services/articles/articles-service.token';
import {ArticlesService} from './services/articles/articles.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: ARTICLE_SERVICE_TOKEN,
      useClass: environment.production ? ArticlesService :
                                         ArticlesApiHttpService,
    },
    provideHttpClient(),
    ...graphqlProvider,
  ],
};
