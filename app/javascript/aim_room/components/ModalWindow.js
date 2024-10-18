import Phaser from 'phaser'
//import ButtonText from './ButtonText.js';

export default class ModalWindow extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, content) {
    super(scene, x, y)

    this.width = width
    this.height = height

    // 背景（半透明の黒）
    this.background = scene.add.rectangle(0, 0, width, height, 0x000000, 0.7)
    this.add(this.background)

    // モーダルウィンドウの本体
    this.window = scene.add.rectangle(0, 0, width - 40, height - 40, 0xffffff)
    this.add(this.window)

    // コンテンツテキスト
    this.content = scene.add.text(0, -20, content, {
      fontSize: '24px',
      fill: '#000000',
      align: 'center',
      wordWrap: { width: width - 80 }
    }).setOrigin(0.5)
    this.add(this.content)

    // 閉じるボタン
    this.closeButton = new ButtonText(scene, width / 2 - 60, height / 2 - 60, '閉じる', () => {this.close()});
    this.add(this.closeButton)

    // シーンにこのコンテナを追加
    scene.add.existing(this)

    // 最初は非表示
    this.setVisible(false)
  }

  open() {
    this.setVisible(true)
  }

  close() {
    this.setVisible(false)
  }
}