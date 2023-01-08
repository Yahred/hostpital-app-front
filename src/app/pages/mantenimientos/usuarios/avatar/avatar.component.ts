import { Component, Input, OnInit } from '@angular/core';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'usuario-avatar',
  template: `
    <img (click)="click()" class="img-avatar | cursor" [src]="url">
  `,
  styles: [
    
  ]
})
export class AvatarComponent {

  @Input() url;
  @Input() click;
 
  constructor(
    private modalImagenService: ModalImagenService
  ) {}

}
