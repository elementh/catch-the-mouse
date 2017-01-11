'use strict'
// Scoreboard
class Scoreboard {
  constructor () {
    this._createdAt = new Date()
    this._prestigeLevel = 0
    // this._prestigeMultiplier = 0
    this._wave = {
      session: 0,
      ever: 0
    }
    this._coins = {
      session: 0,
      ever: 0
    }
    this._catched = {
      session: 0,
      ever: 0
    }
  }
  // Public Functions

}

// EXPORTS
module.exports = {
  Scoreboard: Scoreboard
}
