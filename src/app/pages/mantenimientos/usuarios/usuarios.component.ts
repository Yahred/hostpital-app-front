import { Component, ComponentFactoryResolver, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { AvatarComponent } from './avatar/avatar.component';

import { TablaDefinicion } from 'src/app/interfaces';
import { Usuario } from 'src/app/models';
import { swalConfirm, swalSuccess } from '../../../utilities/swal';
import { SelectRoleComponent } from './select-role/select-role.component';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  @ViewChild('txtTermino') txtTermino: ElementRef

  public avatarComponent = AvatarComponent;
  public listadoUsuarios: Usuario[] = [];
  public listadoTmp: Usuario[] = [];
  public total: number = 0;
  public desde: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public isLoading: boolean = false;
  public nuevaImagenSub: Subscription;


  public definicionTabla: TablaDefinicion = {
    labels: [],
    data: [],
    bindValues: []
  };

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }
 
  ngOnDestroy(): void {
    this.desde.unsubscribe();
    this.nuevaImagenSub.unsubscribe();
  }

  ngOnInit(): void {
    this.desde.subscribe((valor) => {
      this.isLoading = true;
      this.obtenerPaginado(valor);
    });

    this.nuevaImagenSub = this.modalImagenService.nuevaImagen.subscribe(img => this.recargarUsuarios())
  }

  recargarUsuarios(){
    const termino: string =  this.txtTermino.nativeElement.value;
    if(termino){
      this.buscar(termino)
      return;
    }

    this.obtenerPaginado(this.desde.value);
  }

  obtenerPaginado(desde: number){
    this.usuarioService.obtenerPaginacion(desde)
      .subscribe(({total, usuarios}) => {
        this.listadoTmp = usuarios;
        this.actualizarTabla(usuarios, total);
        this.isLoading = false;
      });
  }

  buscar(termino: string){
    if(!termino) return this.actualizarTabla(this.listadoTmp, this.listadoTmp.length);

    this.isLoading = true;
    this.busquedasService.buscar('usuarios', termino)
      .subscribe((resp: any[]) => {
        this.actualizarTabla(resp, resp.length);
        this.isLoading = false;
      });
  }

  actualizarTabla(usuarios: Usuario[], total: number){
    this.listadoUsuarios = usuarios;
    this.total = total; 

    this.definicionTabla = {
      labels: ['Avatar', 'Correo', 'Nombre', 'Role'],
      data: this.listadoUsuarios.map(usuario => {
        return ({
          ...usuario,
          img: {
            render: {
              component: AvatarComponent,
              input: {
                url: usuario.imagenUrl,
                click: () => this.abrirModal(usuario.uid, usuario.img)
              }
            }
          },
          role: {
            render: {
              component: SelectRoleComponent,
              input: {
                uid: usuario.uid,
                usuario
              }
            }
          }
        });
      }),
      bindValues: ['img', 'email', 'nombre', 'role'],
    }
  }

  abrirModal(id: string, img: string){
    this.modalImagenService.abrirModal('usuarios', id, img);
  }
  
  eliminarUsuario(usuario: Usuario){
    if(usuario.uid === this.usuarioService.uid) return Swal.fire({
      icon: 'error',
      title: 'No puede borrar su propio usuario'
    });

    swalConfirm(`La acción eliminará al usuario ${usuario.nombre} permanentemente`)
      .then((result) => {
        if(result.isDenied) return;

        this.usuarioService.eliminarUsuario(usuario.uid)
          .subscribe(() => {
            if(this.txtTermino.nativeElement.value) this.buscar(this.txtTermino.nativeElement.value)
            else this.desde.next(0);
            swalSuccess();
          });  
      })
  }

}
