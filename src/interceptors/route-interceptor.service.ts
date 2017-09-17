import { Injectable, Optional } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router'

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RouteInterceptorService {
  private _isPendingRouteSubject = new Subject<boolean>();

  /**
   * @method constructor
   * @param  {ConnectionBackend} connectionBackend [description]
   * @param  {RequestOptions}    requestOptions    [description]
   */
  constructor(@Optional() private router: Router) {
    if(this.router) {
      router.events.subscribe((event: RouterEvent) => {
        this.routerInterceptor(event)
      });
    }
  }

  /**
   * [isPendingRoute description]
   * @method isPendingRoute
   * @return {Observable<boolean>} [description]
   */
  get isPendingRoute(): Observable<boolean> {
    return this._isPendingRouteSubject.asObservable();
  }

  /**
   * [routerInterceptor description]
   * @method routerInterceptor
   * @param  {RouterEvent}     event [description]
   */
  private routerInterceptor(event: RouterEvent): void {
    if(event instanceof NavigationStart) {
      this.onRouteStart();
    }
    if(event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
      this.onRouteDone();
    }
  }

  /**
   * [onRequestStart description]
   * @method onRequestStart
   */
  private onRouteStart(): void {
    this._isPendingRouteSubject.next(true);
  }

  /**
   * [onRequestDone description]
   * @method onRequestDone
   */
  private onRouteDone(): void {
    this._isPendingRouteSubject.next(false);
  }
}
