class Upgrade {
  constructor (name, price, kind) {
    this._name = name
    this._price = price
    this._kind = kind
  }
  get name () {
    return this._name
  }
  set name (value) {
    this._name = value
  }
  get price () {
    return this._price
  }
  set price (value) {
    this._price = value
  }
  get kind () {
    return this._kind
  }
  set kind (value) {
    this._kind = value
  }
}

module.exports = {
  Upgrade: Upgrade
}
