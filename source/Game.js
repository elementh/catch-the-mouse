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
