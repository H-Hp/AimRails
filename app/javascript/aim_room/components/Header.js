import Phaser from 'phaser';
import CristalAmountButton from './CristalAmountButton.js';

export default class Header extends Phaser.GameObjects.Container {
    constructor(scene, text,isLoggedIn) {
      super(scene);

      //this.backButton = this.add.text(50, 50, '＜', {
      this.backButton = scene.add.text(50, 50, '＜', {fontSize: '24px',fill: '#fff' }).setOrigin(0.5).setInteractive();
      this.backButton.on('pointerdown', () => {
        scene.scene.start('MainScene');
      });
      this.backButton.on('pointerover', () => {
        scene.input.setDefaultCursor('pointer')
        this.backButton.setTint(0x44ff44);  // ホバー時に緑色にティント
      })
      this.backButton.on('pointerout', () => {
        scene.input.setDefaultCursor('default')
        this.backButton.clearTint();  // ホバーが外れたらティントをクリア
      });
      this.add(this.backButton)

      //this.add.text(400, 50, text, {fontSize: '48px',fill: '#fff'}).setOrigin(0.5);
      this.title = scene.add.text(400, 50, text, {fontSize: '48px',fill: '#fff'}).setOrigin(0.5);
      this.add(this.title)

      //クリスタル所持数を取得
      this.CristalAmountButton = new CristalAmountButton(scene, window.innerWidth*0.5, 50, isLoggedIn);
      this.add(this.CristalAmountButton)

      //this.add([this.backButton, this.title]);

      scene.add.existing(this); //シーンにこのコンテナを追加

  }
}