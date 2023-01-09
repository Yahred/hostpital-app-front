import { Inject, Injectable } from '@angular/core';

import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private usuarioService: UsuarioService,
    @Inject('BASE_API_URL') private baseUrl: string
  ) { }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string
  ){
    try {
      const url = `${this.baseUrl}/uploads/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);
      const token = localStorage.getItem('token');

      const response: any = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        body: formData
      });
      const { nombreArchivo } = await response.json();
      this.usuarioService.usuario.img = nombreArchivo;

      return nombreArchivo;
    } catch (error) {
      throw error;
    }
  }

}
