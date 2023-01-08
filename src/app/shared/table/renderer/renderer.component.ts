import { AfterContentInit, AfterViewInit, Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'renderer',
  template: `
    <template #container></template>
  `,
  styles: [
  ]
})
export class RendererComponent implements OnInit {

  @ViewChild('container', {read: ViewContainerRef, static: true}) container: ViewContainerRef;

  @Input() render: any;
  @Input() context: {[key: string]: any};

  constructor(
    private resolver: ComponentFactoryResolver
  ) { 
  }
  
  ngOnInit(): void {
    this.renderComponent();
  }
  
  renderComponent(){
    if(!this.container) return;

    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(this.render);
    const component = this.container.createComponent(factory);
    Object.entries(this.context).forEach(entrie => {
      const [ key, value ] = entrie;
      component.instance[key] = value;
    });
  }

}
