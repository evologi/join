/**
 * Function that resolves the join collisions and map the result.
 */
export declare type Resolve<K, L, R, U> = (
  leftValue: L | undefined,
  rightValue: R | undefined,
  key: K
) => U;

/**
 * Function that select the elements that will be resolved.
 */
export declare type Select<K, L, R> = Resolve<K, L, R, boolean>;

/**
 * Join type.
 * - `"left"`: Keep all elements from the left set.
 * - `"right"`: Keep all elements from the right set.
 * - `"inner"`: Keep all elements present in both sets.
 * - `"outer"`: Keep all elements present just in one set (unique).
 * - `"leftOuter"`: Keel all elements present just in the left set (unique).
 * - `"rightOuter"`: Keel all elements present just in the right set (unique).
 * - `"full"`: Keep all elements from both sets.
 */
export declare type Type =
  | "left"
  | "right"
  | "inner"
  | "outer"
  | "leftOuter"
  | "rightOuter"
  | "full";

export declare type SelectOrType<K, L, R> = Select<K, L, R> | Type;

/**
 * Join two `Map` objects.
 */
export declare function join<K, L, R, U>(
  left: Map<K, L>,
  right: Map<K, R>,
  selectOrType: SelectOrType<K, L, R>,
  resolve: Resolve<K, L, R, U>
): Generator<U, void, unknown>;

/**
 * Negate a join type or select function.
 */
export declare function not<K, L, R>(
  selectOrType: SelectOrType<K, L, R>
): SelectOrType<K, L, R>;

/**
 * Cast an iterable object to a `Map` instance.
 * @param iterable The iterable object to cast.
 * @param fn A function that returns the key of the currently iterated element.
 * @param mode If set to `"ignore"`, all key collisions will be ignore. If set to `"override"`, all key collisions will be updated with the last version of the element.
 * @returns
 */
export declare function fromIterable<K, T>(
  iterable: Iterable<T>,
  fn: (value: T, index: number) => K,
  mode?: "ignore" | "override"
): Map<K, T>;

export declare function leftJoin<K, L, R, U>(
  left: Map<K, L>,
  right: Map<K, R>,
  resolve: (leftValue: L, rightValue: R | undefined, key: K) => U
): Generator<U, void, unknown>;

export declare function rightJoin<K, L, R, U>(
  left: Map<K, L>,
  right: Map<K, R>,
  resolve: (leftValue: L | undefined, rightValue: R, key: K) => U
): Generator<U, void, unknown>;

export declare function innerJoin<K, L, R, U>(
  left: Map<K, L>,
  right: Map<K, R>,
  resolve: (leftValue: L, rightValue: R, key: K) => U
): Generator<U, void, unknown>;

export declare function outerJoin<K, L, R, U>(
  left: Map<K, L>,
  right: Map<K, R>,
  resolve: (leftValue: L | undefined, rightValue: R | undefined, key: K) => U
): Generator<U, void, unknown>;

export declare function fullJoin<K, L, R, U>(
  left: Map<K, L>,
  right: Map<K, R>,
  resolve: (leftValue: L | undefined, rightValue: R | undefined, key: K) => U
): Generator<U, void, unknown>;

export declare function leftOuterJoin<K, L, U>(
  left: Map<K, L>,
  right: Map<K, any>,
  resolve: (leftValue: L, rightValue: undefined, key: K) => U
): Generator<U, void, unknown>;

export declare function rightOuterJoin<K, R, U>(
  left: Map<K, any>,
  right: Map<K, R>,
  resolve: (leftValue: undefined, rightValue: R, key: K) => U
): Generator<U, void, unknown>;

/**
 * Retrieves the discarded values from a join result.
 */
export declare function getDiscardedValues<T = any>(
  joined: Iterable<any>
): Generator<T, void, unknown>;
