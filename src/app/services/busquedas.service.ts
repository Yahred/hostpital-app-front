import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Usuario } from '../models';

const { base_url } = environment;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
    private http: HttpClient
  ) { }

  get token () {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        Authorization: this.token
      }
    }
  }

  transformarRespuesta(tipo: string, resp: any[]){
    const mapa= {
      'usuarios': (resp) => this.crearInstanciasUsuarios(resp)
    }

    return mapa[tipo](resp);
  }

  crearInstanciasUsuarios(resp){
    return resp.resultado.map(
      ({nombre, email, img, role, google, uid}) => new Usuario(nombre, email, '', google, img, role, uid))
  }

  buscar(tipo: 'usuarios'|'medicos'|'hospitales',
    termino: string = ''
  ){
    const url = base_url + `/todo/coleccion/${tipo}/${termino}`
    return this.http.get(url, this.headers)
      .pipe(
        map(
          (resp: any[]) => this.transformarRespuesta(tipo, resp)
        )
      );
  }  
}
