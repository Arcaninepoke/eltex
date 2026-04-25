import {InjectionToken} from '@angular/core';

import {ArticlesServiceInterface} from './articles-service.interface';

export const ARTICLE_SERVICE_TOKEN =
    new InjectionToken<ArticlesServiceInterface>('ARTICLE_SERVICE_TOKEN');