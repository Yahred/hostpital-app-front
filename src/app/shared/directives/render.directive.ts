import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[render]'
})
export class RenderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
