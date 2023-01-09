import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Hospital, Medico } from 'src/app/models';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicosService } from 'src/app/services/medicos.service';
import { swalSuccess } from 'src/app/utilities/swal';

@Component({
  selector: 'app-registro-medico',
  templateUrl: './registro-medico.component.html',
  styles: [
  ]
})
export class RegistroMedicoComponent implements OnInit {

  public formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    hospital: ['', [Validators.required]]
  });

  public medicoSeleccionado: Medico;
  public hospitalSeleccionado: Hospital;
  public hospitales: Hospital[] = [];

  get hospitalSeleccionadoImg(): string {
    if(!this.hospitalSeleccionado) return '';

    return this.hospitalSeleccionado.img;
  }

  constructor(
    private fb: FormBuilder,
    private hospitalesService: HospitalService,
    private medicoService: MedicosService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(({id}) => this.cargarMedico(id));

    this.cargarHospitales();

    this.formulario.get('hospital').valueChanges
    .subscribe(idSeleccionado => {
      this.hospitalSeleccionado = this.hospitales.find(({id}) => id === idSeleccionado);
    })
  }

  cargarMedico(id: string){
    if(id === 'nuevo') return;

    this.medicoService.obtenerMedicoPorId(id)
      .subscribe(medico => {
        this.medicoSeleccionado = medico;
        this.formulario.get('nombre').setValue(medico.nombre);
        this.formulario.get('hospital').setValue(medico.hospital._id)
        this.hospitalSeleccionado = this.hospitales.find(({id}) => id === medico.hospital._id);
      })
  }

  cargarHospitales(){
    this.hospitalesService.getHospitales()
      .subscribe((hospitales) => {
        this.hospitales = hospitales;
      })
  }

  guardarRegistro(){
    if(this.formulario.invalid) return;

    const { nombre, hospital } = this.formulario.value;

    if(this.medicoSeleccionado){
      const { id } = this.medicoSeleccionado;
      this.medicoService.actualizarMedico(id, nombre, hospital)
        .subscribe(() => {
          swalSuccess();
          this.router.navigateByUrl('/dashboard/medicos')
        });
        return;
    }

    this.medicoService.crearMedico(nombre, hospital)
      .subscribe(() => {
        this.formulario.reset();
        swalSuccess();
      });
  }

}
