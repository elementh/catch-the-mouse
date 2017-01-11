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
    this._traps = {
      session: 0,
      ever: 0
    }
  }
  // get & set
  get createdAt () {
    return this._createdAt
  }
  set createdAt (value) {
    this._createdAt = value
  }
  get prestigeLevel () {
    return this._prestigeLevel
  }
  set prestigeLevel (value) {
    this._prestigeLevel = value
  }
  get wave () {
    return this._wave
  }
  set wave (value) {
    this._wave = value
  }
  get coins () {
    return this._coins
  }
  set coins (value) {
    this._coins = value
  }
  get catched () {
    return this._catched
  }
  set catched (value) {
    this._catched = value
  }
  get traps () {
    return this._traps
  }
  set traps (value) {
    this._traps = value
  }

}

// EXPORTS
module.exports = {
  Scoreboard: Scoreboard
}
