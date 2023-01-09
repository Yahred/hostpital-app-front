import { Inject, Pipe, PipeTransform } from '@angular/core';

import { Tipo } from '../interfaces';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  constructor(
    @Inject('BASE_API_URL') private baseUrl: string
  ) {}

  transform(img: string, tipo: Tipo): string {
    if(!img) return `${this.baseUrl}/uploads/usuarios/no-img`   
    
    if(img.includes('https')) return img;

    return `${this.baseUrl}/uploads/${tipo}/${img}`;
  }

}
