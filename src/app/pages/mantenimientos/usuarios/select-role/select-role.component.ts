import { Component, Input } from '@angular/core';

import { UsuarioService } from 'src/app/services/usuario.service';

import { Usuario } from 'src/app/models';
import { swalSuccess } from 'src/app/utilities/swal';

@Component({
  selector: 'app-select-role',
  template: `
    <select 
      class="form-control"
      [(ngModel)]="usuario.role"
      (change)="cambiarRole()"
    >
      <option value="USER_ROLE">Usuario</option>
      <option value="ADMIN_ROLE">Admin</option>
    </select>
  `,
  styles: [
  ]
})
export class SelectRoleComponent {

  @Input() usuario: Usuario;
  @Input() roleSeleccionado: 'ADMIN_ROLE' | 'USER_ROLE';

  constructor(
    private usuarioService: UsuarioService
  ) { }
  cambiarRole(){
    this.usuarioService.guardarUsuario(this.usuario)
      .subscribe(() => swalSuccess());
  }

}
