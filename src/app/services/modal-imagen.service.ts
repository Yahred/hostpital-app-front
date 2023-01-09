import { EventEmitter, Inject, Injectable } from '@angular/core';

import { Tipo } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;

  public tipo: Tipo;
  public id: string;
  public img: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(): boolean{
    return this._ocultarModal;
  }

  constructor(
    @Inject('BASE_API_URL') private baseUrl: string
  ) { }

  public abrirModal(tipo: Tipo, id: string, img: string = 'no-img'){
    this.tipo = tipo;
    this.id = id;

    if(img.includes('https')) this.img = img;
    else this.img = `${this.baseUrl}/uploads/${tipo}/${img}`

    this._ocultarModal = false;
  }

  public cerrarModal(){
    this._ocultarModal = true;
  }

}
