import {InjectionToken} from '@angular/core';

import {PostServiceInterface} from './post-service.interface';

export const POST_SERVICE_TOKEN =
    new InjectionToken<PostServiceInterface>('PostServiceToken');