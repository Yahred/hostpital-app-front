import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { 
    this.usuario = usuarioService.usuario;
  }

  logOut(){
    this.usuarioService.logOut();
    this.router.navigateByUrl('/login');
  }

}
