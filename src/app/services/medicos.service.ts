import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Medico } from '../models';
import { debounceTime, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  constructor(
    private http: HttpClient
  ) { }

  getMedicos(){
    return this.http.get<{ok: boolean, medicos: Medico[]}>('/medicos')
      .pipe(
        map(({medicos}) => medicos)
      );
  }

  obtenerMedicoPorId(id: string){
    return this.http.get<{ok: boolean, medico: Medico}>(`/medicos/${id}`)
                    .pipe(
                      map(({medico}) => medico)
                    );
  }

  crearMedico(nombre: string, hospital: string){
    return this.http.post('/medicos', {nombre, hospital});
  }

  actualizarMedico(id: string, nombre: string, hospital: string){
    return this.http.put(`/medicos/${id}`, {nombre, hospital});
  }

  eliminarMedico(id: string){
    return this.http.delete(`/medicos/${id}`);
  }

}
