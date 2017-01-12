'use strict'
// requires
const Name = require('./Name').Name

// Generator
class Generator extends Name {
  constructor () {
    super()
    this._timesused = 0
  }
    // Getters and Setters
  get timesused () {
    return this._timesused
  }
  set timesused (value) {
    this._timesused = value
  }

  // Price
  price (base) {
    if (base === 0) {
      return 0
    } else if (base === 1) {
      return 1
    } else {
      return this.price(base - 1) + this.price(base - 2)
    }
  }

  // Create
  create () {
    let kind
    if (this.timesused % 10 === 0) {
      kind = 'weapon'
    } else if (this.timesused % 5 === 0) {
      kind = 'weapon'
    } else if (this.timesused % 2 === 0) {
      kind = 'food'
    } else {
      kind = 'time'
    }
    let name = this.newname(kind)
    let price = this.price(this.timesused) + 1
    this.timesused++
    return new Upgrade(name, price, kind)
  }
}

// exports
module.exports = {
  Generator: Generator
}
