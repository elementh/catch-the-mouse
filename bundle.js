(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
// requires
const Player = require('./Player').Player
const Generator = require('./Generator').Generator

// Game
class Game extends Player {
  constructor () {
    super()
    this._time = 15
    this._free = 10
    this._timeout = null
    this._checkbox = {}
    this._startButton = document.getElementById('start-button')
    // REFACTOR THIS LATER
    this._generator = new Generator()
    this._upgrades = []
  }
  // get & set
  get time () {
    return this._time
  }
  set time (value) {
    this._time = value
  }
  get free () {
    return this._free
  }
  set free (value) {
    this._free = value
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
  get startButton () {
    return this._startButton
  }
  set startButton (value) {
    this._startButton = value
  }
  // start button
  startButtonDisable () {
    this.startButton.disabled = true
  }
  startButtonEnable () {
    this.startButton.disabled = false
  }
  // free
  updateFree () {
    this.free = 9 + this.wave.session - (this.traps.session + this.traps.multiplier)
  }
  // target
  selectTarget (element) {
    // Handles the difference between firefox and chrome.
    // In firefox we have to check for 'e.srcElement.checked' while on chrome
    // we have to check for 'e.originalTarget'. Browsers are weird as f...
    try {
      if (!element.srcElement.checked) {
        return element.srcElement
      }
    } catch (e) {
      return element.originalTarget
    }
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
  checkAtRandom () {
    this.checkbox[Math.floor((Math.random() * 10))].checked = true
  }

  // wave
  nextWave () {
    this.addWave(1)
    this.timeUpdate()
    this.startButtonEnable()
  }

  // events
  generateEvents () {
    // this way the checkbox doesn't trigger anything unless game has started
    for (let check in this.checkbox) {
      this.checkbox[check].addEventListener('click', (e) => {
        let target = this.selectTarget(e)
        if (!target.checked) {
          this.goodClick()
        } else {
          this.gameLostBecause('badclick')
        }
      })
    }
  }
  destroyEvents () {
    // This way everything stays the same but the eventlistener isn't recreated, effectivelly removing the events.
    for (let check in this.checkbox) {
      this.checkbox[check].parentNode.replaceChild(this.checkbox[check].cloneNode(1), this.checkbox[check])
    }
  }

  // timing
  timeUpdate () {
    this.time = 16 - this.wave.session + (this.clocks.session * this.clocks.multiplier)
  }
  timeStart () {
    this.timeout = window.setTimeout(() => {
      this.time--
      if (this.time > 0) {
        this.timeStart()
      } else {
        this.gameLostBecause('time')
      }
    }, 1000)
  }
  timeStop () {
    clearTimeout(this.timeout)
  }

  // clicks
  goodClick () {
    this.free--
    this.addCatched(1)
    this.addCoins()
    if (this.free === 0) {
      this.nextWave()
    }
    this.checkAtRandom()
  }
  // game
  gameStop () {
    this.timeStop()
    this.destroyEvents()
    this.uncheck()
    this.startButtonEnable()
  }
  gameStart () {
    this.updateCheckboxSelection()
    this.uncheckAll()
    this.startButtonDisable()
    this.generateEvents()
    this.timeStart()
    this.checkAtRandom()
    this.fillUpgrades()// TODO: this
  }
  gameLostBecause (why) {
    if (why === 'time') {
      this.stop()
      alert(`'Se t'ha acabat el temps. Has perdut al nivell ${this.level} i has atrapat a un total de ${this.levelkills} ratolins!`)
      // TODO: refactor with swal
    } else if (why === 'badclick') {
      this.gameStop()
      alert(`Has fet click on no era. Has perdut al nivell ${this.level} i has atrapat a un total de ${this.levelkills} ratolins!`)
      // TODO: refactor with swal
    }
    this.startButtonDisable()
    // TODO: look for a better way
  }

  /* TODO: REFACTOR UPGRADES */
  get upgrades () {
    return this._upgrades
  }
  set upgrades (value) {
    return this._upgrades = value
  }
  get generator () {
    return this._generator
  }
  set generator (value) {
    return this._generator = value
  }
  // upgrades
  fillUpgrades () {
    while (this.upgrades.length < 4) {
      this.upgrades.push(this.generator.create())
    }
  }
  buyupgrade (num) {
    if (this.upgrades[num].kind === 'time') {
      this.others.extratime += 2
      this.time = 15 - this.level + this.others.extratime
      this.coins -= this.upgrades[num].price
      this.upgrades.splice(num, 1, this.generator.create())
    } else if (this.upgrades[num].kind === 'food') {
      this.others.ratdiscount += 1
      this.alive = 10 + this.level - this.others.ratdiscount
      this.coins -= this.upgrades[num].price
      this.upgrades.splice(num, 1, this.generator.create())
    } else if (this.upgrades[num].kind === 'weapon') {
      this.others.coinsperkill += 1
      this.coins -= this.upgrades[num].price
      this.upgrades.splice(num, 1, this.generator.create())
    }
  }
  /* TODO: REFACTOR UPGRADES */
}

// exports
module.exports = {
  Game: Game
}

},{"./Generator":2,"./Player":4}],2:[function(require,module,exports){
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

},{"./Name":3}],3:[function(require,module,exports){
'use strict'
// Name
class Name {
  constructor () {
    this._usednames = []
    this._kindtime = ['Rellotge', 'Cronometre']
    this._kindfood = ['Formatge']
    this._kindweapons = ['Verí', 'Tiraxines']
    this._objectprops = ['Metàl·lic', 'Laser', 'd\'obsidiana', 'Daurat', 'd\'alumini', 'Electrònic', 'Nuclear', 'Quantic', 'Medieval']
    this._foodprops = ['Boursin', 'Cabrales', 'Emmental', 'Gouda', 'Gruyère', 'Havarti', 'Llenguat', 'Ricotta', 'Rocafort', 'Mozzarella', 'Parmesà', 'Tête de moine', 'Brie', 'Camembert', 'Gorgonzola', 'Manxego']
  }
    // Getters and Setters
  get usednames () {
    return this._usednames
  }
  set usednames (value) {
    this._usednames = value
  }
  get kindtime () {
    return this._kindtime
  }
  set kindtime (value) {
    this._kindtime = value
  }
  get kindfood () {
    return this._kindfood
  }
  set kindfood (value) {
    this._kindfood = value
  }
  get kindweapons () {
    return this._kindweapons
  }
  set kindweapons (value) {
    this._kindweapons = value
  }
  get objectprops () {
    return this._objectprops
  }
  set objectprops (value) {
    this._objectprops = value
  }
  get foodprops () {
    return this._foodprops
  }
  set foodprops (value) {
    this._foodprops = value
  }
    // Newname
  newnametime () {
    let first = this.kindtime[Math.floor((Math.random() * this.kindtime.length))]
    let second = this.objectprops[Math.floor((Math.random() * this.objectprops.length))]
    return `${first} ${second}`
  }
  newnamefood () {
    let first = this.kindfood[Math.floor((Math.random() * this.kindfood.length))]
    let second = this.foodprops[Math.floor((Math.random() * this.foodprops.length))]
    return `${first} ${second}`
  }
  newnameweapons () {
    let first = this.kindweapons[Math.floor((Math.random() * this.kindweapons.length))]
    let second = this.objectprops[Math.floor((Math.random() * this.objectprops.length))]
    return `${first} ${second}`
  }

  newname (style) {
    let name
    if (style === 'time') {
      name = this.newnametime()
    } else if (style === 'food') {
      name = this.newnamefood()
    } else if (style === 'weapon') {
      name = this.newnameweapons()
    }
    if (this.usednames.indexOf(name) > -1) {
      return this.newname(style)
    } else {
      this.usednames.push(name)
      return name
    }
  }
}

// exports
module.exports = {
  Name: Name
}

},{}],4:[function(require,module,exports){
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

},{"./Scoreboard":5}],5:[function(require,module,exports){
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
      multiplier: 1,
      session: 0,
      ever: 0
    }
    this._clocks = {
      multiplier: 1,
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
  get clocks () {
    return this._clocks
  }
  set clocks (value) {
    this._clocks = value
  }
  // prestige level
  addPrestigeLevel (value) {
    this.prestigeLevel += value
  }
  // wave
  addWave (value) {
    this.wave.session += value
    this.wave.ever += value
  }
  // coins
  addCoins (value) {
    this.coins.session += value
    this.coins.ever += value
  }
  // catched
  addCatched (value) {
    this.catched.session += value
    this.catched.ever += value
  }
  // trap
  addTrap (value) {
    this.traps.session += value
    this.traps.ever += value
  }
  // clocks
  addClock (value) {
    this.clocks.session += value
    this.clocks.ever += value
  }

}

// exports
module.exports = {
  Scoreboard: Scoreboard
}

},{}],6:[function(require,module,exports){
'use strict'

const Game = require('./Game').Game
let game = new Game()
document.getElementById('start-button').addEventListener('click', (e) => {
  game.gameStart()
})

},{"./Game":1}]},{},[6]);
