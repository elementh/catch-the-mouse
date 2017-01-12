'use strict'
// requires
const Vue = require('vue')

function load () {
  let player = new Vue({
    el: '#player',
    data: {
      5: 3
    }
  })
}

// exports
module.exports = {
  load: load
}
