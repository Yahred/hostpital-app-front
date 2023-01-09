import { Component, OnDestroy, OnInit } from '@angular/core';

import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';

import { MedicosService } from '../../../services/medicos.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

import { Medico } from '../../../models'
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { swalConfirm, swalSuccess } from 'src/app/utilities/swal';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public isLoading: boolean;
  public listadoMedicos: Medico[];
  public terminoBusqueda: BehaviorSubject<string> = new BehaviorSubject<string>('')
  
  private listadoTmp: Medico[];
  private medicosSubscription: Subscription;
  private busquedaSubscription: Subscription;
  private terminosBusquedaSubscription: Subscription;

  constructor(
    private medicosService: MedicosService,
    private busquedaService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }
  
  ngOnInit(): void {
    this.obtenerListado();
    this.terminosBusquedaSubscription = this.terminoBusqueda
      .pipe(
        debounceTime(500)
      )
      .subscribe((termino) => {
        this.buscarMedico(termino)
      });
    this.modalImagenService.nuevaImagen.subscribe(() => this.actualizarListado());
  }
  
  ngOnDestroy(): void {
    this.medicosSubscription.unsubscribe();
    this.busquedaSubscription && this.busquedaSubscription.unsubscribe();  
    this.terminoBusqueda.unsubscribe();
    this.terminosBusquedaSubscription.unsubscribe();
  }
  
  actualizarListado(){
    if(!this.terminoBusqueda.value){
      this.obtenerListado();
      return;
    }

    this.buscarMedico(this.terminoBusqueda.value);
  }

  obtenerListado(){
    this.isLoading = true;
    this.medicosSubscription = this.medicosService.getMedicos()
      .subscribe(medicos => {
        this.listadoMedicos = medicos
        this.listadoTmp = medicos;
        this.isLoading = false;
      }); 
  }

  buscarMedico(termino: string){
    if(!termino){
      this.listadoMedicos = this.listadoTmp;
      return;
    }

    this.busquedaSubscription = this.busquedaService.buscar('medicos', termino)
      .subscribe((medicos) => {
        this.listadoTmp = this.listadoMedicos;
        this.listadoMedicos = medicos;
      });
  }

  abrirModal(id: string, img: string){
    this.modalImagenService.abrirModal('medicos', id, img);
  }

  eliminarMedico(id: string){
    swalConfirm()
      .then(result => {
        if(result.isDenied || result.isDismissed) return;

        this.medicosService.eliminarMedico(id)
          .subscribe(() => {
            this.actualizarListado();
            swalSuccess();
          })
      });
  }

}
