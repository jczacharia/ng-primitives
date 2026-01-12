import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, input } from '@angular/core';
import { ngpButton, provideButtonState } from './button-state';

@Directive({
  selector: '[ngpButton]',
  exportAs: 'ngpButton',
  providers: [provideButtonState({ inherit: false })],
})
export class NgpButton {
  /**
   * Whether the button is disabled.
   */
  readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /**
   * The role attribute of the button.
   */
  readonly role = input<string | null>(null);

  /**
   * The type attribute of the button.
   */
  readonly type = input<string | null>(null);

  /**
   * The button state.
   */
  protected readonly state = ngpButton({
    disabled: this.disabled,
    role: this.role,
    type: this.type,
  });

  /**
   * Set the disabled state of the button.
   * @param value The disabled state.
   */
  setDisabled(value: boolean): void {
    this.state.setDisabled(value);
  }

  /**
   * Set the role attribute of the button.
   * @param value The role attribute.
   */
  setRole(value: string | null): void {
    this.state.setRole(value);
  }

  /**
   * Set the type attribute of the button.
   * @param value The type attribute.
   */
  setType(value: string | null): void {
    this.state.setType(value);
  }
}
