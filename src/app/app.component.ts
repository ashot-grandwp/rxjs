import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'rxjs';

  ngOnInit(): void {
    of(1, 2, 3).pipe(aDelay(1000)).subscribe(console.log);

    of('hello').pipe(aUpperCase()).subscribe(console.log);
  }

}

  function aDelay<T>(delayInMillis: number) {
  return (observable: Observable<T>) =>
    new Observable<T>((subscriber) => {
      const allTimerIDs = new Set();
      let hasCompleted = false;
      const subscription = observable.subscribe({
        next(value) {
          const timerID = setTimeout(() => {
            subscriber.next(value);
            allTimerIDs.delete(timerID);
            if (hasCompleted && allTimerIDs.size === 0) {
              subscriber.complete();
            }
          }, delayInMillis);

          allTimerIDs.add(timerID);
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          hasCompleted = true;
          if (allTimerIDs.size === 0) {
            subscriber.complete();
          }
        },
      });

      return () => {
        subscription.unsubscribe();

        for (const timerID of allTimerIDs) {
          // @ts-ignore
          clearTimeout(timerID);
        }
      };
    });
}


function aUpperCase(){
  return (source: Observable<any>) =>
    new Observable(observer => {
      return source.subscribe({
        next(x){ observer.next(x.toUpperCase()); },
        error(err) { observer.error(err); },
        complete() { observer.complete(); }
      });
    })
}







