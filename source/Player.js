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
}

// exports
module.exports = {
  Player: Player
}
