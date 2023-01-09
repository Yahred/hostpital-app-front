import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';

import { Usuario } from '../models'

import { ActualizarPerfilForm, PaginadoUsuarios, RegisterForm } from '../interfaces';
import { swalError } from '../utilities/swal';


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

  get uid(): string {
    return this.usuario.uid || '';
  }

  crearUsuario( formData: RegisterForm ){
    return this.http.post('/usuarios', formData)
                    .pipe(
                      tap((resp: any) => {
                        localStorage.setItem('token', resp.token);
                      })
                    );
  }

  login(formData: RegisterForm){
    return this.http.post('/login', formData)
                      .pipe(
                        tap((resp: any) => {
                          localStorage.setItem('token', resp.token);
                        })
                      );
  }

  loginGoogle(token: string){
    return this.http.post('/login/google', {token})
                      .pipe(
                        tap((resp: any) => {
                          localStorage.setItem('token', resp.token);
                        }),
                        catchError(() => throwError('La contraseña o el email son incorrectos'))
                      );
  }

  validarToken(){
    return this.http.get('/login/renew').pipe(
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
    
    return this.http.put('/usuarios/' + this.uid, usuario).pipe(
      tap((resp: any) => {
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

  obtenerPaginacion(desde: number){
    const url = `/usuarios?desde=${desde}`;
    return this.http.get<PaginadoUsuarios>(url)
      .pipe(
        delay(200),
        map(resp => {
          resp.usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.google, user.img, user.role, user.uid)
          );
          return resp;
        })
      );
  }

  eliminarUsuario(uid: string){
    const url = `/usuarios/${uid}`;

    return this.http.delete(url);
  }

  guardarUsuario(usuario: Usuario){

    return this.http.put('/usuarios/' + usuario.uid, usuario);
  }

}
