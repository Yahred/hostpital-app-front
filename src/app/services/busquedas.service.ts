import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { debounceTime, map } from 'rxjs/operators';

import { Medico, Usuario } from '../models';
import { Hospital } from '../models/hospital.model';


@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
    private http: HttpClient
  ) { }


  transformarRespuesta(tipo: string, resp: any[]){
    const mapa = {
      'usuarios': (resp) => this.crearInstanciasUsuarios(resp),
      'hospitales': (resp) => this.crearInstanciasHospitales(resp),
      'medicos': (resp) => this.crearInstanciasMedicos(resp)
    }

    return mapa[tipo](resp);
  }

  crearInstanciasMedicos(resp){
    return resp.resultado.map(
      ({nombre, img, id, hospital, usuario}) => new Medico(nombre, id, img, hospital, usuario)
    );
  }

  crearInstanciasUsuarios(resp){
    return resp.resultado.map(
      ({nombre, email, img, role, google, uid}) => new Usuario(nombre, email, '', google, img, role, uid))
  }

  crearInstanciasHospitales(resp){
    return resp.resultado.map(
      ({nombre, img, usuario, id}) => new Hospital(nombre, img, id, usuario)
    );
  }

  buscar(tipo: 'usuarios'|'medicos'|'hospitales',
    termino: string = ''
  ){
    const url = `/todo/coleccion/${tipo}/${termino}`
    return this.http.get(url)
      .pipe(
        map(
          (resp: any[]) => this.transformarRespuesta(tipo, resp)
        )
      );
  }  
}
