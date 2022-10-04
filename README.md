# @evologi/join

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@evologi/join)

Join strategies for Iterables, Maps, and Arrays.

## Features

- **Zero dependencies**: small footprint
- **Pure ES6**: Node.js and browser support
- **TypeScript support**

## Example

```javascript
import {
  fromIterable,
  getDiscardedValues,
  innerJoin
} from '@evologi/join'

const left = fromIterable(
  [
    { id: 'a', value: 1 },
    { id: 'b', value: 2 },
    { id: 'c', value: 4 }
  ],
  item => item.id
)

const right = fromIterable(
  [
    { key: 'c', value: 8 },
    { key: 'a', value: 17 },
    { key: 'd', value: 42 }
  ],
  item => item.key
)

function resolve (leftItem, rightItem, key) {
  return { _id: key, value: leftItem.value + rightItem.value }
}

const joined = innerJoin(left, right, resolve)
const discarded = getDiscardedValues(joined)

// [ { _id: 'a', value: 18 }, { _id: 'c', value: 12 } ]
console.log(Array.from(joined))

// [ { id: 'b', value: 2 }, { key: 'd', value: 42 } ]
console.log(Array.from(discarded))
```

## API

### `fromIterable(iterable, getKey[, mode])`

Creates a `Map` instance from an iterable object. The `getKey(value, index)` function is used to generate each item's key.

- `iterable` `<Iterable>` The iterable object to cast.
- `getKey` `<Function>` A function that accepts the current iterated value and its index and returns the key that represents the item.
- `mode` `<String>` Used to configure key's collision behaviour. By default a duplicated key will throw an error. Use `"override"` to override collisions with the last found value. Use `"ignore"` to ignore collisions and keep the first value.
- Returns: `<Map>`

```javascript
const array = [
  { name: 'harry', surname: 'potter' },
  { name: 'ron', surname: 'weasley' },
  { name: 'hermione', surname: 'granger' }
]

// {
//   harry: { name: 'harry', surname: 'potter' },
//   ron: { name: 'ron', surname: 'weasley' }
// }
const map = fromIterable(array, item => item.name[0], 'ignore')
```

### `join(leftMap, rightMap, selectOrType, resolve)`

Configurable join function.

- `leftMap` `<Map>`
- `rightMap` `<Map>`
- `selectOrType` `<String> | <Function>` Can be `"left"`, `"right"`, `"inner"`, `"outer"`, `"leftOuter"`, `"rightOuter"`, `"full"`, or a function that accepts three agruments.
  - `leftValue` `<*>` The key's value from the left `Map` object. Can be `undefined`.
  - `rightValue` `<*>` The key's value from the right `Map` object. Can be `undefined`.
  - `key` `<*>` The currently iterated key.
  - Returns: `<Boolean>` Returns `true` to include this key inside the reusulting iterable.
- `resolve` `<Function>` A function that accepts `Map`s values and key and returns the resulting value that will be included inside the iterable.
  - `leftValue` `<*>` The key's value from the left `Map` object. Can be `undefined`.
  - `rightValue` `<*>` The key's value from the right `Map` object. Can be `undefined`.
  - `key` `<*>` The currently iterated key.
  - Returns: `<*>`
- Returns: `<Iterable>`

```javascript
import { fromIterable, join } from '@evologi/join'

const iterable = join(
  fromIterable(
    [
      { id: 42, message: 'hello' },
      { id: 80, message: 'oh' }
    ],
    item => item.id
  ),
  fromIterable(
    [
      { id: 80, message: 'no' },
      { id: 42, message: 'world' }
    ],
    item => item.id
  ),
  (leftValue, rightValue, key) => key < 50, // custom selection
  (leftValue, rightValue, key) => ({
    id: key,
    message: `${leftValue.message} ${rightValue.message}`
  })
)

// [ { id: 42, message: 'hello world' } ]
console.log(Array.from(iterable))
```

### `innerJoin(leftMap, rightMap, resolve)`

Selects values that have matching values in both `Map`s.

- `leftMap` `<Map>`
- `rightMap` `<Map>`
- `resolve` `<Function>` See [`join`](#joinleftmap-rightmap-selectortype-resolve) function.
- Returns: `<Iterable>`

### `outerJoin(leftMap, rightMap, resolve)`

Selects values that are present in one `Map`, but **not** both.

- `leftMap` `<Map>`
- `rightMap` `<Map>`
- `resolve` `<Function>` See [`join`](#joinleftmap-rightmap-selectortype-resolve) function.
- Returns: `<Iterable>`

### `fullJoin(leftMap, rightMap, resolve)`

Selects all values from both `Map` objects.

- `leftMap` `<Map>`
- `rightMap` `<Map>`
- `resolve` `<Function>` See [`join`](#joinleftmap-rightmap-selectortype-resolve) function.
- Returns: `<Iterable>`

### `leftJoin(leftMap, rightMap, resolve)`

Selects values that are present in the left `Map` object.

- `leftMap` `<Map>`
- `rightMap` `<Map>`
- `resolve` `<Function>` See [`join`](#joinleftmap-rightmap-selectortype-resolve) function.
- Returns: `<Iterable>`

### `rightJoin(leftMap, rightMap, resolve)`

Selects values that are present in the right `Map` object.

- `leftMap` `<Map>`
- `rightMap` `<Map>`
- `resolve` `<Function>` See [`join`](#joinleftmap-rightmap-selectortype-resolve) function.
- Returns: `<Iterable>`

### `leftOuterJoin(leftMap, rightMap, resolve)`

Selects values that are present **only** in the left `Map` object.

- `leftMap` `<Map>`
- `rightMap` `<Map>`
- `resolve` `<Function>` See [`join`](#joinleftmap-rightmap-selectortype-resolve) function.
- Returns: `<Iterable>`

### `rightOuterJoin(leftMap, rightMap, resolve)`

Selects values that are present **only** in the right `Map` object.

- `leftMap` `<Map>`
- `rightMap` `<Map>`
- `resolve` `<Function>` See [`join`](#joinleftmap-rightmap-selectortype-resolve) function.
- Returns: `<Iterable>`

### `not(selectOrType)`

Returns the opposite join type string or a negated select function.

- `selectOrType` `<String> | <Function>`
- Returns: `<String> | <Function>`

### `getDiscardedValues(iterable)`

Returns an iterable that yields all discarded values from the passed joined iterable.

- `iterable` `<Iterable>`
- Returns: `<Iterable>`
