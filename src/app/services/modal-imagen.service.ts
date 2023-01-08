import { EventEmitter, Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Tipo } from '../interfaces';

const { base_url } = environment

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

  constructor() { }

  public abrirModal(tipo: Tipo, id: string, img: string = 'no-img'){
    this.tipo = tipo;
    this.id = id;

    if(img.includes('https')) this.img = img;
    else this.img = `${base_url}/uploads/${tipo}/${img}`

    this._ocultarModal = false;
  }

  public cerrarModal(){
    this._ocultarModal = true;
  }

}
