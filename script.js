/*
 * # # # # # # # # # # # # # # #
 * # Lucas Maximiliano Marino  #
 * # (c) 2016 MIT License      #
 * # http://lucasmarino.me     #
 * # # # # # # # # # # # # # # #
 *
 */

// I think I deleted everything that didn't make it to the final game but maybe I forgot something. Sorry in advance! You may find that some things could've been done easier but I just wanted to do weird and interesting things, like targeting soure element and event listeners, arrow functions, etc.

'use strict'

class Game {
  constructor () {
    this._level = 1
    this._alive = 10
    this._time = 15
    this._coins = 0
    this._kills = 0
    this._levelkills = 0
    this._others = {
      extratime: 0,
      coinsperkill: 1,
      ratdiscount: 0
    }
    this._timeout = undefined
    this._checkbox = undefined
    this._generator = new Generator()
    this._upgrades = []
  }
    // Getters and Setters
  get level () {
    return this._level
  }
  set level (value) {
    this._level = value
  }
  get alive () {
    return this._alive
  }
  set alive (value) {
    this._alive = value
  }
  get time () {
    return this._time
  }
  set time (value) {
    this._time = value
  }
  get coins () {
    return this._coins
  }
  set coins (value) {
    this._coins = value
  }
  get kills () {
    return this._kills
  }
  set kills (value) {
    this._kills = value
  }
  get levelkills () {
    return this._levelkills
  }
  set levelkills (value) {
    this._levelkills = value
  }
  get others () {
    return this._others
  }
  set others (value) {
    this._others = value
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
  get generator () {
    return this._generator
  }
  set generator (value) {
    this._generator = value
  }
  get upgrades () {
    return this._upgrades
  }
  set upgrades (value) {
    this._upgrades = value
  }
    // CSS
  addCSSRule (sheet, selector, rules, index) {
    if ('insertRule' in sheet) {
      sheet.insertRule(selector + '{' + rules + '}', index)
    } else if ('addRule' in sheet) {
      sheet.addRule(selector, rules, index)
    }
  }

  // Checkboxes
  select () {
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
  uncheck () {
    for (let check in this.checkbox) {
      this.checkbox[check].checked = false
    }
  }
  randcheck () {
    this.checkbox[Math.floor((Math.random() * 10))].checked = true
  }
  selectsource (element) {
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

  // Event Handler
  generateEvents () {
    // this way the checkbox doesn't trigger anything unless game has started
    for (let check in this.checkbox) {
      this.checkbox[check].addEventListener('click', (e) => {
        let source = this.selectsource(e)
        if (!source.checked) {
          this.goodclick()
        } else {
          this.gamelostbecause('badclick')
        }
      })
    }
  }
  destroyEvents () {
    // Since arrow functions are anonymous, we can't just "remove" them, lucky for us we can't recreate the element. This way everything stays the same but the eventlistener isn't recreated.
    for (let check in this.checkbox) {
      this.checkbox[check].parentNode.replaceChild(this.checkbox[check].cloneNode(1), this.checkbox[check])
    }
  }

  // Timing
  timestart () {
    this.timeout = window.setTimeout(() => {
      this.tick()
    }, 1000)
  }
  timestop () {
    clearTimeout(this.timeout)
  }
  tick () {
    this.time--
    this.updateview()
    if (this.time > 0) {
      this.timestart()
    } else {
      this.gamelostbecause('time')
    }
  }
    // Clicks
  goodclick () {
    this.kills++
    this.levelkills += this.others.coinsperkill
    if (--this.alive <= 0) {
      this.nextlevel()
    }
    this.updateview()
    this.randcheck()
  }

  // Levels
  nextlevel () {
    this.coins += this.levelkills
    this.time = 15 - this.level++ + this.others.extratime
    this.alive = 10 + this.level - this.others.ratdiscount
    this.stop()
    document.getElementById('start-button').disabled = false
  }

  // View Handler
  updateview () {
    let timev = document.getElementById('time')
    timev.innerHTML = this.time
    let levelv = document.getElementById('level')
    levelv.innerHTML = this.level
    let alivev = document.getElementById('alive')
    alivev.innerHTML = this.alive
    let killsv = document.getElementById('kills')
    killsv.innerHTML = this.kills
    let coinsv = document.getElementById('coins')
    coinsv.innerHTML = this.coins
  }
  updateupgradeview () {
    // First we generate the 'buttons'
    let container = ''
    for (var i = 0; i < this.upgrades.length; i++) {
      container += `<p id="${i + 10}">${this.upgrades[i].name}<br>Preu: ${this.upgrades[i].price}<img class="icon" src="https://raw.githubusercontent.com/Ranks/emojione/master/assets/png_128x128/1f4b6.png"</p>`
    }
    // Then we display them
    let upgradecontainer = document.getElementById('upgrades-container')
    upgradecontainer.innerHTML = container
    // And finally we give them a use
    for (var i = 0; i < this.upgrades.length; i++) {
      let button = document.getElementById(i + 10).addEventListener('click', (e) => {
        // Because this.buyupgrade(i) will always be this.buyupgrade(4) and I don't remember how to properly write the function. I know I deserve hell but please forgive me.
        let source = this.selectsource(e)
        if (this.coins >= this.upgrades[source.id - 10].price) {
          this.buyupgrade(source.id - 10)
        } else {
          alert('No tens prous diners!')
        }
      })
    }
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
    this.updateupgradeview()
    this.updateview()
  }
  // Start - Stop - Gamelost
  start () {
    // We need to select again the checkboxes because we regenerated them when we destroyed the eventlisteners.
    this.select()
      // We uncheck last game checkboxes or previous user interaction.
    this.uncheck()
    this.updateview()
    this.generateEvents()
    this.timestart()
    this.randcheck()
    this.fillUpgrades()
    game.updateupgradeview()
  }
  stop () {
    this.timestop()
    this.destroyEvents()
    this.uncheck()
  }
  gamelostbecause (why) {
    if (why === 'time') {
      this.stop()
      alert(`'Se t\'ha acabat el temps. Has perdut al nivell ${this.level} i has atrapat a un total de ${this.levelkills} ratolins!`)
    } else if (why === 'badclick') {
      this.stop()
      alert(`Has fet click on no era. Has perdut al nivell ${this.level} i has atrapat a un total de ${this.levelkills} ratolins!`)
    }
    game = new Game()
    game.updateview()
    game.updateupgradeview()
    document.getElementById('start-button').disabled = false
  }
}

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
/*
 * GAME START
 */
let game = new Game()
let name = new Name()
game.updateview()
name.newnametime()
document.getElementById('start-button').addEventListener('click', (e) => {
  game.start()
  game.selectsource(e).disabled = true
})
