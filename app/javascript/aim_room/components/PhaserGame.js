import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  preload() {
    /*this.load.setBaseURL('http://labs.phaser.io')
    this.load.image('sky', 'assets/skies/space3.png')
    this.load.image('logo', 'assets/sprites/phaser3-logo.png')
    this.load.image('red', 'assets/particles/red.png')
    */
    this.load.image('sky', 'assets//images/back.png')
    this.load.image('logo', 'assets/phaser3-logo.png')
    this.load.image('red', 'assets/red.png')

  }

  create() {
    this.add.image(400, 300, 'sky')

    const particles = this.add.particles('red')

    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    })

    const logo = this.physics.add.image(400, 100, 'logo')

    logo.setVelocity(100, 200)
    logo.setBounce(1, 1)
    logo.setCollideWorldBounds(true)

    emitter.startFollow(logo)
  }
}

const PhaserGame = () => {
  const gameRef = useRef(null)

  useEffect(() => {
    if (gameRef.current) return

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      scene: [MainScene],
      parent: 'phaser-game'
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return <div id="phaser-game" />
}

export default PhaserGame