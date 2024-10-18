import Phaser from 'phaser'

export default class ModalContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, container) {
    super(scene, x, y)

    this.width = width
    this.height = height

    // 背景（半透明の黒）
    this.background = scene.add.rectangle(0, 0, width, height, 0x000000, 0.7)
    this.add(this.background)

    // モーダルウィンドウの本体
    this.window = scene.add.rectangle(0, 0, width - 40, height - 40, 0xffffff)
    this.add(this.window)

    container.setVisible(true)
    this.add(container)

    // 閉じるボタン
    this.closeButton = scene.add.image(0,  0, 'close').setDisplaySize(50, 50).setInteractive({ useHandCursor: true });
    this.closeButton.on('pointerdown', this.close, this);// 閉じるボタンのイベントリスナー
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