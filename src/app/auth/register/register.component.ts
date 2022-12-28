import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public formSubmited: boolean = false;

  public registerForm  = this.fb.group({
    nombre: ['Fernando', Validators.required],
    email: ['dr.yahred@outlook.es', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
    password2: ['123456', [Validators.required, Validators.minLength(6)]],
    terminos: [null, [Validators.required]]
  }, {
    validators: this.passwordIguales('password', 'password2')
  });

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) { }

  passwordIguales(campo1: string, campo2: string){
    return (formGroup: FormGroup) => {
      const control1 = formGroup.get(campo1);
      const control2 = formGroup.get(campo2);

      if(control1.value === control2.value) {
        control1.setErrors(null);
        return 
      };
  
      control1.setErrors({
        passwordDistintas: true
      })
    }
  }

  crearUsuario(){
    this.formSubmited = true;
   
    if(this.registerForm.invalid) return console.log('Formulario Invalido');

    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe({
        next: () => console.log('Usuario Creado'),
        error: (err) => {
          Swal.fire({
            text: err.error.msg,
            icon: 'error'
          });
        }
      });
  }

  campoNoValido(campo: string){
    return this.registerForm.get(campo).invalid && this.formSubmited
  }

  passwordsInvalidas(){
    return this.formSubmited && this.registerForm.get('password').value !== this.registerForm.get('password2').value;
  }

}
