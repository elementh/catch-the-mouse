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
