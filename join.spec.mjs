import test from 'ava'

import {
  fromIterable,
  fullJoin,
  innerJoin,
  join,
  leftJoin,
  leftOuterJoin,
  not,
  outerJoin,
  rightJoin,
  rightOuterJoin
} from './join.mjs'

test('fromIterable without conflicts', t => {
  const map = fromIterable(
    [
      { id: 'a', value: 10 },
      { id: 'b', value: 32 }
    ],
    item => item.id
  )

  t.true(map instanceof Map)

  t.true(map.has('a'))
  t.true(map.has('b'))
  t.false(map.has('c'))

  t.deepEqual(map.get('a'), { id: 'a', value: 10 })
  t.deepEqual(map.get('b'), { id: 'b', value: 32 })
  t.is(map.get('c'), undefined)
})

test('fromIterable with conflicts', t => {
  t.throws(() => {
    fromIterable(
      [
        { id: 'a', value: 10 },
        { id: 'a', value: 32 }
      ],
      item => item.id
    )
  })
})

test('fromIterable ignore', t => {
  const map = fromIterable(
    [
      { id: 'a', value: 42 },
      { id: 'a', value: 0 }
    ],
    item => item.id,
    'ignore'
  )
  t.deepEqual(map.get('a'), { id: 'a', value: 42 })
})

test('fromIterable override', t => {
  const map = fromIterable(
    [
      { id: 'a', value: 0 },
      { id: 'a', value: 42 }
    ],
    item => item.id,
    'override'
  )
  t.deepEqual(map.get('a'), { id: 'a', value: 42 })
})

function declare (iterable) {
  return fromIterable(iterable, item => item.id)
}

test('fullJoin', t => {
  t.plan(8)

  const left = declare([
    { id: 'a', value: 1 },
    { id: 'b', value: 2 }
  ])

  const right = declare([
    { id: 'a', value: 5 },
    { id: 'c', value: 9 }
  ])

  function resolve (l, r, k) {
    t.pass()
    return { id: k, value: (l ? l.value : 0) + (r ? r.value : 0) }
  }

  const expected = [
    { id: 'a', value: 6 },
    { id: 'b', value: 2 },
    { id: 'c', value: 9 }
  ]

  t.deepEqual(
    Array.from(fullJoin(left, right, resolve)),
    expected
  )
  t.deepEqual(
    Array.from(join(left, right, 'full', resolve)),
    expected
  )
})

test('innerJoin', t => {
  t.plan(4)

  const left = declare([
    { id: 'a', value: 1 },
    { id: 'b', value: 2 }
  ])

  const right = declare([
    { id: 'a', value: 5 },
    { id: 'c', value: 9 }
  ])

  function resolve (l, r, k) {
    t.true(l !== undefined && r !== undefined)
    return { id: k, value: l.value + r.value }
  }

  const expected = [
    { id: 'a', value: 6 }
  ]

  t.deepEqual(
    Array.from(innerJoin(left, right, resolve)),
    expected
  )
  t.deepEqual(
    Array.from(join(left, right, 'inner', resolve)),
    expected
  )
})

test('outerJoin', t => {
  t.plan(6)

  const left = declare([
    { id: 'a', value: 1 },
    { id: 'b', value: 2 }
  ])

  const right = declare([
    { id: 'a', value: 5 },
    { id: 'c', value: 9 }
  ])

  function resolve (l, r, k) {
    t.true((l === undefined && r !== undefined) || (l !== undefined && r === undefined))
    return { id: k, value: (l ? l.value : 0) + (r ? r.value : 0) }
  }

  const expected = [
    { id: 'b', value: 2 },
    { id: 'c', value: 9 }
  ]

  t.deepEqual(
    Array.from(outerJoin(left, right, resolve)),
    expected
  )
  t.deepEqual(
    Array.from(join(left, right, 'outer', resolve)),
    expected
  )
})

test('leftJoin', t => {
  t.plan(6)

  const left = declare([
    { id: 'a', value: 1 },
    { id: 'b', value: 2 }
  ])

  const right = declare([
    { id: 'a', value: 5 },
    { id: 'c', value: 9 }
  ])

  function resolve (l, r, k) {
    t.true(l !== undefined)
    return { id: k, value: l.value + (r ? r.value : 0) }
  }

  const expected = [
    { id: 'a', value: 6 },
    { id: 'b', value: 2 }
  ]

  t.deepEqual(
    Array.from(leftJoin(left, right, resolve)),
    expected
  )
  t.deepEqual(
    Array.from(join(left, right, 'left', resolve)),
    expected
  )
})

test('rightJoin', t => {
  t.plan(6)

  const left = declare([
    { id: 'a', value: 1 },
    { id: 'b', value: 2 }
  ])

  const right = declare([
    { id: 'a', value: 5 },
    { id: 'c', value: 9 }
  ])

  function resolve (l, r, k) {
    t.true(r !== undefined)
    return { id: k, value: (l ? l.value : 0) + r.value }
  }

  const expected = [
    { id: 'a', value: 6 },
    { id: 'c', value: 9 }
  ]

  t.deepEqual(
    Array.from(rightJoin(left, right, resolve)),
    expected
  )
  t.deepEqual(
    Array.from(join(left, right, 'right', resolve)),
    expected
  )
})

test('leftOuterJoin', t => {
  t.plan(4)

  const left = declare([
    { id: 'a', value: 1 },
    { id: 'b', value: 2 }
  ])

  const right = declare([
    { id: 'a', value: 5 },
    { id: 'c', value: 9 }
  ])

  function resolve (l, r, k) {
    t.true(r === undefined)
    return { id: k, value: l.value }
  }

  const expected = [
    { id: 'b', value: 2 }
  ]

  t.deepEqual(
    Array.from(leftOuterJoin(left, right, resolve)),
    expected
  )
  t.deepEqual(
    Array.from(join(left, right, 'leftOuter', resolve)),
    expected
  )
})

test('rightOuterJoin', t => {
  t.plan(4)

  const left = declare([
    { id: 'a', value: 1 },
    { id: 'b', value: 2 }
  ])

  const right = declare([
    { id: 'a', value: 5 },
    { id: 'c', value: 9 }
  ])

  function resolve (l, r, k) {
    t.true(l === undefined)
    return { id: k, value: r.value }
  }

  const expected = [
    { id: 'c', value: 9 }
  ]

  t.deepEqual(
    Array.from(rightOuterJoin(left, right, resolve)),
    expected
  )
  t.deepEqual(
    Array.from(join(left, right, 'rightOuter', resolve)),
    expected
  )
})

test('custom join', t => {
  t.plan(6)
  const iterable = join(
    declare([
      { id: 'a', value: 1 },
      { id: 'x', value: 42 },
      { id: 'b', value: 2 }
    ]),
    declare([
      { id: 'a', value: 5 },
      { id: 'c', value: 9 }
    ]),
    (l, r, id) => {
      t.pass()
      return id === 'x'
    },
    (l, r, id) => {
      t.pass()
      return { id, value: (l ? l.value : 0) + (r ? r.value : 0) }
    }
  )
  t.deepEqual(Array.from(iterable), [
    { id: 'x', value: 42 }
  ])
})

test('not', t => {
  t.plan(8)
  const iterable = join(
    declare([
      { id: 'a', value: 1 },
      { id: 'x', value: 42 },
      { id: 'b', value: 2 }
    ]),
    declare([
      { id: 'a', value: 5 },
      { id: 'c', value: 9 }
    ]),
    not(
      (l, r, id) => {
        t.pass()
        return id === 'x'
      }
    ),
    (l, r, id) => {
      t.pass()
      return { id, value: (l ? l.value : 0) + (r ? r.value : 0) }
    }
  )
  t.deepEqual(Array.from(iterable), [
    { id: 'a', value: 6 },
    { id: 'b', value: 2 },
    { id: 'c', value: 9 }
  ])
})

test('validation', t => {
  t.throws(() => join(new Map(), {}, () => true, () => {}))
  t.throws(() => join({}, new Map(), () => true, () => {}))
  t.throws(() => join(new Map(), new Map(), 'nope', () => {}))
  t.throws(() => join(new Map(), new Map(), 'inner', {}))
})
