import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }
  init() {
  }
  preload() {
    this.load.image('background', 'assets/images/back3.png');
  }
  create() {
    this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');

  }
}