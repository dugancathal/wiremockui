import { Directive, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@Directive({
  selector: '[debouncedKeyup]'
})
export class DebounceKeyupDirective implements OnInit, OnDestroy {
  @Output() debouncedKeyup = new EventEmitter();
  private strokes = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.strokes.pipe(debounceTime(150))
      .subscribe(e => this.debouncedKeyup.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('keyup', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.strokes.next(event);
  }
}