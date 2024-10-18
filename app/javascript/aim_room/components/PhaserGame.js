
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const PhaserGame = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    // データ属性から値を読み取る
    const gameElement = document.querySelector('[data-react-class="PhaserGame"]');
    const props = JSON.parse(gameElement.getAttribute('data-react-props'));
    const { backImagePath, deskImagePath } = props;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      scene: {
        preload: preload,
        create: create
      }
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('back', backImagePath);
      this.load.image('desk', deskImagePath);
    }

    function create() {
      this.add.image(400, 300, 'back');
      this.add.image(400, 550, 'desk');
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} />;
};

export default PhaserGame;

/*
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const PhaserGame = ({ backImagePath, deskImagePath }) => {
  console.log("ffbackImagePath:"+backImagePath)
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      scene: {
        preload: preload,
        create: create
      }
    };
    console.log("fsfs:"+backImagePath)
    const game = new Phaser.Game(config);

    function preload() {
      console.log("backImagePath:"+backImagePath)
      this.load.image('back', backImagePath);
      this.load.image('desk', deskImagePath);
    }

    function create() {
      console.log("backImagePath:"+backImagePath)
      this.add.image(400, 300, 'back');
      this.add.image(400, 550, 'desk');
    }

    return () => {
      game.destroy(true);
    };
  }, [backImagePath, deskImagePath]);

  return <div ref={gameRef} />;
};

export default PhaserGame;



/*
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function PhaserGame(props) {
//export default function PhaserGame({ backImagePath, deskImagePath }) {
//export default function PhaserGame(props) {
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

        // データ属性から props を解析
        const propsData = containerRef.current.dataset.reactProps;
        //const { backImagePath, deskImagePath } = JSON.parse(propsData);
        const { backImagePath, deskImagePath } = JSON.parse(propsData);
        this.backImagePath=backImagePath
        this.deskImagePath=deskImagePath

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      //parent: 'phaser-game',
      scene: {
        preload: preload,
        create: create,
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    //};
    //}, [backImagePath, deskImagePath]);
    //}, [this.backImagePath, this.deskImagePath]);
    }
  });

  function preload() {
    //this.load.image('back', backImagePath);
    //this.load.image('desk', deskImagePath);
    this.load.image('back', this.backImagePath);
    this.load.image('desk', this.deskImagePath);
  }

  function create() {
    console.log("backImagePath:"+this.backImagePath)
    this.add.image(400, 300, 'back');
    this.add.image(400, 450, 'desk');
  }

  //return <div id="phaser-game" className="w-full h-screen" />;
  return <div ref={containerRef} className="w-full h-screen" />;
}



import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  preload() {
    //this.load.setBaseURL('http://labs.phaser.io')
    //this.load.image('sky', 'assets/skies/space3.png')
    //this.load.image('logo', 'assets/sprites/phaser3-logo.png')
    //this.load.image('red', 'assets/particles/red.png')
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
*/