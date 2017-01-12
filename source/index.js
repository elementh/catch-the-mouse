'use strict'

const Game = require('./Game').Game
let game = new Game()
document.getElementById('start-button').addEventListener('click', (e) => {
  game.gameStart()
})
