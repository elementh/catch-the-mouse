'use strict'
// requires
const Player = require('./Player').Player

// Game
class Game extends Player {
  constructor () {
    super()
    this._time = 15
    this._timeout = null
    this._checkbox = {}
  }
  // get & set
  get time () {
    return this._time
  }
  set time (value) {
    this._time = value
  }
  get timeout () {
    return this._timeout
  }
  set timeout (value) {
    this._timeout = value
  }
  get checkbox () {
    return this._checkbox
  }
  set checkbox (value) {
    this._checkbox = value
  }
  // checkbox
  updateCheckboxSelection () {
    this.checkbox = {
      0: document.getElementById(0),
      1: document.getElementById(1),
      2: document.getElementById(2),
      3: document.getElementById(3),
      4: document.getElementById(4),
      5: document.getElementById(5),
      6: document.getElementById(6),
      7: document.getElementById(7),
      8: document.getElementById(8),
      9: document.getElementById(9)
    }
  }
  uncheckAll () {
    for (let check in this.checkbox) {
      this.checkbox[check].checked = false
    }
  }
  /**
   * Checks a random checkbox
   */
  checkAtRandom () {
    this.checkbox[Math.floor((Math.random() * 10))].checked = true
  }
}

// exports
module.exports = {
  Game: Game
}
