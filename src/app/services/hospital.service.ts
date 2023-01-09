import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { map } from 'rxjs/operators'

import { Hospital } from '../models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private http: HttpClient
  ) { }


  getHospitales(){
    return this.http.get<{ok: boolean, hospitales: Hospital[]}>('/hospitales')
                      .pipe(
                        map(resp => {
                          const {ok, hospitales} = resp;

                          return hospitales;
                        })
                      )
  }

  crearHospital(nombre: string){
    return this.http.post('/hospitales', {
      nombre
    });
  }

  actualizarHospital(_id: string, nombre: string){
    return this.http.put(`/hospitales/${_id}`, {
      nombre
    });
  }

  borrarHospital(_id: string){
    return this.http.delete(`/hospitales/${_id}`);
  }

}
