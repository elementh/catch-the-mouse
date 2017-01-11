'use strict'
// requires
const Scoreboard = require('./Scoreboard').Scoreboard

// Player
class Player extends Scoreboard {
  constructor () {
    super()
    this._name = ''
    this._coinsPerCatch = 1
    this._traps = 0
    this._extraTime = 0
  }
  // get & set
  get name () {
    return this._name
  }
  set name (value) {
    this._name = value
  }
  get coinsPerCatch () {
    return this._coinsPerCatch
  }
  set coinsPerCatch (value) {
    this._coinsPerCatch = value
  }
  get traps () {
    return this._traps
  }
  set traps (value) {
    this._traps = value
  }
  get extraTime () {
    return this._extraTime
  }
  set extraTime (value) {
    this._extraTime = value
  }
  // name
  newName (value) {
    if (typeof value === 'string' && value.length <= 20) {
      this.name = value
      return true
    } else {
      return false
    }
  }

}

// exports
module.exports = {
  Player: Player
}
