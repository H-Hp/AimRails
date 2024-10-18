import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

console.log('res1')

Rails.start()
Turbolinks.start()
ActiveStorage.start()


//react
import React from 'react'
import ReactDOM from 'react-dom'
import HelloWorld from '../aim_room/components/HelloWorld'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <HelloWorld />,
    document.body.appendChild(document.createElement('div')),
  )
})
