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

test('should parse completed object', () => {
  const obj = {
    a: [1, 23, 'nnn', {a: 1, b: null, v: [123, null, '123123']}],
    b: ['123123', 'ok']
  }
  const json1 = JSON.stringify(obj)
  const result = new Parser(json1).parse()
  expect(JSON.stringify(result)).toBe(json1)
})
