import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { swalError } from '../utilities/swal';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  private get token(): string  {
    return localStorage.getItem('token') || '';
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': this.token
    });
  }

  constructor(
    @Inject('BASE_API_URL') private baseUrl: string
  ) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = this.headers
    const reqClone = req.clone({headers, url: `${this.baseUrl}${req.url}`});

    return next.handle(reqClone)
      .pipe(
        catchError(this.manejarError)
      )
  }

  manejarError(error: HttpErrorResponse){
    swalError();
    return throwError(error.message);
  }

}
