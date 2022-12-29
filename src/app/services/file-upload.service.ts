import { Injectable } from '@angular/core';

import { UsuarioService } from './usuario.service';

import { environment } from '../../environments/environment';

const { base_url } = environment;
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private usuarioService: UsuarioService
  ) { }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string
  ){
    try {
      const url = `${base_url}/uploads/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);

      const response: any = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': this.usuarioService.token
        },
        body: formData
      });
      const { nombreArchivo } = await response.json();
      this.usuarioService.usuario.img = nombreArchivo;

      return true;
    } catch (error) {
      console.log('asasas')
      throw error;
    }
  }

}
