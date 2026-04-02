import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {

  constructor() {
    super('BootScene')
  }

  preload() {
    console.log("ブート中...")
    // ローディング画面用の画像だけロード
    this.load.image('loading_bar', '/assets/aimroom/item/desk0.png')
  }

  create() {
    // 次のSceneへ
    this.scene.start('PreloadScene')
  }
}