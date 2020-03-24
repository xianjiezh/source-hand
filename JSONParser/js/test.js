const Parser = require('./index')

test('should parse one level object', () => {
  const obj = {a: 1, b: 2}
  const json1 = JSON.stringify(obj)
  const result = new Parser(json1).parse()
  expect(JSON.stringify(result)).toBe(json1)
})

test('should parse one level array', () => {
  const obj = [1, 2, 3, 111, 'afafafgsdff', false, null, undefined]
  const json1 = JSON.stringify(obj)
  const result = new Parser(json1).parse()
  expect(JSON.stringify(result)).toBe(json1)
})

test('should parse complex object', () => {
  const obj = {
    a: [1, 23, 'nnn,,,', {a: 1, b: null, v: [123, null, {a: 'aa1231"23sdf'}]}],
    b: ['123123', 'ok'],
    c: '}[][]"',
    d: 'null',
    e: 'false'
  }
  const json1 = JSON.stringify(obj)
  console.log('json1', json1)
  const result = new Parser(json1).parse()
  expect(JSON.stringify(result)).toBe(json1)
})
