/**
 * Join two `Map` objects.
 */
export function join (left, right, selectOrType, resolve) {
  if (!(left instanceof Map) || !(right instanceof Map)) {
    throw new TypeError('Left and right members must be Map instances')
  }

  const select = typeof selectOrType === 'function'
    ? selectOrType
    : fromType(selectOrType)

  if (typeof resolve !== 'function') {
    throw new TypeError('A resolve function is required')
  }

  return iterate(left, right, select, resolve)
}

function * iterate (left, right, select, resolve) {
  for (const [key, leftValue] of left) {
    const rightValue = right.get(key)
    if (select(leftValue, rightValue, key)) {
      yield resolve(leftValue, rightValue, key)
    }
  }

  for (const [key, rightValue] of right) {
    if (!left.has(key) && select(undefined, rightValue, key)) {
      yield resolve(undefined, rightValue, key)
    }
  }
}

/**
 * Returns the select function from join type string.
 */
function fromType (type) {
  switch (type) {
    case 'left':
      return leftSelect
    case 'right':
      return rightSelect
    case 'inner':
      return innerSelect
    case 'outer':
      return outerSelect
    case 'full':
      return fullSelect
    case 'leftOuter':
      return leftOuterSelect
    case 'rightOuter':
      return rightOuterSelect
    default:
      throw new Error(`Unexpected join type: ${type}`)
  }
}

function leftSelect (l, r) {
  return l !== undefined
}

function rightSelect (l, r) {
  return r !== undefined
}

function innerSelect (l, r) {
  return l !== undefined && r !== undefined
}

function outerSelect (l, r) {
  return !(l !== undefined && r !== undefined)
}

function fullSelect (l, r) {
  return l !== undefined || r !== undefined
}

function leftOuterSelect (l, r) {
  return l !== undefined && r === undefined
}

function rightOuterSelect (l, r) {
  return r !== undefined && l === undefined
}

/**
 * Negate a join type or select function.
 */
export function not (selectOrType) {
  if (typeof selectOrType === 'function') {
    return (l, r, k) => !selectOrType(l, r, k)
  }
  switch (selectOrType) {
    case 'left':
      return 'rightOuter'
    case 'right':
      return 'leftOuter'
    case 'inner':
      return 'outer'
    case 'outer':
      return 'inner'
    case 'full':
      return () => false
    case 'leftOuter':
      return 'right'
    case 'rightOuter':
      return 'left'
    default:
      throw new Error(`Unexpected join type: ${selectOrType}`)
  }
}

/**
 * Cast an iterable object to a `Map` instance.
 * @param {Iterable} iterable The iterable object to cast.
 * @param {Function} fn A function that returns the key of the currently iterated element.
 * @param {String} [mode] If set to `"ignore"`, all key collisions will be ignore. If set to `"override"`, all key collisions will be updated with the last version of the element.
 * @returns {Map}
 */
export function fromIterable (iterable, fn, mode) {
  const map = new Map()

  let index = 0
  for (const value of iterable) {
    const key = fn(value, index++)

    if (mode === 'override' || !map.has(key)) {
      map.set(key, value)
    } else if (mode !== 'ignore') {
      throw new Error(`Key ${key} already exist`)
    }
  }

  return map
}

export function leftJoin (left, right, resolve) {
  return join(left, right, leftSelect, resolve)
}

export function rightJoin (left, right, resolve) {
  return join(left, right, rightSelect, resolve)
}

export function innerJoin (left, right, resolve) {
  return join(left, right, innerSelect, resolve)
}

export function outerJoin (left, right, resolve) {
  return join(left, right, outerSelect, resolve)
}

export function fullJoin (left, right, resolve) {
  return join(left, right, fullSelect, resolve)
}

export function leftOuterJoin (left, right, resolve) {
  return join(left, right, leftOuterSelect, resolve)
}

export function rightOuterJoin (left, right, resolve) {
  return join(left, right, rightOuterSelect, resolve)
}
