import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'

import GachaScene from '../scenes/GachaScene'
/*import MainScene from '../scenes/MainScene'
import MissionScene from '../scenes/MissionScene'
import ChargeScene from '../scenes/ChargeScene'
import LoginPlugin from './LoginPlugin';
*/

const AimRoom = () => {
  const gameRef = useRef(null)

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'aim-room-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
      },
      //scene: [MainScene,MissionScene,GachaScene,ChargeScene],
      scene: [GachaScene],
      /*plugins: {
        global: [
          { key: 'LoginPlugin', plugin: LoginPlugin, start: true }
        ]
      },
      */
    }
    const game = new Phaser.Game(config)
    gameRef.current = game

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
      }
    }
  }, [])
  return <div id="aim-room-container" />
}

export default AimRoom