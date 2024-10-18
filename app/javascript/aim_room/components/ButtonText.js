import Phaser from 'phaser';

export default class Button extends Phaser.GameObjects.Container {

  constructor(scene, x, y, text, onClick) {
      super(scene, x, y);

      this.Button = scene.add.text(x, y, text, {fontSize: '15px',fill: '#000000',backgroundColor: '#4169e1',padding: { x: 10, y: 5 }}).setInteractive()

      this.Button.on('pointerdown', () => {
        onClick();
      });
      this.Button.on('pointerover', () => {// ボタンのホバーエフェクト
        scene.input.setDefaultCursor('pointer')
        this.Button.setTint(0x44ff44);  // ホバー時に緑色にティント
      });
      this.Button.on('pointerout', () => {
        scene.input.setDefaultCursor('default')
        this.Button.clearTint();  // ホバーが外れたらティントをクリア
      });
      this.add(this.Button);

      scene.add.existing(this);
  }
}