import React from 'react'
import { createRoot } from 'react-dom/client'
//import AimRoom from "../aim_room/components/AimRoom"
import AimRoom from "./aim_room/components/AimRoom"

//Webpackerが処理できるように画像をインポートする Import images so Webpacker processes them
//require.context('../../assets/images', true)
//require.context('../images', true)

document.addEventListener('DOMContentLoaded', () => {
  const container = document.body.appendChild(document.createElement('div'))
  const root = createRoot(container)
  root.render(<AimRoom />)
})
