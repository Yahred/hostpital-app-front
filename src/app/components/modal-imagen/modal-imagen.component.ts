import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { ModalImagenService } from '../../services/modal-imagen.service';

import { Usuario } from 'src/app/models';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagen: File;
  public imgTemp: any;

  constructor(
    public modalService: ModalImagenService,
    private fileUploadService: FileUploadService
  ) {
  }

  ngOnInit(): void {
  }
  
  guardarImagen(){
    this.fileUploadService.actualizarFoto(this.imagen, this.modalService.tipo, this.modalService.id)
      .then((img) => {
        Swal.fire({
          text: 'Exito',
          icon: 'success'
        });
        this.modalService.nuevaImagen.emit(img)
        this.cerrarModal();
      })
      .catch((err) => Swal.fire({
        text: err.msg,
        icon: 'error'
      }));
  }

  cerrarModal(){
    this.imgTemp = '';
    this.modalService.cerrarModal();
  }

  cambiarImagen(file: File){
    this.imagen = file;

    if(!file) {
      this.imgTemp = '';
      return;
    }

    const reader: FileReader = new FileReader();
    const url64 = reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

}
