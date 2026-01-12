import { inject, InjectionToken, Provider } from '@angular/core';

export interface NgpButtonConfig {
  /**
   * Whether to automatically set the role attribute to 'button' if the element
   * is a non-native button element nor an anchor element with a valid href.
   * @default false
   */
  autoSetRole: boolean;

  /**
   * Whether to automatically set the type attribute to 'button' if the
   * element is a native button element and no type attribute is already set.
   * @default false
   */
  autoSetType: boolean;
}

export const defaultButtonConfig: NgpButtonConfig = {
  autoSetRole: false,
  autoSetType: false,
};

export const NgpButtonConfigToken = new InjectionToken<NgpButtonConfig>('NgpButtonConfigToken');

/**
 * Provide the default Button configuration
 * @param config The Button configuration
 * @returns The provider
 */
export function provideButtonConfig(config: Partial<NgpButtonConfig>): Provider[] {
  return [
    {
      provide: NgpButtonConfigToken,
      useValue: { ...defaultButtonConfig, ...config } satisfies NgpButtonConfig,
    },
  ];
}

/**
 * Inject the Button configuration
 * @returns The global Button configuration
 */
export function injectButtonConfig(): NgpButtonConfig {
  return inject(NgpButtonConfigToken, { optional: true }) ?? defaultButtonConfig;
}
