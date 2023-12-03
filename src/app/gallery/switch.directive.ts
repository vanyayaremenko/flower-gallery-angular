import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { KeyboardCode } from './enums/enums';

@Directive({
  selector: '[switch]',
})
export class SwitchDirective {
  @Input() isSwitch: boolean = false;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() switchNext: EventEmitter<boolean> = new EventEmitter();
  @Output() switchPrevious: EventEmitter<boolean> = new EventEmitter();

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == KeyboardCode.Escape || event.key == 'Esc') {
      if (this.isSwitch) {
        this.closeModal.emit();
      }
    } else if (
      event.key == KeyboardCode.ArrowUp ||
      event.key == KeyboardCode.ArrowLeft
    ) {
      if (this.isSwitch) {
        this.switchNext.emit();
      }
    } else if (
      event.key == KeyboardCode.ArrowDown ||
      event.key == KeyboardCode.ArrowRight
    ) {
      if (this.isSwitch) {
        this.switchPrevious.emit();
      }
    }
  }
}
