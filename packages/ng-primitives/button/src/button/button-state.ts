import { isSignal, signal, Signal } from '@angular/core';
import { ngpInteractions } from 'ng-primitives/interactions';
import { injectElementRef } from 'ng-primitives/internal';
import { attrBinding, controlled, createPrimitive, dataBinding } from 'ng-primitives/state';
import { injectButtonConfig } from './button-config';

export interface NgpButtonState {
  /**
   * Whether the button is disabled.
   */
  readonly disabled: Signal<boolean>;

  /**
   * The role attribute of the button.
   */
  readonly role: Signal<string | null>;

  /**
   * The type attribute of the button.
   */
  readonly type: Signal<string | null>;

  /**
   * Set the disabled state of the button.
   * @param value The disabled state.
   */
  setDisabled(value: boolean): void;

  /**
   * Set the role attribute of the button.
   * @param value The role attribute.
   */
  setRole(value: string | null): void;

  /**
   * Set the type attribute of the button.
   * @param value The type attribute.
   */
  setType(value: string | null): void;
}

export interface NgpButtonProps {
  /**
   * Whether the button is disabled.
   */
  readonly disabled?: Signal<boolean>;

  /**
   * The role attribute of the button.
   */
  readonly role?: string | null | Signal<string | null>;

  /**
   * The type attribute of the button.
   */
  readonly type?: string | null | Signal<string | null>;
}

export const [NgpButtonStateToken, ngpButton, injectButtonState, provideButtonState] =
  createPrimitive(
    'NgpButton',
    ({
      disabled: _disabled = signal(false),
      role: _role = null,
      type: _type = null,
    }: NgpButtonProps): NgpButtonState => {
      const element = injectElementRef();
      const config = injectButtonConfig();

      const isButton = element.nativeElement.tagName.toLowerCase() === 'button';
      const isAnchor = element.nativeElement.tagName.toLowerCase() === 'a';

      // Wrap in function in case of change to href (routerLink has this behavior)
      const isValidLink = () => isAnchor && element.nativeElement.getAttribute('href');

      const disabled = controlled(_disabled);
      const role = isSignal(_role) ? controlled(_role) : signal(_role);
      const type = isSignal(_type) ? controlled(_type) : signal(_type);

      // Setup interactions (hover, press, focus-visible)
      ngpInteractions({ hover: true, press: true, focusVisible: true, disabled });

      // Setup host attribute bindings
      dataBinding(element, 'data-disabled', disabled);

      // Add the disabled attribute if it's a button element
      if (isButton) {
        attrBinding(element, 'disabled', () => (disabled() ? '' : null));
      }

      // Ensure the role is set to the initial value of the role attribute if it is not set
      if (role() == null) {
        role.set(element.nativeElement.getAttribute('role'));
      }

      attrBinding(element, 'role', () => {
        if (!config.autoSetRole || role() != null) {
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

      // Ensure the type is set to the initial value of the type attribute if it is not set
      if (type() == null) {
        type.set(element.nativeElement.getAttribute('type'));
      }

      attrBinding(element, 'type', () => {
        if (!config.autoSetType || type() != null) {
          return type();
        }

        return isButton ? 'button' : null;
      });

      function setDisabled(value: boolean): void {
        disabled.set(value);
      }

      function setRole(value: string | null): void {
        role.set(value);
      }

      function setType(value: string | null): void {
        type.set(value);
      }

      return {
        disabled: disabled.asReadonly(),
        role: role.asReadonly(),
        type: type.asReadonly(),
        setDisabled,
        setRole,
        setType,
      } satisfies NgpButtonState;
    },
  );
