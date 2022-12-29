import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Usuario } from '../models'

import { ActualizarPerfilForm, RegisterForm } from '../interfaces';
import { environment } from 'src/environments/environment';

const { base_url } = environment;

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) { }

  get token () {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

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
    return this.http.get(base_url + '/login/renew', {
      headers: {
        'Authorization': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { nombre, email, img = '', google, role, uid } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', google, img, role, uid);
        localStorage.setItem('token', resp.token);
        return true
      }),
      catchError(err => of(false))
    );
  } 

  actualizarUsuario( usuario: ActualizarPerfilForm){
    usuario = {
      ...usuario,
      role: this.usuario.role
    }
    return this.http.put(base_url + '/usuarios/' + this.uid, usuario, {
      headers: {
        'Authorization': this.token
      }
    }).pipe(
      tap((resp: any) => {
        console.log(resp.usuarioActualizado);
        const { nombre, email } = resp.usuarioActualizado;

        this.usuario.nombre = nombre;
        this.usuario.email = email;
      })
    )
  }

  logOut(){
    localStorage.removeItem('token');

    google.accounts.id.revoke('yahredmax@gmail.com', () => {});
  }

}
