import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, interval, Subscription } from 'rxjs';
import { filter, map, retry, take } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  private intervalSub: Subscription;

  constructor() { }
  ngOnDestroy(): void {
    this.intervalSub.unsubscribe();
  }

  ngOnInit(): void {
    this.intervalSub = this.retornaIntervalor().subscribe(
      console.log
    )
  }

  retornaIntervalor() {
    return interval(100).pipe(
      map(valor => valor + 1),
      filter(valor => valor % 2 == 0),
      //take(6),
    )
  }

  retornaObservable() {
    let i = -1;
    return new Observable<number>(observer => {

      const interval = setInterval(() => {
        console.log('Tick')
        i++
        observer.next(i);

        if(i === 4) {
          clearInterval(interval);
          observer.complete();
        }

        if(i == 2){
          i = 0;
          observer.error('i llegó al valor de dos 2')
          clearInterval(interval);
        }

      }, 1000);
    });

  }

}
