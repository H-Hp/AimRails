import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'

import MainScene from '../scenes/MainScene'
import GachaScene from '../scenes/GachaScene'
/*import MissionScene from '../scenes/MissionScene'
import ChargeScene from '../scenes/ChargeScene'
import LoginPlugin from './LoginPlugin';
*/

const AimRoom = () => {
  const gameRef = useRef(null)

  // データ属性から値を読み取る
  const gameElement = document.querySelector('[data-react-class="PhaserGame"]');
  const props = JSON.parse(gameElement.getAttribute('data-react-props'));
  const { backImagePath, deskImagePath } = props;


  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.RESIZE,
        //parent: 'aim-room-container',
        parent: gameRef.current,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
      },
      //scene: [MainScene,MissionScene,GachaScene,ChargeScene],
      scene: [MainScene,GachaScene],
      /*plugins: {
        global: [
          { key: 'LoginPlugin', plugin: LoginPlugin, start: true }
        ]
      },
      */
    }
    const game = new Phaser.Game(config)
    //gameRef.current = game

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
      }
    }
  }, [])
  return <div ref={gameRef} />;
  //return <div id="aim-room-container" />
}

export default AimRoom