import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, input } from '@angular/core';
import { injectElementRef } from 'ng-primitives/internal';
import { ngpButton, provideButtonState } from './button-state';

@Directive({
  selector: '[ngpButton]',
  exportAs: 'ngpButton',
  providers: [provideButtonState({ inherit: false })],
})
export class NgpButton {
  protected readonly elementRef = injectElementRef();
  protected element = this.elementRef.nativeElement;

  /**
   * Whether the button is disabled.
   */
  readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /**
   * The role of the button.
   */
  readonly role = input<string | null>(null);

  /**
   * The button state.
   */
  protected readonly state = ngpButton({
    disabled: this.disabled,
    role: this.role,
  });

  /**
   * Set the disabled state of the button.
   * @param value The disabled state.
   */
  setDisabled(value: boolean): void {
    this.state.setDisabled(value);
  }
}
