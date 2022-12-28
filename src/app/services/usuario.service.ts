import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RegisterForm } from '../interfaces';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

const { base_url } = environment;

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) { }

  crearUsuario( formData: RegisterForm ){
    return this.http.post(base_url + '/usuarios', formData)
                    .pipe(
                      tap((resp: any) => {
                        localStorage.setItem('token', resp.token);
                      })
                    );
  }

  login(formData: RegisterForm){
    return this.http.post(base_url + '/login', formData)
                      .pipe(
                        tap((resp: any) => {
                          localStorage.setItem('token', resp.token);
                        })
                      );
  }

  loginGoogle(token: string){
    return this.http.post(base_url + '/login/google', {token})
                      .pipe(
                        tap((resp: any) => {
                          localStorage.setItem('token', resp.token);
                        })
                      );
  }

  validarToken(){
    const token = localStorage.getItem('token')  || '';

    return this.http.get(base_url + '/login/renew', {
      headers: {
        'Authorization': token
      }
    }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => true),
      catchError(err => of(false))
    );
  } 

  logOut(){
    localStorage.removeItem('token');

    google.accounts.id.revoke('yahredmax@gmail.com', () => {});
  }

}
