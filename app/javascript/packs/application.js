import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

console.log('res2')

Rails.start()
Turbolinks.start()
ActiveStorage.start()


//react
/*import React from 'react'
import ReactDOM from 'react-dom'
import HelloWorld from '../aim_room/components/HelloWorld'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <HelloWorld />,
    document.body.appendChild(document.createElement('div')),
  )
})*/

import React from 'react'
import { createRoot } from 'react-dom/client'
import PhaserGame from '../aim_room/components/PhaserGame'

//Webpackerが処理できるように画像をインポートする Import images so Webpacker processes them
require.context('../../assets/images', true)
//require.context('../../assets/aimroom', true)


document.addEventListener('DOMContentLoaded', () => {
  const container = document.body.appendChild(document.createElement('div'))
  const root = createRoot(container)
  root.render(<PhaserGame />)
})
