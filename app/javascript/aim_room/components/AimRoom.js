import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'

import LoginPlugin from './LoginPlugin';

import BootScene from '../scenes/BootScene'
import PreloadScene from '../scenes/PreloadScene'
import UIScene from '../scenes/UIScene'
import MainScene from '../scenes/MainScene'
import GachaScene from '../scenes/GachaScene'
import MissionScene from '../scenes/MissionScene'
import ChargeScene from '../scenes/ChargeScene'
//import LoginPlugin from './LoginPlugin';


const AimRoom = () => {
  const gameRef = useRef(null)// Phaserのcanvasを入れるDOM要素(div)を参照するためのref

  // データ属性から値を読み取る
  const gameElement = document.querySelector('[data-react-class="AimRoom"]');
  const props = JSON.parse(gameElement.getAttribute('data-react-props'));//app/views/aim_room/index.html.erbからデータ取得
  const { backImagePath, deskImagePath } = props;


  useEffect(() => {// コンポーネントが画面に表示された後に1回だけ実行される
    const config = {// ゲーム画面サイズ・配置の設定
      type: Phaser.AUTO,// WebGLが使えればWebGL、無理ならCanvasを自動選択
      width: 1280,
      height: 720,
      scale: {
        //mode: Phaser.Scale.RESIZE,// ブラウザサイズに応じてゲームサイズを自動調整
        mode: Phaser.Scale.FIT,
        //parent: 'aim-room-container',// DOM id指定でcanvasを入れる方法
        parent: gameRef.current,// Reactのrefで取得したdivの中にPhaserのcanvasを配置
        autoCenter: Phaser.Scale.CENTER_BOTH,// canvasを縦横中央に配置
        //width: window.innerWidth,// ゲーム画面の幅をブラウザ幅にする
        //height: window.innerHeight// ゲーム画面の高さをブラウザ高さにする
      },
      transparent: true,//HTML背景を見せるために Phaser側を透明に
      scene: [BootScene,PreloadScene,UIScene,MainScene,MissionScene,GachaScene,ChargeScene],// ゲームで使用するScene(画面状態)を登録
      plugins: {// Phaserプラグイン設定
        global: [// 全Sceneで使用できるグローバルプラグイン
          { key: 'LoginPlugin', plugin: LoginPlugin, start: true }// LoginPluginを登録しゲーム開始時に自動起動
        ]
      },
    }
    const game = new Phaser.Game(config)// Phaserゲームを生成しゲームエンジンを起動
    //gameRef.current = game

    return () => {// Reactコンポーネントがアンマウント(削除)されるときに実行されるクリーンアップ処理
      if (game) {
      //if (gameRef.current) {// refの存在チェックが存在するか確認
        //gameRef.current.destroy(true)// Phaserゲームを破棄
        game.destroy(true)// Phaserゲームを破棄
      }
    }

  }, [])
  return <div ref={gameRef} />;// Phaserのcanvasが挿入されるdiv要素をReactが描画
  //return <div id="aim-room-container" />
}

export default AimRoom