import { signal, Signal } from '@angular/core';
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
   * Set the disabled state of the button.
   * @param value The disabled state.
   */
  setDisabled(value: boolean): void;
}

export interface NgpButtonProps {
  /**
   * Whether the button is disabled.
   */
  readonly disabled?: Signal<boolean>;

  /**
   * The role attribute of the button.
   */
  readonly role?: string | null;

  /**
   * The type attribute of the button.
   */
  readonly type?: string | null;
}

export const [NgpButtonStateToken, ngpButton, injectButtonState, provideButtonState] =
  createPrimitive(
    'NgpButton',
    ({ disabled: _disabled = signal(false), role, type }: NgpButtonProps): NgpButtonState => {
      const element = injectElementRef();
      const config = injectButtonConfig();

      const isButton = element.nativeElement.tagName.toLowerCase() === 'button';
      const isAnchor = element.nativeElement.tagName.toLowerCase() === 'a';

      // Wrap in function in case of change to href (routerLink has this behavior)
      const isValidLink = () => isAnchor && element.nativeElement.getAttribute('href');

      const disabled = controlled(_disabled);

      // Setup interactions (hover, press, focus-visible)
      ngpInteractions({ hover: true, press: true, focusVisible: true, disabled });

      // Setup host attribute bindings
      dataBinding(element, 'data-disabled', disabled);

      // Add the disabled attribute if it's a button element
      if (isButton) {
        attrBinding(element, 'disabled', () => (disabled() ? '' : null));
      }

      if (role !== undefined) {
        attrBinding(element, 'role', role);
      } else if (config.autoSetRole) {
        role = element.nativeElement.getAttribute('role');
        if (role == null) {
          attrBinding(element, 'role', () => {
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
        }
      }

      if (type !== undefined) {
        attrBinding(element, 'type', type);
      } else if (config.autoSetType && isButton) {
        type = element.nativeElement.getAttribute('type');
        if (type == null) {
          attrBinding(element, 'type', 'button');
        }
      }

      function setDisabled(value: boolean): void {
        disabled.set(value);
      }

      return {
        disabled: disabled.asReadonly(),
        setDisabled,
      } satisfies NgpButtonState;
    },
  );
