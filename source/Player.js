'use strict'
// requires
const Scoreboard = require('./Scoreboard').Scoreboard

// Player
class Player extends Scoreboard {
  constructor () {
    super()
    this._name = ''
    this._coinsPerCatch = 1
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
  // name
  newName (value) {
    if (typeof value === 'string' && value.length <= 20) {
      this.name = value
      return true
    } else {
      return false
    }
  }
  // coins
  addCoins () {
    super.addCoins(this.coinsPerCatch)
  }

}

// exports
module.exports = {
  Player: Player
}
