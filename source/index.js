'use strict'
// requires
const Game = require('./Game').Game
const view = require('./view').view
const swal = require('sweetalert2')

let game = new Game()
swal({
  title: 'Input something',
  input: 'text',
  showCancelButton: true,
  inputValidator: function (value) {
    return new Promise(function (resolve, reject) {
      if (value) {
        resolve()
      } else {
        reject('You need to write something!')
      }
    })
  }
}).then(function (result) {
  swal({
    type: 'success',
    html: 'You entered: ' + result
  })
})
document.getElementById('start-button').addEventListener('click', (e) => {
  game.gameStart()
  view.load(game)
})
