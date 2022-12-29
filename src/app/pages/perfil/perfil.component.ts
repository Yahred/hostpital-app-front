import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';
 
import { Usuario } from 'src/app/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public usuario: Usuario
  public perfilFormulario: FormGroup;
  public imagen: File
  public imgTemp: any = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) { 
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilFormulario = this.fb.group({
      nombre: [this.usuario.nombre,  Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
  }

  actualizarPerfil(){
    console.log(this.perfilFormulario.value);
    this.usuarioService.actualizarUsuario(this.perfilFormulario.value)
      .subscribe({
        next: () => Swal.fire({
          text: 'Exito',
          icon: 'success'
        }),
        error: (err) => {
          console.log(err)
          Swal.fire({
            text: err.error.msg,
            icon: 'error'
          })
        }
      });
    
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

  guardarImagen(){
    this.fileUploadService.actualizarFoto(this.imagen, 'usuarios', this.usuario.uid)
      .then(() => Swal.fire({
        text: 'Exito',
        icon: 'success'
      }))
      .catch((err) => Swal.fire({
        text: err.msg,
        icon: 'error'
      }))
  }

}
