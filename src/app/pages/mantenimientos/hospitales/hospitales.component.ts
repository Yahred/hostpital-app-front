import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TablaDefinicion } from 'src/app/interfaces';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { CAMPO_REQUERIDO } from 'src/app/utilities/mensajes';
import { swalConfirm, swalSuccess } from 'src/app/utilities/swal';
import Swal from 'sweetalert2';

import { HospitalService } from '../../../services/hospital.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public isLoading: boolean = true;

  public tablaDefinicion: TablaDefinicion = {
    labels: ['Foto', 'Nombre'],
    data: [],
    bindValues:['img', 'nombre']
  };

  public listadoHospitales: Hospital[] = [];
  public listadoTmp: Hospital[] = [];

  private hospitalesSubscription: Subscription;
  private imgSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService
  ) { }
  
  ngOnInit(): void {
    this.obtenerHospitales(); 
    this.imgSubs = this.modalImagenService.nuevaImagen.subscribe(() => {
      this.obtenerHospitales();
    })
  }
  
  ngOnDestroy(): void {
    this.hospitalesSubscription.unsubscribe();
    this.imgSubs.unsubscribe();
  }

  obtenerHospitales(){
    this.hospitalesSubscription = this.hospitalService.getHospitales()
      .subscribe((hospitales) => {
        this.listadoHospitales = hospitales;
        this.isLoading = false;
      });
  }
  
  buscarHospitales(termino: string){
    this.isLoading = true;
    if(!termino) {
      this.listadoHospitales = this.listadoTmp;
      this.isLoading = false;
      return;
    }

    this.busquedaService.buscar('hospitales', termino)
      .subscribe(hospitales => {
        this.listadoTmp = this.listadoHospitales;
        this.listadoHospitales = hospitales; 
        this.isLoading = false;
      });
  }

  guardarCambios(id: string, nombre: string){
    swalConfirm()
      .then(result => {
        if(result.isDenied) return;
    
        this.hospitalService.actualizarHospital(id, nombre)
          .subscribe(() => swalSuccess());
      });
  }

  eliminarHospital(id: string){
    swalConfirm()
      .then(result => {
        if(result.isDenied || result.isDismissed) return;
      
        this.hospitalService.borrarHospital(id)
          .subscribe(() => {
            this.obtenerHospitales();
            swalSuccess()
          });
      });
  }

  abrirModalRegistro(){
    Swal.fire({
      title: 'Registro de Hospital',
      input: 'text',
      inputPlaceholder: 'Introduzca el nombre del nuevo hospital',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    })
      .then((result) => {
        if(!result.isConfirmed) return;

        const { value: nombre } = result;
        if(!nombre) return Swal.fire({
          icon: 'warning',
          text: CAMPO_REQUERIDO('Nombre')
        });

        this.hospitalService.crearHospital(nombre)
          .subscribe(() => {
            this.obtenerHospitales();
            swalSuccess();
          });
      });
  }

  abrirModalImagen(id: string, img: string){
    this.modalImagenService.abrirModal('hospitales', id, img);
  }

}
