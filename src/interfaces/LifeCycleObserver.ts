import {ValueOrPromise} from '@loopback/core';

/**
 * Observers to handle life cycle start/stop events
 */
export interface LifeCycleObserver {
  /**
   * The method to be invoked during `init`. It will only be called at most once
   * for a given application instance.
   */
  init?(...injectedArgs: unknown[]): ValueOrPromise<void>;
  /**
   * The method to be invoked during `start`
   */
  start?(...injectedArgs: unknown[]): ValueOrPromise<void>;
  /**
   * The method to be invoked during `stop`
   */
  stop?(...injectedArgs: unknown[]): ValueOrPromise<void>;
}
