/* eslint-env jest */
import merge from '../src/merge.js'

describe('merge()', () => {
  it('merge objects', () => {
    const test1 = [
      {
        a: 1,
        b: 2,
        d: {
          a: 1,
          b: [],
          c: { test1: 123, test2: 321 }
        },
        f: 5,
        g: 123,
        i: 321,
        j: [1, 2, 3]
      },
      {
        b: 3,
        c: 5,
        d: {
          b: { first: 'one', second: 'two' },
          c: { test2: 222 }
        },
        e: { one: 1, two: 2 },
        f: [],
        g: void 0,
        h: /abc/g,
        i: null,
        j: [3, 4],
        l: 3
      },
      { b: 4, k: 'hi', l: 0 }
    ]
    const result1 = {
      a: 1,
      b: 4,
      d: {
        a: 1,
        b: { first: 'one', second: 'two' },
        c: { test1: 123, test2: 222 }
      },
      f: [5],
      g: 123,
      c: 5,
      e: { one: 1, two: 2 },
      h: /abc/g,
      i: 321,
      j: [1, 2, 3, 4],
      k: 'hi',
      l: 0
    }
    expect(merge({}, ...test1)).toEqual(result1)
    expect(test1[0]).not.toEqual(result1)
    expect(merge(...test1)).toEqual(result1)
    expect(test1[0]).toEqual(result1)
  })

  it('merge two arrays, even if they are empty', () => {
    expect(merge([], ['one', 'two'])).toEqual(['one', 'two'])
  })

  it('clone objects when the first argument is empty', () => {
    let parent = { options: { files: ['/this/path/one', '/this/path/two'] } }
    let child = { files: '/this/path', root: '/another/path' }
    let merged = merge({}, parent, { options: child })
    expect(merged).toEqual({
      options: {
        files: '/this/path',
        root: '/another/path'
      }
    })
    expect(parent).toEqual({ options: { files: ['/this/path/one', '/this/path/two'] } })
  })

  it('accepts last value for non-object merges', () => {
    let one = 'one'
    let two = 'two'
    expect(merge('', one, two)).toBe(two)
    expect(merge(one, two)).toBe(two)
  })

  it('Should prevent prototype pollution', () => {
    const payload = JSON.parse('{"__proto__":{"polluted":"Yes! Its Polluted"}}');
    const obj = {};
    const result = merge(obj, payload);

    expect(obj.polluted).toBe(undefined);
    expect({}.polluted).toBe(undefined);
  })
})

describe('merge({ arrayStrategy })', () => {
  const test2 = [
    { a: 'a', b: 'b', c: 'c', array: [1, 2, 3] },
    { b: 2, one: 1, array: [2, 3, 4] },
    { two: 2, array: [4, 5, 6] }
  ]
  it('merge objects and make arrays unique', () => {
    expect(merge([{}, ...test2], { arrayStrategy: 'unique' })).toEqual({
      a: 'a',
      b: 2,
      c: 'c',
      one: 1,
      two: 2,
      array: [1, 2, 3, 4, 5, 6]
    })
    expect(test2).toEqual([
      { a: 'a', b: 'b', c: 'c', array: [1, 2, 3] },
      { b: 2, one: 1, array: [2, 3, 4] },
      { two: 2, array: [4, 5, 6] }
    ])
  })
  it('merge objects and overwrite arrays', () => {
    expect(merge([{}, ...test2], { arrayStrategy: 'overwrite' })).toEqual({
      a: 'a',
      b: 2,
      c: 'c',
      one: 1,
      two: 2,
      array: [4, 5, 6]
    })
    expect(test2).toEqual([
      { a: 'a', b: 'b', c: 'c', array: [1, 2, 3] },
      { b: 2, one: 1, array: [2, 3, 4] },
      { two: 2, array: [4, 5, 6] }
    ])
  })
  it('merge objects and concatenate arrays', () => {
    expect(merge([{}, ...test2], { arrayStrategy: 'concat' })).toEqual({
      a: 'a',
      b: 2,
      c: 'c',
      one: 1,
      two: 2,
      array: [1, 2, 3, 2, 3, 4, 4, 5, 6]
    })
    expect(test2).toEqual([
      { a: 'a', b: 'b', c: 'c', array: [1, 2, 3] },
      { b: 2, one: 1, array: [2, 3, 4] },
      { two: 2, array: [4, 5, 6] }
    ])
  })

  const test3 = [[1, 2, 3], [2, 3, 4, 5], [1, 5, 9, 10]]
  it('merge and make arrays unique', () => {
    expect(merge([[], ...test3], { arrayStrategy: 'unique' })).toEqual([1, 2, 3, 4, 5, 9, 10])
  })
  it('merge and concatenate arrays', () => {
    expect(merge([[], ...test3], { arrayStrategy: 'concat' })).toEqual([
      1,
      2,
      3,
      2,
      3,
      4,
      5,
      1,
      5,
      9,
      10
    ])
  })
  it('merge and overwrite arrays', () => {
    expect(merge(test3, { arrayStrategy: 'overwrite' })).toEqual([1, 5, 9, 10])
  })

  const test4 = [
    [2, { one: 1, two: { three: 3, four: 4 }, five: 5 }, 9, 5],
    [1, { one: 'one', two: { three: 'three' }, four: 'four' }, 9, 10]
  ]
  it('merge arrays with objects with concatenate strategy', () => {
    expect(merge([[], ...test4], { arrayStrategy: 'concat' })).toEqual([
      2,
      { one: 1, two: { three: 3, four: 4 }, five: 5 },
      9,
      5,
      1,
      { one: 'one', two: { three: 'three' }, four: 'four' },
      9,
      10
    ])
  })
  it('merge arrays with objects with unique strategy', () => {
    expect(merge([[], ...test4], { arrayStrategy: 'unique' })).toEqual([
      2,
      { one: 1, two: { three: 3, four: 4 }, five: 5 },
      9,
      5,
      1,
      { one: 'one', two: { three: 'three' }, four: 'four' },
      10
    ])
  })
  it('merge arrays with objects with overwrite strategy', () => {
    expect(merge([[], ...test4], { arrayStrategy: 'overwrite' })).toEqual(test4[1])
  })
})

describe('merge({ ignore })', () => {
  it('ignores given paths', () => {
    expect(merge([
      { one: 1, two: 2 },
      { one: 'one', two: 'two' }
    ], { ignore: [ 'one' ] })).toEqual({
      one: 1,
      two: 'two'
    })
  })

  it('ignores given nested paths', () => {
    expect(merge([
      { one: 1, two: { a: 'a', b: { c: 'c', d: { e: 'e' } } } },
      { one: 'one', two: { a: 'b', b: { c: 'd', d: 'e' } } }
    ], { ignore: [ 'one', 'two.b.d' ] })).toEqual({
      one: 1,
      two: {
        a: 'b',
        b: {
          c: 'd',
          d: {
            e: 'e'
          }
        }
      }
    })
  })

  it('ignores given paths in arrays', () => {
    const obj = { abc: 'abc', num: 123, nest: { a: 1, b: 2, c: 3 } }
    expect(merge([
      [1, 2, [3, 4, 5], obj, { a: { b: { c: 'abc', d: 'd' } } }],
      [10, 9, [5, 3, 4], obj, { a: { b: { c: 'xyz', d: 123 } } }]
    ], { ignore: ['1', '2.1', '4.a.b.d'], arrayStrategy: 'merge' })).toEqual([
      10,
      2,
      [5, 4, 4],
      obj,
      { a: { b: { c: 'xyz', d: 'd' } } }
    ])
  })
})
