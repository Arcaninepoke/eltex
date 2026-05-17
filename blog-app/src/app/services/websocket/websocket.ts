import {Injectable} from '@angular/core';
import {catchError, EMPTY, filter, map, Observable} from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class WebsocketService {
  private socket$: WebSocketSubject<any>|null = null;
  private readonly SERVER_URL = 'ws://localhost:3000';

  constructor() {
    if (environment.useGraphQL) {
      try {
        this.socket$ = webSocket(this.SERVER_URL);

        this.socket$.subscribe();
      } catch (e) {
        console.error('Ошибка инициализации сокетов:', e);
      }
    } else {
      console.log('режим LocalStorage');
    }
  }

  joinArticleTopic(articleId: string) {
    if (!this.socket$) return;
    this.socket$.next({event: 'subscribe-article', data: articleId});
  }

  leaveArticleTopic(articleId: string) {
    if (!this.socket$) return;
    this.socket$.next({event: 'unsubscribe-article', data: articleId});
  }

  listen<T>(eventName: string): Observable<T> {
    if (!this.socket$) return EMPTY;

    return this.socket$.asObservable().pipe(
        filter((msg: any) => msg.event === eventName),
        map((msg: any) => msg as T), catchError(err => {
          console.warn(`[WS] Ошибка в потоке ${eventName}:`, err);
          return EMPTY;
        }));
  }
}