import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs';

import { HttpObservableService } from './http-observable.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private httpObservableService: HttpObservableService;

  /**
   * @method constructor
   * @param injector [description]
   */
  constructor(private injector: Injector) {
    this.httpObservableService = injector.get(HttpObservableService);
  }

  /**
   * @method intercept
   * @param request [description]
   * @param next [description]
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.httpObservableService.onRequestStart();

    return next.handle(request).pipe(
      finalize(() => {
        this.httpObservableService.onRequestDone();
      })
    );
  }
}


export function HttpInterceptorServiceFactory(injector: Injector): HttpInterceptorService {
  return new HttpInterceptorService(injector);
}
