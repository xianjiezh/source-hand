const TokenTypes = {
  OPEN_OBJECT: '{',
  CLOSE_OBJECT: '}',
  OPEN_ARRAY: '[',
  CLOSE_ARRAY: ']',
  KEY: 'key',
  STRING: 'string',
  NUMBER: 'number',
  TRUE: 'true',
  FALSE: 'false',
  NULL: 'null',
  COLON: ':',
  COMMA: ',',
  EOF: 'eof'
}

class Token {
  constructor(type, string) {
    this.type = type
    this.string = string || this.type
  }
}

class Lexer {
  constructor(json) {
    this._json = json
    this._index = 0
  }
  _isEnd() {
    return this._index > this._json.length
  }
  _walk() {
    this._index += 1
  }
  _currentChar() {
    return this._json[this._index]
  }
  _nextChar() {
    return this._json[this._index + 1]
  }
  _readString() {
    let tmp = ''
    while (!this._isEnd()) {
      const c = this._currentChar()
      const next = this._nextChar()
      this._walk()
      if (c == '"') break
      if (c == '\\' && next == '"') {
        this._walk()
        tmp += '"'
        continue
      }
      tmp += c
    }
    return new Token(TokenTypes.STRING, tmp)
  }
  _isLetter(c) {
    return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z'
  }
  _isDigit(c) {
    return c >= '0' && c <= '9'
  }
  _readDigit(c) {
    let tmp = c
    while (!this._isEnd()) {
      const c = this._currentChar()
      if (!this._isDigit(c)) break
      this._walk()
      tmp += c
    }
    return new Token(TokenTypes.NUMBER, tmp)
  }
  _readWord(c) {
    let tmp = c
    while (!this._isEnd()) {
      const c = this._currentChar()
      if (!this._isLetter(c)) break
      this._walk()
      tmp += c
    }
    return tmp
  }
  nextToken() {
    const c = this._currentChar()
    this._walk()
    if (this._isEnd()) return new Token(TokenTypes.EOF)
    switch (c) {
      case ' ':
        return this.nextToken()
      case '{':
        return new Token(TokenTypes.OPEN_OBJECT)
      case '}':
        return new Token(TokenTypes.CLOSE_OBJECT)
      case '[':
        return new Token(TokenTypes.OPEN_ARRAY)
      case ']':
        return new Token(TokenTypes.CLOSE_ARRAY)
      case ':':
        return new Token(TokenTypes.COLON)
      case ',':
        return new Token(TokenTypes.COMMA)
      case '"':
        return this._readString()
    }
    if (this._isDigit(c)) return this._readDigit(c)
    if (this._isLetter(c)) {
      const word = this._readWord(c)
      switch (word) {
        case 'true':
          return new Token(TokenTypes.TRUE)
        case 'false':
          return new Token(TokenTypes.FALSE)
        case 'null':
          return new Token(TokenTypes.NULL)
      }
      throw new Error(`expected true, false, null actual ${word}`)
    }
    throw new Error(`not supported ${c}`)
  }
}

class Parser {
  constructor(json) {
    this._lexer = new Lexer(json)
    this._token = this._lexer.nextToken()
  }
  _isToken(type) {
    return this._token.type === type
  }
  _matchToken(type) {
    const string = this._token.string
    if (!this._isToken(type)) {
      throw new Error(`expect ${type} actual ${this._token.type}`)
    }
    this._walk()
    return string
  }
  _currentString() {
    return this._token.string
  }
  _walk() {
    this._token = this._lexer.nextToken()
  }
  parse() {
    return this._visitValue()
  }
  _visitValue() {
    if (this._isToken(TokenTypes.NUMBER)) {
      const str = this._currentString()
      this._walk()
      return parseInt(str)
    }
    if (this._isToken(TokenTypes.TRUE)) {
      this._walk()
      return true
    }
    if (this._isToken(TokenTypes.FALSE)) {
      this._walk()
      return false
    }
    if (this._isToken(TokenTypes.STRING)) {
      const str = this._currentString()
      this._walk()
      return str
    }
    if (this._isToken(TokenTypes.NULL)) {
      this._walk()
      return null
    }
    if (this._isToken(TokenTypes.OPEN_OBJECT)) {
      this._walk()
      const object = this._visitObject()
      this._matchToken(TokenTypes.CLOSE_OBJECT)
      return object
    }
    if (this._isToken(TokenTypes.OPEN_ARRAY)) {
      this._walk()
      const array = this._visitArray()
      this._matchToken(TokenTypes.CLOSE_ARRAY)
      return array
    }
  }
  _visitObject() {
    const object = {}
    while (true) {
      const key = this._matchToken(TokenTypes.STRING)
      this._matchToken(TokenTypes.COLON)
      const value = this._visitValue()
      object[key] = value
      if (!this._isToken(TokenTypes.COMMA)) break
      this._walk()
    }
    return object
  }
  _visitArray() {
    const array = []
    while (true) {
      const value = this._visitValue()
      array.push(value)
      if (!this._isToken(TokenTypes.COMMA)) break
      this._walk()
    }
    return array
  }
}

module.exports = Parser 