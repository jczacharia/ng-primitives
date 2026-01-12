import { isSignal, signal, Signal } from '@angular/core';
import { ngpInteractions } from 'ng-primitives/interactions';
import { injectElementRef } from 'ng-primitives/internal';
import { attrBinding, controlled, createPrimitive, dataBinding } from 'ng-primitives/state';

export interface NgpButtonState {
  /**
   * Whether the button is disabled.
   */
  readonly disabled: Signal<boolean>;

  /**
   * The role of the button.
   */
  readonly role: Signal<string | null>;

  /**
   * Set the disabled state of the button.
   * @param value The disabled state.
   */
  setDisabled(value: boolean): void;

  /**
   * Set the role of the button.
   * @param value The role.
   */
  setRole(value: string | null): void;
}

export interface NgpButtonProps {
  /**
   * Whether the button is disabled.
   */
  readonly disabled?: Signal<boolean>;

  /**
   * The role of the button.
   */
  readonly role?: string | null | Signal<string | null>;
}

export const [NgpButtonStateToken, ngpButton, injectButtonState, provideButtonState] =
  createPrimitive(
    'NgpButton',
    ({
      disabled: _disabled = signal(false),
      role: _role = null,
    }: NgpButtonProps): NgpButtonState => {
      const element = injectElementRef();
      const isButton = element.nativeElement.tagName.toLowerCase() === 'button';
      const isAnchor = element.nativeElement.tagName.toLowerCase() === 'a';

      // Wrap in function in case of change to href (routerLink has this behavior)
      const isValidLink = () => isAnchor && element.nativeElement.getAttribute('href');

      const disabled = controlled(_disabled);
      const role = controlled(isSignal(_role) ? _role : signal(_role));

      // Ensure the role is set to the initial value of the role attribute
      if (role() == null) {
        role.set(element.nativeElement.getAttribute('role'));
      }

      // Setup interactions (hover, press, focus-visible)
      ngpInteractions({ hover: true, press: true, focusVisible: true, disabled });

      // Setup host attribute bindings
      dataBinding(element, 'data-disabled', disabled);

      // Add the disabled attribute if it's a button element
      if (isButton) {
        attrBinding(element, 'disabled', () => (disabled() ? '' : null));
      }

      attrBinding(element, 'role', () => {
        if (role() != null) {
          return role();
        }

        // Native buttons implicitly have role="button"
        if (isButton) {
          return null;
        }

        // Anchors with href should retain their native "link" role.
        // This needs to be checked after render in case the host
        // has a routerLink which can set the href after render.
        if (isValidLink()) {
          return null;
        }

        // Non-native elements need role="button" for screen readers to announce them as buttons
        return 'button';
      });

      function setDisabled(value: boolean): void {
        disabled.set(value);
      }

      function setRole(value: string | null): void {
        role.set(value);
      }

      return {
        disabled: disabled.asReadonly(),
        role: role.asReadonly(),
        setDisabled,
        setRole,
      } satisfies NgpButtonState;
    },
  );
