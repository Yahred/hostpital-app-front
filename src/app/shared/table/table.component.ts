import { AfterContentInit, AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren, ViewContainerRef } from '@angular/core';

import { TablaDefinicion } from 'src/app/interfaces';
import { AvatarComponent } from 'src/app/pages/mantenimientos/usuarios/avatar/avatar.component';
import { RenderDirective } from '../directives/render.directive';
import { RendererComponent } from './renderer/renderer.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent{

  @ViewChildren(RendererComponent, {read: RendererComponent}) renderers: QueryList<RendererComponent>;
  @ViewChildren('containers', { read: ViewContainerRef }) containers: QueryList<ViewContainerRef>;

  @Input() hidePagination: boolean = false;
  @Input() total: number = 0;
  @Input() itemsPorPagina: number = 5;
  @Input() desde: number = 0;
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() definicion: TablaDefinicion = {
    labels: [],
    data: [],
    bindValues: []
  };

  @Output() onEditClick = new EventEmitter();
  @Output() onDeleteClick = new EventEmitter();
  @Output() onNextClick = new EventEmitter();
  @Output() onPrevClick = new EventEmitter();

  get totalElementosPagina(): number {
    return this.definicion.data.length;
  }

  constructor(
  ) {}
  
  editClick(event){
    this.onEditClick.emit(event);
  }

  deleteClick(event){
    this.onDeleteClick.emit(event);
  }

  nextClick(){
    if(this.desde + this.itemsPorPagina > this.total) return this.onNextClick.emit(this.desde)

    this.desde += this.itemsPorPagina;
    this.onNextClick.emit(this.desde)
  }

  prevClick(){
    if(this.desde - this.itemsPorPagina < 0) return this.onPrevClick.emit(this.desde);

    this.desde -= this.itemsPorPagina;
    this.onPrevClick.emit(this.desde);
  }

}
